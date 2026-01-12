import numpy as np

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


