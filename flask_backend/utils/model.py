import joblib

model = joblib.load("model/dysgraphia.pkl")

labels = ["Normal", "Low Risk", "Medium Risk", "High Risk", "Slow Learner"]

def predict(features):
    p = model.predict([features])[0]
    return labels[p]
