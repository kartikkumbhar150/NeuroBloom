from utils.db import get_connection

def save_report_url(session_id, url):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE child_assessment_features
        SET report_url = %s
        WHERE id = %s
        """,
        (url, session_id)
    )

    conn.commit()
    cur.close()
    conn.close()
