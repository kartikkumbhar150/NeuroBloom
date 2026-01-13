from flask import Flask, request, jsonify
from utils.fetch import fetch_session
from utils.audio import download_audio
from utils.speech import transcribe
from utils.features_test6 import extract_features as extract_test6_features
from utils.test6_model import predict_test6
import numpy as np


# ================= MODELS =================

# Dyscalculia
from utils.features import extract_features as extract_math_features
from utils.model import predict as predict_math

# Reading (speech)
from utils.features2 import extract_features as extract_reading_features
from utils.model2 import predict as predict_reading

# Emotion
from utils.features3 import extract_features as extract_emotion_features
from utils.model3 import predict as predict_emotion


app = Flask(__name__)

# ---------------- Dyscalculia ----------------
@app.route("/predict/dyscalculia", methods=["POST"])
def run_prediction():
    session_id = request.json.get("session_id")

    row = fetch_session(session_id)
    if not row:
        return jsonify({"error": "Session not found"}), 404

    features = extract_math_features(row)
    result = predict_math(features)

    return jsonify({
        "session_id": session_id,
        **result
    })


# ---------------- Reading Disability ----------------
@app.route("/predict/reading_disability", methods=["POST"])
def reading():
    session_id = request.json.get("session_id")

    row = fetch_session(session_id)
    if not row:
        return jsonify({"error": "Session not found"}), 404

    audio1 = row[12]
    audio2 = row[13]

    f1 = download_audio(audio1)
    f2 = download_audio(audio2)

    w1 = transcribe(f1)
    w2 = transcribe(f2)

    words = w1 + w2

    features = extract_reading_features(words)
    result = predict_reading(features)

    return jsonify({
        "session_id": session_id,
        **features,
        **result
    })


# ---------------- Emotion ----------------
@app.route("/predict/emotion", methods=["POST"])
def emotion():
    session_id = request.json.get("session_id")

    row = fetch_session(session_id)
    if not row:
        return jsonify({"error": "Session not found"}), 404

    features = extract_emotion_features(row)
    result = predict_emotion(features)

    return jsonify({
        "session_id": session_id,
        "emotion_features": features,
        **result
    })

# ---------------- Test 6 : Visual + Memory + Logic ----------------
@app.route("/predict/test6", methods=["POST"])
def test6():
    session_id = request.json.get("session_id")

    row = fetch_session(session_id)
    if not row:
        return jsonify({"error": "Session not found"}), 404

    # Raw scores and times
    scores = [0 if x is None else int(x) for x in row[22:26]]
    times  = [8 if x is None else float(x) for x in row[26:30]]


    # ML features
    features = extract_test6_features(row)

    # ML prediction
    prediction = predict_test6(features)

    strengths = []
    weaknesses = []

    # Memory
    if scores[1] == 1:
        strengths.append("Strong visual working memory (can remember images well)")
    else:
        weaknesses.append("Weak image memory (forgets visual information)")

    # Spatial (mirror)
    if scores[2] == 1:
        strengths.append("Good visual-spatial ability")
    else:
        weaknesses.append("Mirror image confusion (spatial processing weak)")

    # Pattern
    if scores[3] == 1:
        strengths.append("Strong pattern and logical reasoning")
    else:
        weaknesses.append("Difficulty understanding patterns and sequences")

    # Processing speed
    avg_time = np.mean(times)
    if avg_time < 4:
        strengths.append("Fast thinking and response speed")
    else:
        weaknesses.append("Slow cognitive processing")

    # Attention stability
    if np.std(times) > 1.5:
        weaknesses.append("Inconsistent attention during tasks")

    return jsonify({
        "session_id": session_id,
        "test6_scores": {
            "odd_one_out": scores[0],
            "memory": scores[1],
            "mirror": scores[2],
            "pattern": scores[3]
        },
        "test6_times": {
            "odd_one_out": times[0],
            "memory": times[1],
            "mirror": times[2],
            "pattern": times[3]
        },
        "cognitive_prediction": prediction,
        "strengths": strengths,
        "weaknesses": weaknesses
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)
