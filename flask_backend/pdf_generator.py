from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
import json
import os
import time

def create_pdf(full_json, llm_response):
    try:
        llm_data = json.loads(llm_response) if isinstance(llm_response, str) else llm_response
    except:
        llm_data = None

    os.makedirs("reports", exist_ok=True)
    filename = f"reports/{full_json.get('session_id', 'report')}.pdf"
    
    doc = SimpleDocTemplate(filename, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    styles = getSampleStyleSheet()
    story = []

    # --- Custom Clinical Branding Styles ---
    brand_color = colors.HexColor("#1A5276")  # Deep Clinical Blue
    accent_color = colors.HexColor("#EBF5FB") # Light Blue Background
    
    title_style = ParagraphStyle('TitleStyle', parent=styles['Title'], fontSize=26, textColor=brand_color, spaceAfter=5, alignment=1)
    subtitle_style = ParagraphStyle('SubTitle', parent=styles['Normal'], fontSize=10, textColor=colors.grey, alignment=1, spaceAfter=20)
    header_style = ParagraphStyle('HeaderStyle', parent=styles['Heading2'], fontSize=14, textColor=brand_color, spaceBefore=15, spaceAfter=10, borderPadding=5)
    normal_style = ParagraphStyle('NormalStyle', parent=styles['Normal'], fontSize=10, leading=14)
    label_style = ParagraphStyle('LabelStyle', parent=styles['Normal'], fontSize=10, fontName='Helvetica-Bold')

    # 1. Professional Header
    story.append(Paragraph("NeuroBloom", title_style))
    story.append(Paragraph("Neurodevelopmental Screening & Clinical Assessment", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=brand_color, spaceAfter=20))

    # 2. Patient Information Grid (Kartik Kumbhar)
    patient_data = [
        [Paragraph("<b>Patient Name:</b> Kartik Kumbhar", normal_style), Paragraph("<b>Age:</b> 6 Years", normal_style)],
        [Paragraph("<b>Gender:</b> Male", normal_style), Paragraph(f"<b>Date:</b> {time.strftime('%Y-%m-%d')}", normal_style)],
        [Paragraph(f"<b>Session ID:</b> {full_json.get('session_id', 'N/A')}", normal_style), Paragraph("<b>Status:</b> Confirmed", normal_style)]
    ]
    
    patient_table = Table(patient_data, colWidths=[3*inch, 3*inch])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), accent_color),
        ('BOX', (0, 0), (-1, -1), 1, brand_color),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(patient_table)
    story.append(Spacer(1, 0.4 * inch))

    # 3. Clinical Executive Summary
    story.append(Paragraph("1. Diagnostic Screening Summary", header_style))
    if llm_data and "screenings" in llm_data:
        data = [["Disability/Domain", "Risk Level", "Clinical Observation"]]
        for item in llm_data["screenings"]:
            # Logic to color-code risk (High/Medium/Low)
            risk_text = item['status'].upper()
            data.append([item['disability'], risk_text, Paragraph(item['finding'], normal_style)])

        t = Table(data, colWidths=[1.5*inch, 1*inch, 4*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), brand_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
        ]))
        story.append(t)

    # 4. Behavioral Profile (Strengths/Weaknesses)
    story.append(Spacer(1, 0.2 * inch))
    if llm_data and "overall_assessment" in llm_data:
        # Side-by-side Table for Strengths and Weaknesses
        sw_data = [
            [Paragraph("<b>Key Strengths</b>", header_style), Paragraph("<b>Areas for Support</b>", header_style)],
            [
                Paragraph("<br/>".join([f"• {s}" for s in llm_data["overall_assessment"]["strengths"]]), normal_style),
                Paragraph("<br/>".join([f"• {w}" for w in llm_data["overall_assessment"]["weaknesses"]]), normal_style)
            ]
        ]
        sw_table = Table(sw_data, colWidths=[3.2*inch, 3.2*inch])
        sw_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LINEBELOW', (0, 0), (-1, 0), 1, brand_color),
        ]))
        story.append(sw_table)

    # 5. Recommended Intervention (Detailed)
    if llm_data and "overall_assessment" in llm_data:
        story.append(PageBreak())
        story.append(Paragraph("2. Therapeutic Intervention Plan", header_style))
        for act in llm_data["overall_assessment"]["detailed_activities"]:
            story.append(Paragraph(f"<b>Activity:</b> {act['activity_name']}", normal_style))
            story.append(Paragraph(f"<b>Objective:</b> {act['goal']}", normal_style))
            story.append(Paragraph(f"<b>Methodology:</b> {act['instructions']}", normal_style))
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.lightgrey, spaceBefore=5, spaceAfter=10))

    # 6. Footer & Certification
    story.append(Spacer(1, 0.8 * inch))
    story.append(Paragraph("__________________________", normal_style))
    story.append(Paragraph("Clinical Reviewer Signature", normal_style))
    
    disclaimer_style = ParagraphStyle('Disclaimer', parent=styles['Italic'], fontSize=8, textColor=colors.grey, alignment=1)
    story.append(Spacer(1, 0.4 * inch))
    story.append(Paragraph("Note: This NeuroBloom report is an automated screening tool meant for clinical guidance. It is not a formal medical diagnosis.", disclaimer_style))

    doc.build(story)
    return filename