import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('evidence/diagrams', exist_ok=True)

# Helper to load default font or truetype
try:
    font_title = ImageFont.truetype("arial.ttf", 20)
    font_sub = ImageFont.truetype("arial.ttf", 15)
    font_bold = ImageFont.truetype("arialbd.ttf", 13)
    font_reg = ImageFont.truetype("arial.ttf", 12)
    font_small = ImageFont.truetype("arial.ttf", 10)
except Exception:
    font_title = font_sub = font_bold = font_reg = font_small = ImageFont.load_default()

C_FOREST = (21, 35, 28)
C_DEEPGREEN = (33, 64, 42)
C_MIST = (236, 236, 228)
C_AMBER = (139, 98, 34)
C_TAUPE = (160, 133, 105)
C_WHITE = (255, 255, 255)
C_BG = (248, 249, 246)
C_BORDER = (200, 205, 195)

def draw_rounded_box(draw, xy, fill, outline, radius=8):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=2)

# 1. Stakeholder Ecosystem Map
def generate_stakeholder_map():
    im = Image.new('RGB', (1000, 520), color=C_BG)
    draw = ImageDraw.Draw(im)
    
    # Title
    draw.text((40, 25), "AccessAudit — Stakeholder Ecosystem Map", font=font_title, fill=C_FOREST)
    draw.text((40, 55), "Conceptual mapping of primary developers, secondary compliance leads, and end-user beneficiaries", font=font_reg, fill=C_DEEPGREEN)
    
    # Core system center box
    draw_rounded_box(draw, (380, 180, 620, 320), fill=C_MIST, outline=C_DEEPGREEN, radius=12)
    draw.text((420, 210), "AccessAudit Core", font=font_sub, fill=C_FOREST)
    draw.text((405, 240), "Actionable Triage Engine", font=font_bold, fill=C_DEEPGREEN)
    draw.text((405, 265), "Impact ÷ Effort Prioritiser", font=font_small, fill=C_FOREST)
    draw.text((415, 285), "Inline Fix Guidance", font=font_small, fill=C_FOREST)
    
    # Group 1: Primary Users (Left)
    draw_rounded_box(draw, (40, 120, 320, 440), fill=C_WHITE, outline=C_DEEPGREEN, radius=10)
    draw.text((60, 140), "1. PRIMARY USERS: DEVELOPERS", font=font_bold, fill=C_DEEPGREEN)
    devs = [
        ("Front-End Engineers", "Author component markup, CSS, interactive states"),
        ("Full-Stack Developers", "Build templates, server-rendered views, forms"),
        ("UI Engineers / Prototypes", "Design systems, layout tokens, interactions"),
        ("Need:", "Fast top-5 queue, copyable fixes, zero jargon")
    ]
    y = 180
    for title, desc in devs:
        draw.text((60, y), f"• {title}", font=font_bold, fill=C_FOREST)
        draw.text((75, y+18), desc, font=font_small, fill=C_TAUPE)
        y += 60

    # Group 2: Secondary Stakeholders (Top Right)
    draw_rounded_box(draw, (680, 100, 960, 270), fill=C_WHITE, outline=C_AMBER, radius=10)
    draw.text((700, 115), "2. SECONDARY: QA & COMPLIANCE", font=font_bold, fill=C_AMBER)
    secs = [
        ("QA Automation Engineers", "Cypress/Playwright tests, bug logs"),
        ("Compliance Officers", "WCAG 2.2 AA audit verification"),
        ("Engineering Leads", "Sprint velocity, compliance ROI")
    ]
    y = 145
    for title, desc in secs:
        draw.text((700, y), f"• {title}", font=font_bold, fill=C_FOREST)
        draw.text((715, y+16), desc, font=font_small, fill=C_TAUPE)
        y += 38

    # Group 3: End Beneficiaries (Bottom Right)
    draw_rounded_box(draw, (680, 290, 960, 480), fill=C_WHITE, outline=C_FOREST, radius=10)
    draw.text((700, 305), "3. ULTIMATE BENEFICIARIES", font=font_bold, fill=C_FOREST)
    bens = [
        ("Screen Reader Users", "Blind / low-vision users needing semantic DOM"),
        ("Keyboard Navigators", "Motor-impaired users needing visible focus"),
        ("Color-Blind Users", "Require non-color cues & high contrast"),
        ("Cognitive Assistance", "Clear labels, predictable interactions")
    ]
    y = 335
    for title, desc in bens:
        draw.text((700, y), f"• {title}", font=font_bold, fill=C_DEEPGREEN)
        draw.text((715, y+16), desc, font=font_small, fill=C_TAUPE)
        y += 36

    # Arrows
    draw.line((320, 250, 380, 250), fill=C_DEEPGREEN, width=3)
    draw.line((620, 200, 680, 185), fill=C_AMBER, width=3)
    draw.line((620, 280, 680, 370), fill=C_FOREST, width=3)
    
    im.save('evidence/diagrams/stakeholder_map.png', 'PNG')
    print('Generated evidence/diagrams/stakeholder_map.png')

