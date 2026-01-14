import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()


GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.1-8b-instant"

def send_to_groq(report_json):
    """
    Sends neuro-cognitive JSON to Groq and gets a structured diagnostic response.
    """
    
    prompt = f"""
    You are a Child Neuropsychologist AI specializing in developmental disorders.
    
    TASK: Analyze the provided JSON data from 6 cognitive modules (Math, Reading, Emotion, Memory, Hearing, Handwriting) 
    and perform a clinical screening.

    STEP 1: For EACH disability listed below, determine the 'Risk Status' based on the data.
    Categories: Dyslexia, Dysgraphia, Dyscalculia, Auditory Processing Disorder (APD), Non-Verbal Learning Disability (NVLD), ADHD, Autism Spectrum Disorder (ASD).
    
    Allowed Statuses: "Not Detected", "Low Risk", "Medium Risk", "High Risk".

    STEP 2: Identify Child's Strengths and Weaknesses.
    STEP 3: Suggest a Detailed Action Plan (Therapies and Daily Activities).

    DATA TO ANALYZE:
    {report_json}

    STRICT JSON OUTPUT FORMAT:
    {{
      "screenings": [
        {{ "disability": "Dyslexia", "status": "Low Risk", "finding": "Reason based on reading speed/accuracy" }},
        {{ "disability": "Dysgraphia", "status": "Not Detected", "finding": "..." }},
        {{ "disability": "Dyscalculia", "status": "...", "finding": "..." }},
        {{ "disability": "Auditory Processing Disorder", "status": "...", "finding": "..." }},
        {{ "disability": "Non-verbal learning disabilities", "status": "...", "finding": "..." }},
        {{ "disability": "ADHD", "status": "...", "finding": "..." }},
        {{ "disability": "Autism Spectrum Disorder", "status": "...", "finding": "..." }}
      ],
      "overall_assessment": {{
        "strengths": ["list", "of", "strengths"],
        "weaknesses": ["list", "of", "weaknesses"],
        "detailed_activities": [
           {{ "activity_name": "...", "goal": "...", "instructions": "..." }}
        ],
        "therapies_suggested": ["Occupational Therapy", "Speech Therapy", etc.]
      }},
      "risk_level_summary": "Overall Clinical Risk Level (Low/Medium/High)"
    }}
    
    Final Note: Return ONLY the JSON object. No prose or conversation.
    """

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a professional medical screening assistant that only outputs JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1 # Kam temperature se consistency bani rehti hai
    }

    try:
        response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[GROQ ERROR] {e}")
        return None