from flask import Flask, request, jsonify
import psycopg2
import numpy as np
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Load trained model
model = joblib.load("model/dysgraphia.pkl")

# Connect to Neon
conn = psycopg2.connect(os.getenv("NEON_DB_URL"))

# ------------------ Feature Extraction ------------------

def extract_features(row):
    q = np.array(row[:6], dtype=float)
    t = np.array(row[6:], dtype=float)

    accuracy = np.mean(q)
    mean_time = np.mean(t)
    std_time = np.std(t)
    fatigue = t[5] - t[0]
    switch_cost = np.mean(t[3:]) - np.mean(t[:3])
    efficiency = accuracy / max(mean_time, 0.1)

    count_error = 1 - q[0]
    compare_error = 1 - q[1]
    add_error = 1 - q[3]
    money_error = 1 - q[4]
    subtract_error = 1 - q[5]

    return np.array([[
        accuracy,
        mean_time,
        std_time,
        fatigue,
        switch_cost,
        efficiency,
        count_error,
        compare_error,
        add_error,
        money_error,
        subtract_error
    ]])

# ------------------ Prediction Route ------------------

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    session_id = data.get("session_id")

    cursor = conn.cursor()

    cursor.execute("""
        SELECT
        test1_q1, test1_q2, test1_q3, test1_q4, test1_q5, test1_q6,
        test1_q1_time, test1_q2_time, test1_q3_time,
        test1_q4_time, test1_q5_time, test1_q6_time
        FROM child_assessment_features
        WHERE session_id = %s
    """, (session_id,))

    row = cursor.fetchone()

    if not row:
        return jsonify({"error": "Session not found"}), 404

    X = extract_features(row)
    pred = int(model.predict(X)[0])
    probs = model.predict_proba(X)[0]

    labels = ["Normal", "Low Risk", "Medium Risk", "High Risk", "Slow Learner"]

    return jsonify({
        "session_id": session_id,
        "prediction": labels[pred],
        "confidence": round(float(max(probs)) * 100, 2),
        "probabilities": {
            labels[i]: round(float(probs[i]) * 100, 2)
            for i in range(5)
        }
    })

# ------------------ Run Server ------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