# 2. 11-Stage User Journey & Emotional Highs/Lows Curve
def generate_journey_emotion_curve():
    im = Image.new('RGB', (1050, 500), color=C_BG)
    draw = ImageDraw.Draw(im)
    
    draw.text((40, 25), "AccessAudit — 11-Stage Developer Journey & Emotional Valence Curve", font=font_title, fill=C_FOREST)
    draw.text((40, 55), "Emotional curve tracking developer sentiment from initial audit trigger through remediation & streak reward", font=font_reg, fill=C_DEEPGREEN)
    
    # Graph axes
    x_start = 80
    y_zero = 270 # neutral line
    draw.line((x_start, 110, x_start, 420), fill=C_BORDER, width=2) # Y-axis
    draw.line((x_start, y_zero, 1000, y_zero), fill=C_BORDER, width=2) # X-axis
    
    draw.text((20, 115), "+High", font=font_bold, fill=C_DEEPGREEN)
    draw.text((20, y_zero - 8), "Neutral", font=font_small, fill=C_TAUPE)
    draw.text((20, 405), "-Low", font=font_bold, fill=C_AMBER)
    
    stages = [
        ("S1: Trigger", 100, 280, "Neutral: Sprint accessibility task assigned"),
        ("S2: Tool Select", 180, 310, "Dip: Dread of seeing 200+ violations"),
        ("S3: Ingest Scan", 260, 250, "Relief: Instant 1-click scan in <2s"),
        ("S4: Score Ring", 350, 220, "Clarity: 78/100 score +8 delta acknowledged"),
        ("S5: Triage View", 440, 180, "Empowerment: Curated top-5 queue replaces chaos"),
        ("S6: Issue Inspect", 530, 200, "Focus: Inspects drawer, plain why-it-matters"),
        ("S7: Code Diff", 620, 160, "High: Copy-ready before/after fix displayed"),
        ("S8: Source Patch", 710, 190, "Concentration: Applies fix in code editor"),
        ("S9: Mark Fixed", 800, 140, "Peak High: Score animates, progress advances"),
        ("S10: Milestone", 890, 130, "Celebration: Confetti toast & streak increments"),
        ("S11: Sprint Share", 970, 150, "Satisfaction: Exports CSV report for review")
    ]
    
    # Plot curve
    points = [(s[1], s[2]) for s in stages]
    for i in range(len(points) - 1):
        draw.line((points[i][0], points[i][1], points[i+1][0], points[i+1][1]), fill=C_DEEPGREEN, width=4)
    
    # Plot dots and labels
    for name, x, y, desc in stages:
        draw.ellipse((x-6, y-6, x+6, y+6), fill=C_FOREST, outline=C_MIST, width=2)
        draw.text((x-25, 435), name.split(':')[0], font=font_bold, fill=C_FOREST)
        draw.text((x-30, y-22), name.split(':')[1].strip()[:9], font=font_small, fill=C_DEEPGREEN)
        
    im.save('evidence/diagrams/journey_emotion_curve.png', 'PNG')
    print('Generated evidence/diagrams/journey_emotion_curve.png')

