import requests
from groq_client import ask_groq
from pdf_generator import make_pdf
from cloudinary_uploader import upload_pdf
from utils.db import get_connection

def save_report_url(session_id, url):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE child_assessment_features SET report_url=%s WHERE id=%s",
        (url, session_id)
    )
    conn.commit()
    conn.close()

def run_pipeline(session_id):
    base = "http://localhost:5000/predict"

    data = {
        "math": requests.post(f"{base}/dyscalculia",json={"session_id":session_id}).json(),
        "reading": requests.post(f"{base}/reading_disability",json={"session_id":session_id}).json(),
        "emotion": requests.post(f"{base}/emotion",json={"session_id":session_id}).json(),
        "hearing": requests.post(f"{base}/test5",json={"session_id":session_id}).json(),
        "cognition": requests.post(f"{base}/test6",json={"session_id":session_id}).json(),
        "handwriting": requests.post(f"{base}/handwriting",json={"session_id":session_id}).json(),
    }

    llm_report = ask_groq(data)
    pdf_path = make_pdf(data, llm_report)
    url = upload_pdf(pdf_path)

    save_report_url(session_id, url)

    print("📄 Report ready:", url)
