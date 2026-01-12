def extract_features(row):
    """
    Extract Test-4 (Emotion) data from DB row and convert to ML format

    Order in DB:
    ...
    test4_q1, test4_q2, test4_q3, test4_q4,
    test4_q1_time, test4_q2_time, test4_q3_time, test4_q4_time
    """

    (
        _, _, _, _, _, _,            # test1
        _, _, _, _, _, _,            # test1 times
        _, _,                        # audio
        q1, q2, q3, q4,              # emotion answers (FLOAT)
        t1, t2, t3, t4               # time in milliseconds (BIGINT)
    ) = row

    # Convert answers to binary (0/1)
    q1 = 1 if float(q1) >= 0.5 else 0
    q2 = 1 if float(q2) >= 0.5 else 0
    q3 = 1 if float(q3) >= 0.5 else 0
    q4 = 1 if float(q4) >= 0.5 else 0

    # Convert milliseconds → seconds
    t1 = float(t1) / 1000.0
    t2 = float(t2) / 1000.0
    t3 = float(t3) / 1000.0
    t4 = float(t4) / 1000.0

    return [q1, q2, q3, q4, t1, t2, t3, t4]