# 3. Three Task Flows
def generate_task_flows():
    im = Image.new('RGB', (1100, 680), color=C_BG)
    draw = ImageDraw.Draw(im)
    
    draw.text((40, 20), "AccessAudit — Core Task Flow Architecture (Flows 1, 2, and 3)", font=font_title, fill=C_FOREST)
    draw.text((40, 48), "Flowcharts illustrating decision points, serverless execution, and UI state transitions", font=font_reg, fill=C_DEEPGREEN)
    
    # Flow 1
    y1 = 90
    draw.text((40, y1), "TASK FLOW 1: RUN AUDIT & READ SCORE", font=font_bold, fill=C_FOREST)
    f1_boxes = [
        ("Start: Click 'Re-run audit'", 40, y1+30, 200, y1+90),
        ("Select Source (Demo / HTML / URL)", 230, y1+30, 460, y1+90),
        ("If URL: Call /api/fetch-page (SSRF Check)", 490, y1+30, 740, y1+90),
        ("Execute axe.run() in Hidden Iframe", 770, y1+30, 980, y1+90),
        ("Calculate Score & Render Overview", 770, y1+110, 980, y1+170),
    ]
    for text, x1, yb1, x2, yb2 in f1_boxes:
        draw_rounded_box(draw, (x1, yb1, x2, yb2), fill=C_WHITE, outline=C_DEEPGREEN)
        draw.text((x1+10, yb1+20), text, font=font_small, fill=C_FOREST)
    # connectors
    draw.line((200, y1+60, 230, y1+60), fill=C_DEEPGREEN, width=2)
    draw.line((460, y1+60, 490, y1+60), fill=C_DEEPGREEN, width=2)
    draw.line((740, y1+60, 770, y1+60), fill=C_DEEPGREEN, width=2)
    draw.line((875, y1+90, 875, y1+110), fill=C_DEEPGREEN, width=2)

    # Flow 2
    y2 = 290
    draw.text((40, y2), "TASK FLOW 2: INSPECT & REMEDIATE TOP ISSUE", font=font_bold, fill=C_FOREST)
    f2_boxes = [
        ("Review 'Fix These First' Card", 40, y2+30, 220, y2+90),
        ("Click Issue Row -> Slide Drawer Opens", 250, y2+30, 480, y2+90),
        ("Inspect Selectors & Plain 'Why Matters'", 510, y2+30, 740, y2+90),
        ("Click 'Copy fix' Code Diff Button", 770, y2+30, 980, y2+90),
        ("Apply Patch to Local Source Code", 770, y2+110, 980, y2+170),
    ]
    for text, x1, yb1, x2, yb2 in f2_boxes:
        draw_rounded_box(draw, (x1, yb1, x2, yb2), fill=C_WHITE, outline=C_AMBER)
        draw.text((x1+10, yb1+20), text, font=font_small, fill=C_FOREST)
    draw.line((220, y2+60, 250, y2+60), fill=C_AMBER, width=2)
    draw.line((480, y2+60, 510, y2+60), fill=C_AMBER, width=2)
    draw.line((740, y2+60, 770, y2+60), fill=C_AMBER, width=2)
    draw.line((875, y2+90, 875, y2+110), fill=C_AMBER, width=2)

    # Flow 3
    y3 = 490
    draw.text((40, y3), "TASK FLOW 3: MARK FIXED & VERIFY PROGRESS", font=font_bold, fill=C_FOREST)
    f3_boxes = [
        ("Click 'Mark as fixed' Button", 40, y3+30, 220, y3+90),
        ("Recalculate Weighted Score & Delta", 250, y3+30, 480, y3+90),
        ("Update Streak & Advance Progress", 510, y3+30, 740, y3+90),
        ("Check Milestone (25/50/75/100%)", 770, y3+30, 980, y3+90),
        ("Trigger Confetti & Update Scatter Plot", 770, y3+110, 980, y3+170),
    ]
    for text, x1, yb1, x2, yb2 in f3_boxes:
        draw_rounded_box(draw, (x1, yb1, x2, yb2), fill=C_WHITE, outline=C_TAUPE)
        draw.text((x1+10, yb1+20), text, font=font_small, fill=C_FOREST)
    draw.line((220, y3+60, 250, y3+60), fill=C_TAUPE, width=2)
    draw.line((480, y3+60, 510, y3+60), fill=C_TAUPE, width=2)
    draw.line((740, y3+60, 770, y3+60), fill=C_TAUPE, width=2)
    draw.line((875, y3+90, 875, y3+110), fill=C_TAUPE, width=2)

    im.save('evidence/diagrams/task_flows.png', 'PNG')
    print('Generated evidence/diagrams/task_flows.png')

