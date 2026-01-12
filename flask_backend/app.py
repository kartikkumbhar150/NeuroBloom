from flask import Flask, request, jsonify
from utils.fetch import fetch_session
from utils.features import extract_features
from utils.model import predict
from flask import Flask, request, jsonify
from utils.fetch import fetch_session
from utils.audio import download_audio
from utils.speech import transcribe
from utils.features import extract_features
from utils.model import predict


app = Flask(__name__)

@app.route("/predict/dyscalculia", methods=["POST"])
def run_prediction():
    data = request.json
    session_id = data.get("session_id")

    row = fetch_session(session_id)

    if not row:
        return jsonify({"error": "Session not found"}), 404

    features = extract_features(row)
    result = predict(features)

    return jsonify({
        "session_id": session_id,
        **result
    })


@app.route("/predict/reading_disability", methods=["POST"])
def reading():
    session_id = request.json["session_id"]

    audio1, audio2 = fetch_session(session_id)

    f1 = download_audio(audio1)
    f2 = download_audio(audio2)

    w1 = transcribe(f1)
    w2 = transcribe(f2)

    words = w1 + w2

    features = extract_features(words)
    result = predict(features)

    return jsonify({
        "session_id": session_id,
        **features,
        **result
    })

from utils.fetch import fetch_session
from utils.features3 import extract_features
from utils.model3 import predict

@app.route("/predict/emotion", methods=["POST"])
def predict_emotion():
    data = request.json
    session_id = data.get("session_id")

    row = fetch_session(session_id)

    if not row:
        return jsonify({"error": "Session not found"}), 404

    features = extract_features(row)
    result = predict(features)

    return jsonify({
        "session_id": session_id,
        "emotion_features": features,
        **result
    })




if __name__ == "__main__":
    app.run(port=5000, debug=True)
