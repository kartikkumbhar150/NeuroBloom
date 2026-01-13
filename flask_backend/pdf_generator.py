from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import json
import os

def create_pdf(full_json, llm_text):
    os.makedirs("reports", exist_ok=True)

    filename = f"reports/{full_json['session_id']}.pdf"

    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(filename)
    story = []

    story.append(Paragraph("<b>NeuroBloom Cognitive Report</b>", styles['Title']))
    story.append(Spacer(1, 12))

    story.append(Paragraph("<b>Session ID:</b> " + full_json["session_id"], styles['Normal']))
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>AI Summary</b>", styles['Heading2']))
    story.append(Paragraph(llm_text.replace("\n","<br/>"), styles['Normal']))
    story.append(Spacer(1, 12))

    story.append(Paragraph("<b>Raw Model Output</b>", styles['Heading2']))
    story.append(Paragraph(json.dumps(full_json, indent=2), styles['Code']))

    doc.build(story)

    return filename
