import numpy as np

def extract_features(q, t):
    q = np.array(q)
    t = np.array(t)

    accuracy = q.mean()
    early = q[:3].mean()
    late = q[3:].mean()

    fatigue = t[-1] - t[0]
    std = t.std()
    mean = t.mean()

    efficiency = q / np.clip(t, 0.1, None)

    visual_error = (1-q[0] + 1-q[1]) / 2
    planning_error = 1 - q[4]
    sequence_error = 1 - q[5]

    return [
        accuracy,
        early,
        late,
        late - early,
        mean,
        std,
        fatigue,
        efficiency.mean(),
        visual_error,
        planning_error,
        sequence_error
    ]