# 4. Sitemap & Navigation Architecture
def generate_sitemap():
    im = Image.new('RGB', (1000, 460), color=C_BG)
    draw = ImageDraw.Draw(im)
    
    draw.text((40, 25), "AccessAudit — Information Architecture & Sitemap", font=font_title, fill=C_FOREST)
    draw.text((40, 55), "Hierarchical routing structure matching production single-page application routes", font=font_reg, fill=C_DEEPGREEN)
    
    # Root
    draw_rounded_box(draw, (400, 95, 600, 145), fill=C_FOREST, outline=C_DEEPGREEN)
    draw.text((440, 110), "AccessAudit Root (/)", font=font_bold, fill=C_WHITE)
    
    # Persistent Sidebar Hub
    draw_rounded_box(draw, (380, 175, 620, 220), fill=C_MIST, outline=C_DEEPGREEN)
    draw.text((400, 190), "Persistent Glass Sidebar (Navigation Rail)", font=font_small, fill=C_FOREST)
    draw.line((500, 145, 500, 175), fill=C_DEEPGREEN, width=2)
    
    # Views
    views = [
        ("Overview View", "(Default Dashboard)", 40, 280, 190, 360),
        ("Issues View", "(Full Filterable Catalog)", 220, 280, 380, 360),
        ("Pages View", "(Per-Page Audit Density)", 410, 280, 570, 360),
        ("Reports View", "(JSON, CSV, Print Layout)", 600, 280, 760, 360),
        ("Settings View", "(Project & Local Storage)", 790, 280, 950, 360),
    ]
    
    draw.line((115, 250, 870, 250), fill=C_DEEPGREEN, width=2)
    draw.line((500, 220, 500, 250), fill=C_DEEPGREEN, width=2)
    
    for title, desc, x1, y1, x2, y2 in views:
        draw.line(((x1+x2)/2, 250, (x1+x2)/2, y1), fill=C_DEEPGREEN, width=2)
        draw_rounded_box(draw, (x1, y1, x2, y2), fill=C_WHITE, outline=C_DEEPGREEN)
        draw.text((x1+15, y1+15), title, font=font_bold, fill=C_FOREST)
        draw.text((x1+10, y1+38), desc, font=font_small, fill=C_TAUPE)

    # Global Overlays
    draw_rounded_box(draw, (200, 390, 480, 440), fill=C_WHITE, outline=C_AMBER)
    draw.text((220, 405), "Overlay: RunAuditModal (Demo/HTML/URL)", font=font_small, fill=C_AMBER)
    
    draw_rounded_box(draw, (520, 390, 800, 440), fill=C_WHITE, outline=C_AMBER)
    draw.text((540, 405), "Overlay: IssueDetailDrawer (Code & Diffs)", font=font_small, fill=C_AMBER)

    im.save('evidence/diagrams/sitemap_architecture.png', 'PNG')
    print('Generated evidence/diagrams/sitemap_architecture.png')

