import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()


GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.1-8b-instant"

def send_to_groq(report_json):
    """
    Sends full neuro-cognitive JSON to Groq AI
    Returns expert doctor-style analysis
    """

    prompt = f"""
You are a child psychologist AI.

The following JSON contains results from 6 cognitive tests:
Math, Reading, Emotion, Memory, Hearing, Handwriting.

Your job:
1. Identify learning disabilities (Dyslexia, Dyscalculia, ADHD, ASD, Dysgraphia)
2. Explain why based on data
3. List strengths
4. List weaknesses
5. Suggest therapies & activities
6. Give risk level

DATA:
{report_json}

Return in professional JSON format with sections:
diagnosis, reasons, strengths, weaknesses, therapies, school_support, risk_level
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a medical screening assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2
    }

    response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=30)

    if response.status_code != 200:
        raise Exception(response.text)

    return response.json()["choices"][0]["message"]["content"]
