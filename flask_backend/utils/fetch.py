from utils.db import get_connection

def fetch_session(session_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
        test1_q1, test1_q1_time,
        test1_q2, test1_q2_time,
        test1_q3, test1_q3_time,
        test1_q4, test1_q4_time,
        test1_q5, test1_q5_time,
        test1_q6, test1_q6_time
        FROM child_assessment_features
        WHERE id=%s
    """, (session_id,))

    row = cur.fetchone()

    q = [row[0], row[2], row[4], row[6], row[8], row[10]]
    t = [row[1], row[3], row[5], row[7], row[9], row[11]]

    return q, t