# 5. Digital Concept Sketches (A, B, C)
def generate_concept_sketches():
    im = Image.new('RGB', (1050, 520), color=C_WHITE)
    draw = ImageDraw.Draw(im)
    
    draw.text((40, 20), "Digital Concept Sketches (Not Hand-Drawn) — Initial Ideation Directions", font=font_title, fill=C_FOREST)
    draw.text((40, 50), "Exploration of three structural metaphors evaluated during the ideation phase", font=font_reg, fill=C_TAUPE)
    
    concepts = [
        ("Concept A: Dense Tabular Grid", 40, 90, 340, 470, [
            "Dense spreadsheet data table",
            "Multi-column sorting (10 params)",
            "Pagination (10/25/50 rows)",
            "Bulk multi-select checkboxes",
            "Raw uncurated error dumping",
            "High cognitive load & triage paralysis"
        ]),
        ("Concept B: Prioritised Dev Dashboard (Selected)", 370, 90, 680, 470, [
            "Modular bento glass grid",
            "Accessibility score ring (78/100)",
            "Curated 'Fix These First' (top 5)",
            "Inline monospace code snippets",
            "Impact vs Effort scatter plot",
            "Balanced overview + rapid action"
        ]),
        ("Concept C: Gamified Stepper Wizard", 710, 90, 1010, 470, [
            "Linear step-by-step assistant",
            "One single violation per screen",
            "XP points, levels & avatar badges",
            "Rigid, unskippable step sequence",
            "Over-gamified for sprint work",
            "Restricts experienced developer speed"
        ])
    ]
    
    for title, x1, y1, x2, y2, bullets in concepts:
        border_col = C_DEEPGREEN if "Selected" in title else C_BORDER
        draw_rounded_box(draw, (x1, y1, x2, y2), fill=C_BG, outline=border_col, radius=8)
        draw.text((x1+15, y1+15), title, font=font_bold, fill=C_FOREST)
        draw.line((x1+10, y1+45, x2-10, y1+45), fill=border_col, width=1)
        
        # Mini sketch mockup
        draw.rectangle((x1+20, y1+60, x2-20, y1+180), fill=C_WHITE, outline=C_BORDER)
        if "Concept A" in title:
            for ly in range(y1+80, y1+170, 20):
                draw.line((x1+25, ly, x2-25, ly), fill=C_BORDER, width=1)
        elif "Concept B" in title:
            draw.ellipse((x1+35, y1+75, x1+85, y1+125), fill=C_BG, outline=C_DEEPGREEN, width=2)
            draw.rectangle((x1+100, y1+75, x2-30, y1+125), fill=C_BG, outline=C_DEEPGREEN)
            draw.rectangle((x1+35, y1+135, x2-30, y1+170), fill=C_BG, outline=C_AMBER)
        else:
            draw.rectangle((x1+40, y1+75, x2-40, y1+140), fill=C_BG, outline=C_TAUPE)
            draw.text((x1+65, y1+95), "Step 1 of 42", font=font_small, fill=C_TAUPE)
            draw.rectangle((x1+80, y1+150, x2-80, y1+170), fill=C_DEEPGREEN, outline=C_DEEPGREEN)
        
        y = y1 + 200
        for b in bullets:
            draw.text((x1+20, y), f"• {b}", font=font_small, fill=C_FOREST)
            y += 28

    im.save('evidence/diagrams/concept_sketches.png', 'PNG')
    print('Generated evidence/diagrams/concept_sketches.png')

