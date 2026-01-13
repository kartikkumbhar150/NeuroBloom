from flask import Flask, request, jsonify
from utils.fetch import fetch_session
from utils.audio import download_audio
from utils.speech import transcribe

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


if __name__ == "__main__":
    app.run(port=5000, debug=True)
