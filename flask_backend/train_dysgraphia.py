import psycopg2
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

print("Connecting to Neon DB...")

# ------------------ DB Connection ------------------
conn = psycopg2.connect(os.getenv("NEON_DB_URL"))

# ------------------ Fetch Data ------------------
query = """
SELECT
 test1_q1, test1_q2, test1_q3, test1_q4, test1_q5, test1_q6,
 test1_q1_time, test1_q2_time, test1_q3_time,
 test1_q4_time, test1_q5_time, test1_q6_time
FROM child_assessment_features
WHERE test1_q1 IS NOT NULL
"""

df = pd.read_sql(query, conn)

print("Rows loaded:", len(df))

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

    # Error types
    count_error = 1 - q[0]
    compare_error = 1 - q[1]
    add_error = 1 - q[3]
    money_error = 1 - q[4]
    subtract_error = 1 - q[5]

    return [
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
    ]

X = []
for _, row in df.iterrows():
    X.append(extract_features(row.values))

X = np.array(X)

# ------------------ Auto Labeling ------------------

def auto_label(x):
    acc, mean_time, std, fat, switch, eff, ce, cmp, add, mon, sub = x

    if acc > 0.85 and mean_time < 4 and eff > 0.15:
        return 0   # Normal
    if acc > 0.70:
        return 1   # Low Risk
    if acc > 0.55:
        return 2   # Medium Risk
    if acc > 0.35:
        return 3   # High Risk
    return 4       # Slow Learner

y = np.array([auto_label(x) for x in X])

print("Class distribution:", np.bincount(y))

# ------------------ Train Model ------------------

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=10,
    random_state=42
)

model.fit(X, y)

# ------------------ Save Model ------------------

os.makedirs("model", exist_ok=True)
joblib.dump(model, "model/dysgraphia.pkl")

print("Model trained and saved as model/dysgraphia.pkl")