# 6. Grayscale Annotated Wireframe
def generate_grayscale_wireframes():
    im = Image.new('RGB', (1050, 600), color=C_WHITE)
    draw = ImageDraw.Draw(im)
    
    draw.text((40, 20), "Grayscale Annotated Wireframe — Executive Overview Dashboard", font=font_title, fill=C_FOREST)
    draw.text((40, 48), "Numbered callouts referencing spatial hierarchy and key interaction zones", font=font_reg, fill=C_TAUPE)
    
    # Outer frame
    draw_rounded_box(draw, (40, 80, 1010, 560), fill=C_BG, outline=C_BORDER, radius=12)
    
    # Left sidebar
    draw.rectangle((45, 85, 110, 555), fill=(230, 230, 230), outline=C_BORDER)
    for iy in range(120, 320, 40):
        draw.rectangle((65, iy, 90, iy+25), fill=(200, 200, 200), outline=C_BORDER)
        
    # Topbar
    draw.rectangle((125, 95, 995, 140), fill=C_WHITE, outline=C_BORDER)
    draw.text((140, 110), "[Search pages, issues...]", font=font_small, fill=(150, 150, 150))
    draw.rectangle((860, 103, 980, 132), fill=(180, 180, 180), outline=C_BORDER)
    draw.text((880, 112), "Re-run audit", font=font_small, fill=C_WHITE)
    
    # Bento Row 1: Score Ring + 3 Cards
    draw.rectangle((125, 155, 420, 255), fill=C_WHITE, outline=C_BORDER) # Score Ring
    draw.ellipse((145, 170, 225, 245), fill=C_BG, outline=(100, 100, 100), width=4)
    draw.text((170, 195), "78", font=font_bold, fill=C_FOREST)
    draw.text((245, 185), "Accessibility Score", font=font_bold, fill=C_FOREST)
    draw.text((245, 210), "+8 since last audit", font=font_small, fill=(100, 100, 100))
    
    # Stat cards
    draw.rectangle((435, 155, 610, 255), fill=C_WHITE, outline=C_BORDER)
    draw.text((450, 170), "3 Critical", font=font_bold, fill=C_FOREST)
    draw.rectangle((625, 155, 800, 255), fill=C_WHITE, outline=C_BORDER)
    draw.text((640, 170), "7 Serious", font=font_bold, fill=C_FOREST)
    draw.rectangle((815, 155, 995, 255), fill=C_WHITE, outline=C_BORDER)
    draw.text((830, 170), "12 Minor", font=font_bold, fill=C_FOREST)

    # Bento Row 2: Fix These First (Left)
    draw.rectangle((125, 270, 680, 545), fill=C_WHITE, outline=C_BORDER)
    draw.text((145, 285), "Fix These First (Top 5 Ranked by Impact ÷ Effort)", font=font_bold, fill=C_FOREST)
    for ry in range(320, 520, 42):
        draw.line((140, ry, 665, ry), fill=(240, 240, 240), width=1)
        draw.rectangle((145, ry+6, 210, ry+26), fill=(220, 220, 220), outline=C_BORDER) # badge
        draw.text((220, ry+8), "1.4.3 Contrast", font=font_small, fill=C_FOREST)
        draw.rectangle((360, ry+6, 520, ry+26), fill=(240, 240, 240), outline=C_BORDER) # code
        draw.rectangle((540, ry+6, 650, ry+26), fill=(160, 160, 160), outline=C_BORDER) # button

    # Bento Row 2: Right Column (Progress + Scatter)
    draw.rectangle((695, 270, 995, 385), fill=C_WHITE, outline=C_BORDER)
    draw.text((710, 285), "Your Progress & 3-Day Streak", font=font_bold, fill=C_FOREST)
    draw.rectangle((710, 320, 970, 335), fill=(220, 220, 220), outline=C_BORDER)
    draw.rectangle((710, 320, 800, 335), fill=(100, 100, 100), outline=C_BORDER)
    
    draw.rectangle((695, 400, 995, 545), fill=C_WHITE, outline=C_BORDER)
    draw.text((710, 415), "Impact vs Effort Scatter Plot", font=font_bold, fill=C_FOREST)
    draw.rectangle((715, 435, 975, 530), fill=C_BG, outline=C_BORDER)

    # Numbered Callouts
    callouts = [
        ("1", 130, 160, "1: Accessibility Score Ring & Delta"),
        ("2", 440, 160, "2: Severity Breakdown Sparkline Cards"),
        ("3", 130, 280, "3: Prioritised 5-Issue Action Queue"),
        ("4", 365, 330, "4: Contextual Monospace Code Snippet"),
        ("5", 705, 280, "5: Progress Tracker & Daily Streak"),
        ("6", 705, 410, "6: 2x2 Impact vs Effort Scatter Plot")
    ]
    for num, cx, cy, label in callouts:
        draw.ellipse((cx-10, cy-10, cx+10, cy+10), fill=(200, 50, 50), outline=C_WHITE, width=2)
        draw.text((cx-4, cy-7), num, font=font_bold, fill=C_WHITE)

    im.save('evidence/diagrams/grayscale_wireframes.png', 'PNG')
    print('Generated evidence/diagrams/grayscale_wireframes.png')

