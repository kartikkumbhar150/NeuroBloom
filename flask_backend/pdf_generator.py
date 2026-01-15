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
        # Robust JSON parsing
        if isinstance(llm_response, str):
            # Strip markdown code blocks if present
            clean_json = llm_response.replace("```json", "").replace("```", "").strip()
            llm_data = json.loads(clean_json)
        else:
            llm_data = llm_response
    except Exception as e:
        print(f"[PDF ERROR] JSON Parsing Failed: {e}")
        return None

    os.makedirs("reports", exist_ok=True)
    session_id = full_json.get('session_id', 'report')
    filename = f"reports/{session_id}.pdf"
    
    doc = SimpleDocTemplate(filename, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    story = []

    # --- Clinical Branding Colors ---
    PRIMARY_BLUE = colors.HexColor("#1A5276")  
    SECONDARY_BLUE = colors.HexColor("#2980B9") 
    SOFT_BG = colors.HexColor("#F4F7F9")      
    DANGER_RED = colors.HexColor("#C0392B")
    WARNING_ORANGE = colors.HexColor("#E67E22")
    SUCCESS_GREEN = colors.HexColor("#27AE60")
    
    # --- Custom Styles ---
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=24, textColor=PRIMARY_BLUE, alignment=0)
    header_style = ParagraphStyle('Header', parent=styles['Heading2'], fontSize=14, textColor=PRIMARY_BLUE, spaceBefore=12, spaceAfter=8)
    normal_style = ParagraphStyle('Normal', parent=styles['Normal'], fontSize=10, leading=13)
    bold_style = ParagraphStyle('Bold', parent=styles['Normal'], fontSize=10, fontName='Helvetica-Bold')

    # 1. Header & Patient Info
    story.append(Paragraph("NeuroBloom Clinical Assessment", title_style))
    story.append(Paragraph("Neuro-Cognitive Screening & Diagnostic Analysis", styles['Normal']))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY_BLUE, spaceAfter=15))

    patient_info = [
        [Paragraph(f"<b>Patient:</b> {full_json.get('patient_name', 'Kartik Kumbhar')}", normal_style), 
         Paragraph(f"<b>Age/Sex:</b> 6 Years / Male", normal_style)],
        [Paragraph(f"<b>Session ID:</b> {session_id}", normal_style), 
         Paragraph(f"<b>Date:</b> {time.strftime('%B %d, %Y')}", normal_style)] # FIXED ERROR HERE
    ]
    meta_table = Table(patient_info, colWidths=[3.5*inch, 3.5*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SOFT_BG),
        ('BOX', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)

    # 2. Risk Matrix (Matching new prompt structure)
    story.append(Paragraph("I. Clinical Risk Screening Matrix", header_style))
    
    screenings = llm_data.get("screenings", [])
    if screenings:
        matrix_data = [[Paragraph("Disorder", bold_style), Paragraph("Risk Level", bold_style), Paragraph("Clinical Findings & Mechanism", bold_style)]]
        
        for item in screenings:
            status = item.get('status', 'N/A')
            # Dynamic Color Logic
            risk_color = SUCCESS_GREEN
            if "High" in status: risk_color = DANGER_RED
            elif "Medium" in status: risk_color = WARNING_ORANGE
            elif "Low" in status: risk_color = SECONDARY_BLUE

            finding_text = f"<b>Observation:</b> {item.get('finding', '')}<br/><b>Mechanism:</b> {item.get('biological_cause', 'Neurological processing delay')}"
            
            matrix_data.append([
                Paragraph(item.get('disability', 'N/A'), normal_style),
                Paragraph(f"<b>{status}</b>", ParagraphStyle('Status', parent=normal_style, textColor=risk_color)),
                Paragraph(finding_text, normal_style)
            ])

        t = Table(matrix_data, colWidths=[1.3*inch, 1.1*inch, 4.6*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_BLUE),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(t)

    # 3. Strengths & Weaknesses
    story.append(Spacer(1, 15))
    story.append(Paragraph("II. Developmental Profile", header_style))
    
    profile = llm_data.get("child_profile", {})
    strengths = profile.get("strengths", [])
    weaknesses = profile.get("weaknesses", [])
    
    sw_data = [
        [Paragraph("<b>Key Cognitive Strengths</b>", normal_style), Paragraph("<b>Identified Vulnerabilities</b>", normal_style)],
        [
            Paragraph("<br/>".join([f"• <b>{s['area']}:</b> {s['description']}" for s in strengths]), normal_style),
            Paragraph("<br/>".join([f"• <b>{w['area']}:</b> {w['description']}" for w in weaknesses]), normal_style)
        ]
    ]
    sw_table = Table(sw_data, colWidths=[3.5*inch, 3.5*inch])
    sw_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW', (0, 0), (-1, 0), 1, PRIMARY_BLUE),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(sw_table)

    # 4. Parental Precautions
    precautions = profile.get("parental_precautions", [])
    if precautions:
        story.append(Spacer(1, 10))
        story.append(Paragraph("Parental Management & Environmental Adjustments", bold_style))
        for p in precautions:
            story.append(Paragraph(f"• {p}", normal_style))

    # 5. Interventions (Page 2)
    story.append(PageBreak())
    story.append(Paragraph("III. Therapeutic Intervention Plan", header_style))
    
    interventions = llm_data.get("intervention_plan", {})
    activities = interventions.get("daily_activities", [])
    
    for act in activities:
        story.append(Spacer(1, 8))
        act_box = [[Paragraph(f"<b>Activity: {act.get('name', 'N/A')}</b>", normal_style)],
                    [Paragraph(f"<b>Goal:</b> {act.get('goal', 'N/A')}", normal_style)],
                    [Paragraph(f"<b>Instructions:</b> {act.get('instructions', 'N/A')}", normal_style)]]
        at = Table(act_box, colWidths=[6.8*inch])
        at.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), SOFT_BG),
            ('LINELEFT', (0,0), (0,-1), 4, SECONDARY_BLUE),
            ('PADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(at)

    # Therapies
    therapies = interventions.get("therapeutic_recommendations", [])
    if therapies:
        story.append(Spacer(1, 15))
        story.append(Paragraph("Recommended Professional Services", bold_style))
        for therapy in therapies:
            story.append(Paragraph(f"• <b>{therapy['therapy']}:</b> {therapy['reason']}", normal_style))

    # 6. Footer
    story.append(Spacer(1, 40))
    story.append(Paragraph("__________________________", normal_style))
    story.append(Paragraph("Certified Clinical Reviewer", normal_style))
    story.append(Paragraph(f"Date Signed: {time.strftime('%d/%m/%Y')}", styles['Italic']))

    doc.build(story)
    return filename