# 7. Persona Cards
def generate_persona_cards():
    im = Image.new('RGB', (1050, 560), color=C_BG)
    draw = ImageDraw.Draw(im)
    
    draw.text((40, 20), "AccessAudit — User Personas (Provisional - Pre-Research)", font=font_title, fill=C_FOREST)
    draw.text((40, 48), "Provisional archetypes synthesized from developer workflow models; subject to real interview data", font=font_reg, fill=C_TAUPE)
    
    # Persona 1: Alex Rivera
    draw_rounded_box(draw, (40, 80, 500, 520), fill=C_WHITE, outline=C_DEEPGREEN, radius=12)
    draw.text((60, 100), "ALEX RIVERA (28)", font=font_bold, fill=C_DEEPGREEN)
    draw.text((60, 122), "Role: Front-End Engineer | B2B SaaS Startup", font=font_small, fill=C_TAUPE)
    draw.text((60, 138), "Status: Provisional (Pre-Research) [PENDING: R-01]", font=font_small, fill=C_AMBER)
    draw.line((60, 158, 480, 158), fill=C_BORDER, width=1)
    
    p1_details = [
        ("Background:", "Writes React, Next.js, and Tailwind components under tight 2-week sprints."),
        ("Primary Goal:", "Clear sprint tickets rapidly without failing automated accessibility PR checks."),
        ("Frustrations:", "Drowning in 100+ unranked warnings; lacks time to read academic W3C specifications."),
        ("Needs:", "Curated top-5 fixes, copy-ready code diffs, plain-language 'Why it matters'."),
        ("Key Quote:", "\"Just tell me what lines of code to change so I can ship my sprint feature.\"")
    ]
    y = 175
    for h, d in p1_details:
        draw.text((60, y), h, font=font_bold, fill=C_FOREST)
        draw.text((60, y+18), d, font=font_reg, fill=C_DEEPGREEN)
        y += 65

    # Persona 2: Priya Sharma
    draw_rounded_box(draw, (540, 80, 1000, 520), fill=C_WHITE, outline=C_AMBER, radius=12)
    draw.text((560, 100), "PRIYA SHARMA (34)", font=font_bold, fill=C_AMBER)
    draw.text((560, 122), "Role: Lead QA & Accessibility Specialist | Digital Agency", font=font_small, fill=C_TAUPE)
    draw.text((560, 138), "Status: Provisional (Pre-Research) [PENDING: R-02]", font=font_small, fill=C_AMBER)
    draw.line((560, 158, 980, 158), fill=C_BORDER, width=1)
    
    p2_details = [
        ("Background:", "Oversees accessibility compliance across 4 client product teams."),
        ("Primary Goal:", "Verify certified WCAG 2.2 AA compliance and prove remediation ROI to leadership."),
        ("Frustrations:", "Developers resist massive bug backlogs; audits feel like punitive scorecards."),
        ("Needs:", "Structured prioritization, sprint progress persistence, CSV/JSON report exports."),
        ("Key Quote:", "\"When I hand devs a 50-page PDF, they give up. A curated top 5 gets fixed before lunch.\"")
    ]
    y = 175
    for h, d in p2_details:
        draw.text((560, y), h, font=font_bold, fill=C_FOREST)
        draw.text((560, y+18), d, font=font_reg, fill=C_DEEPGREEN)
        y += 65

    im.save('evidence/diagrams/persona_cards.png', 'PNG')
    print('Generated evidence/diagrams/persona_cards.png')

# 8. Technical Architecture Diagram
def generate_system_architecture():
    im = Image.new('RGB', (1050, 500), color=C_BG)
    draw = ImageDraw.Draw(im)
    
    draw.text((40, 20), "AccessAudit — Technical Architecture & Sandboxed Execution Model", font=font_title, fill=C_FOREST)
    draw.text((40, 48), "Client-side sandboxed iframe execution paired with Vercel serverless proxy for SSRF defense", font=font_reg, fill=C_DEEPGREEN)
    
    # Client Tier
    draw_rounded_box(draw, (40, 90, 550, 450), fill=C_WHITE, outline=C_DEEPGREEN, radius=10)
    draw.text((60, 105), "CLIENT BROWSER (Vite + React 18 + TypeScript SPA)", font=font_bold, fill=C_DEEPGREEN)
    
    draw_rounded_box(draw, (60, 140, 530, 210), fill=C_MIST, outline=C_DEEPGREEN)
    draw.text((80, 155), "UI Layer (Glassmorphism + Tailwind CSS)", font=font_bold, fill=C_FOREST)
    draw.text((80, 175), "Dashboard Overview, Detail Drawer, Reports, Issues Catalog", font=font_small, fill=C_TAUPE)
    
    draw_rounded_box(draw, (60, 230, 530, 320), fill=C_MIST, outline=C_AMBER)
    draw.text((80, 245), "Sandboxed Hidden Iframe (<iframe sandbox=\"allow-same-origin\">)", font=font_bold, fill=C_AMBER)
    draw.text((80, 268), "axe-core 4.10 runtime executes against isolated DOM tree", font=font_small, fill=C_FOREST)
    draw.text((80, 290), "Prevents hostile script execution; evaluates real rendered nodes", font=font_small, fill=C_DEEPGREEN)

    draw_rounded_box(draw, (60, 340, 530, 420), fill=C_MIST, outline=C_DEEPGREEN)
    draw.text((80, 355), "Client Prioritisation Engine & State Store", font=font_bold, fill=C_DEEPGREEN)
    draw.text((80, 375), "Formula: Impact ÷ Effort | Zustand Store + localStorage versioning", font=font_small, fill=C_FOREST)
    draw.text((80, 395), "Streak Date Computation & Milestone Confetti Controller", font=font_small, fill=C_TAUPE)

    # Serverless Proxy Tier
    draw_rounded_box(draw, (620, 90, 1000, 290), fill=C_WHITE, outline=C_AMBER, radius=10)
    draw.text((640, 105), "VERCEL SERVERLESS PROXY (/api/fetch-page)", font=font_bold, fill=C_AMBER)
    draw.text((640, 135), "• SSRF Security Filter: blocks localhost, 127.0.0.0/8,", font=font_small, fill=C_FOREST)
    draw.text((655, 155), "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, IPv6 loopbacks", font=font_small, fill=C_FOREST)
    draw.text((640, 180), "• Script Stripper: removes <script> and on* inline handlers", font=font_small, fill=C_FOREST)
    draw.text((640, 205), "• Base Injector: injects <base href> for asset loading", font=font_small, fill=C_FOREST)
    draw.text((640, 230), "• Timeout Guardian: 10s AbortController watchdog", font=font_small, fill=C_FOREST)

    # External Web Tier
    draw_rounded_box(draw, (620, 330, 1000, 450), fill=C_WHITE, outline=C_FOREST, radius=10)
    draw.text((640, 345), "EXTERNAL WEB TARGET (Audited URL)", font=font_bold, fill=C_FOREST)
    draw.text((640, 375), "Remote HTML page requested by user.", font=font_reg, fill=C_DEEPGREEN)
    draw.text((640, 400), "Safe fetch prevents direct client CORS failure", font=font_small, fill=C_TAUPE)
    draw.text((640, 420), "and blocks internal network reconnaissance.", font=font_small, fill=C_TAUPE)

    # Connections
    draw.line((530, 200, 620, 180), fill=C_DEEPGREEN, width=3)
    draw.line((810, 290, 810, 330), fill=C_AMBER, width=3)
    draw.line((530, 275, 620, 220), fill=C_DEEPGREEN, width=2)

    im.save('evidence/diagrams/system_architecture.png', 'PNG')
    print('Generated evidence/diagrams/system_architecture.png')

if __name__ == '__main__':
    generate_stakeholder_map()
    generate_journey_emotion_curve()
    generate_task_flows()
    generate_sitemap()
    generate_concept_sketches()
    generate_grayscale_wireframes()
    generate_persona_cards()
    generate_system_architecture()

