# build_pdf.py
# Generates submission-ready PDF report for AccessAudit UI/UX Project
# Uses ReportLab with A4, 1.5" left margin, 1.0" top/bottom/right, Times-Roman, 1.5 line spacing.

import os
import re
from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image as RLImage, KeepTogether, HRFlowable, Flowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.lib import colors
from reportlab.pdfgen import canvas
import pypdf

from report_data import (
    CERTIFICATE_DATA, ABSTRACT_TEXT, TOC_ITEMS, LIST_OF_FIGURES, LIST_OF_TABLES,
    CHAPTERS, REFERENCES, APPENDICES
)

# Colors
COLOR_FOREST = colors.HexColor("#15231C")
COLOR_DEEPGREEN = colors.HexColor("#21402A")
COLOR_MIST = colors.HexColor("#ECECE4")
COLOR_AMBER = colors.HexColor("#8B6222")
COLOR_TAUPE = colors.HexColor("#A08569")
COLOR_BG_LIGHT = colors.HexColor("#F8F9F7")
COLOR_BORDER = colors.HexColor("#D0D5CE")

def to_roman(n):
    if n <= 0:
        return ""
    mapping = [
        (1000, 'm'), (900, 'cm'), (500, 'd'), (400, 'cd'),
        (100, 'c'), (90, 'xc'), (50, 'l'), (40, 'xl'),
        (10, 'x'), (9, 'ix'), (5, 'v'), (4, 'iv'), (1, 'i')
    ]
    result = []
    for val, roman in mapping:
        while n >= val:
            result.append(roman)
            n -= val
    return ''.join(result)

def safe_p(text, style):
    if not text:
        return Paragraph("", style)
    text = str(text)
    # Escape ampersands not already part of an entity
    text = re.sub(r'&(?!amp;|lt;|gt;|quot;|apos;)', '&amp;', text)
    # Protect allowed tags
    allowed = ['<b>', '</b>', '<i>', '</i>', '<u>', '</u>', '<br/>', '<br />', '<br>']
    for i, tag in enumerate(allowed):
        text = text.replace(tag, f'___TAG_{i}___')
    # Escape all other angle brackets
    text = text.replace('<', '&lt;').replace('>', '&gt;')
    # Restore allowed tags
    for i, tag in enumerate(allowed):
        text = text.replace(f'___TAG_{i}___', tag)
    # Convert literal newlines to line breaks
    text = text.replace('\n', '<br/>')
    return Paragraph(text, style)

class ChapterMarker(Flowable):
    """Zero-height flowable that records the page number where Chapter 1 begins."""
    def wrap(self, availWidth, availHeight):
        return 0, 0
    def draw(self):
        self.canv.chapter_start_page = self.canv._pageNumber

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute total pages and render:
    - Page 1 (Certificate): Institutional border, no header/footer.
    - Prelim Pages (ii to chapter_start_page - 1): Roman page numbering, no header.
    - Chapter Pages (chapter_start_page to end): Running top header, thin rules, Arabic page numbering (Page X of Y).
    """
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []
        self.chapter_start_page = 7 # default fallback

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, total_pages):
        page_num = self._pageNumber
        width, height = self._pagesize
        chap_start = getattr(self, 'chapter_start_page', 7)

        # Page 1: Certificate
        if page_num == 1:
            self.saveState()
            self.setStrokeColor(COLOR_DEEPGREEN)
            self.setLineWidth(2.0)
            self.rect(28, 28, width - 56, height - 56)
            self.setLineWidth(0.8)
            self.setStrokeColor(COLOR_TAUPE)
            self.rect(32, 32, width - 64, height - 64)
            self.restoreState()
            return

        # Preliminary pages before Chapter 1: Pages 2 to (chap_start - 1)
        if page_num < chap_start:
            r_str = to_roman(page_num)
            self.saveState()
            self.setFont("Times-Italic", 10)
            self.setFillColor(COLOR_FOREST)
            self.drawCentredString(width / 2.0, 45, r_str)
            self.restoreState()
            return

        # Chapter pages: from chap_start onwards
        arabic_num = page_num - chap_start + 1
        total_chapter_pages = total_pages - chap_start + 1

        self.saveState()
        # Running Top Header
        self.setFont("Times-Italic", 9)
        self.setFillColor(COLOR_TAUPE)
        self.drawRightString(width - 72, height - 50, "AccessAudit: Accessibility Audit Tool for Developers")
        # Header Rule
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(0.5)
        self.line(108, height - 56, width - 72, height - 56)

        # Running Bottom Footer
        self.line(108, 56, width - 72, 56)
        self.setFont("Times-Roman", 8)
        self.setFillColor(COLOR_FOREST)
        self.drawString(108, 42, "East Point College of Engineering and Technology | Dept. of CSE")
        self.setFont("Times-Roman", 9)
        self.drawRightString(width - 72, 42, f"Page {arabic_num} of {total_chapter_pages}")
        self.restoreState()

def get_proportional_image(path, max_width=410, max_height=300):
    if not os.path.exists(path):
        return None
    try:
        im = PILImage.open(path)
        w, h = im.size
        aspect = h / float(w)
        target_w = min(max_width, w)
        target_h = target_w * aspect
        if target_h > max_height:
            target_h = max_height
            target_w = target_h / aspect
        return RLImage(path, width=target_w, height=target_h)
    except Exception as e:
        print(f"Error loading image {path}: {e}")
        return None

def build_pdf_report():
    os.makedirs("report", exist_ok=True)
    out_pdf = "report/Accessibility_Audit_Tool_UIUX_Report.pdf"

    # Margins: Left=1.5" (108pt), Right=1.0" (72pt), Top=1.0" (72pt), Bottom=1.0" (72pt)
    doc = SimpleDocTemplate(
        out_pdf,
        pagesize=A4,
        leftMargin=108,
        rightMargin=72,
        topMargin=72,
        bottomMargin=72
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    style_body = ParagraphStyle(
        'ReportBody',
        fontName='Times-Roman',
        fontSize=11.5,
        leading=17.25, # 1.5 line spacing
        alignment=TA_JUSTIFY,
        textColor=COLOR_FOREST,
        spaceBefore=0,
        spaceAfter=6
    )

    style_ch_num = ParagraphStyle(
        'ChapterNum',
        fontName='Times-Bold',
        fontSize=16,
        leading=22,
        alignment=TA_LEFT,
        textColor=COLOR_FOREST,
        spaceBefore=14,
        spaceAfter=2,
        keepWithNext=True
    )

    style_ch_title = ParagraphStyle(
        'ChapterTitle',
        fontName='Times-Bold',
        fontSize=16,
        leading=22,
        alignment=TA_LEFT,
        textColor=COLOR_FOREST,
        spaceBefore=0,
        spaceAfter=4,
        keepWithNext=True
    )

    style_stage = ParagraphStyle(
        'StageSubtitle',
        fontName='Times-Italic',
        fontSize=11,
        leading=15,
        alignment=TA_LEFT,
        textColor=COLOR_DEEPGREEN,
        spaceBefore=0,
        spaceAfter=14,
        keepWithNext=True
    )

    style_h1 = ParagraphStyle(
        'ReportH1',
        fontName='Times-Bold',
        fontSize=13.5,
        leading=18,
        alignment=TA_LEFT,
        textColor=COLOR_FOREST,
        spaceBefore=14,
        spaceAfter=4,
        keepWithNext=True
    )

    style_h2 = ParagraphStyle(
        'ReportH2',
        fontName='Times-Bold',
        fontSize=11.5,
        leading=16,
        alignment=TA_LEFT,
        textColor=COLOR_DEEPGREEN,
        spaceBefore=10,
        spaceAfter=3,
        keepWithNext=True
    )

    style_caption = ParagraphStyle(
        'ReportCaption',
        fontName='Times-BoldItalic',
        fontSize=9.5,
        leading=13,
        alignment=TA_CENTER,
        textColor=COLOR_DEEPGREEN,
        spaceBefore=4,
        spaceAfter=10
    )

    style_th = ParagraphStyle(
        'ReportTH',
        fontName='Times-Bold',
        fontSize=9,
        leading=12,
        alignment=TA_LEFT,
        textColor=colors.white
    )

    style_td = ParagraphStyle(
        'ReportTD',
        fontName='Times-Roman',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_LEFT,
        textColor=COLOR_FOREST
    )

    style_td_pending = ParagraphStyle(
        'ReportTDPending',
        fontName='Times-BoldItalic',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_LEFT,
        textColor=COLOR_AMBER
    )

    story = []

    # -------------------------------------------------------------------------
    # 1. CERTIFICATE PAGE (Page i)
    # -------------------------------------------------------------------------
    cert = CERTIFICATE_DATA
    if os.path.exists(cert["header_image"]):
        im_hdr = get_proportional_image(cert["header_image"], max_width=410, max_height=80)
        if im_hdr:
            story.append(im_hdr)
            story.append(Spacer(1, 8))

    story.append(safe_p(cert["department"], ParagraphStyle('CDep', fontName='Times-Bold', fontSize=13, leading=16, alignment=TA_CENTER, textColor=COLOR_FOREST)))
    story.append(safe_p(cert["course"], ParagraphStyle('CCourse', fontName='Times-BoldItalic', fontSize=11.5, leading=15, alignment=TA_CENTER, textColor=COLOR_DEEPGREEN)))
    story.append(Spacer(1, 10))
    story.append(safe_p("CERTIFICATE", ParagraphStyle('CCert', fontName='Times-Bold', fontSize=16, leading=20, alignment=TA_CENTER, textColor=COLOR_FOREST)))
    story.append(Spacer(1, 12))

    story.append(safe_p(cert["body_text"], style_body))
    story.append(Spacer(1, 18))

    # Signatures Table
    sig_data = [
        [
            safe_p(f"<b>Signature of Guide:</b><br/><br/><br/>___________________________<br/><b>{cert['guide_name']}</b><br/>{cert['guide_title']}", style_td),
            safe_p(f"<b>Signature of HOD:</b><br/><br/><br/>___________________________<br/><b>{cert['hod_name']}</b><br/>{cert['hod_title']}", ParagraphStyle('R_Sig', parent=style_td, alignment=TA_RIGHT))
        ],
        [
            safe_p(f"<br/><b>Date:</b> {cert['date']}", style_td),
            safe_p("", style_td)
        ]
    ]
    t_sig = Table(sig_data, colWidths=[205, 205])
    t_sig.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_sig)
    story.append(Spacer(1, 12))

    story.append(safe_p("<b>Viva-Voce Examiners:</b>", ParagraphStyle('ExH', fontName='Times-Bold', fontSize=11, leading=14, textColor=COLOR_FOREST)))
    story.append(safe_p(cert["examiner_1"], ParagraphStyle('Ex1', fontName='Times-Roman', fontSize=10.5, leading=14, textColor=COLOR_FOREST)))
    story.append(safe_p(cert["examiner_2"], ParagraphStyle('Ex2', fontName='Times-Roman', fontSize=10.5, leading=14, textColor=COLOR_FOREST)))

    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # 2. ABSTRACT PAGE (Page ii)
    # -------------------------------------------------------------------------
    story.append(Spacer(1, 14))
    story.append(safe_p("ABSTRACT", ParagraphStyle('AbsTitle', fontName='Times-Bold', fontSize=16, leading=22, alignment=TA_CENTER, textColor=COLOR_FOREST)))
    story.append(Spacer(1, 14))
    story.append(safe_p(ABSTRACT_TEXT, style_body))

    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # 3. TABLE OF CONTENTS (Pages iii-iv)
    # -------------------------------------------------------------------------
    story.append(Spacer(1, 10))
    story.append(safe_p("TABLE OF CONTENTS", ParagraphStyle('TOCTitle', fontName='Times-Bold', fontSize=16, leading=22, alignment=TA_CENTER, textColor=COLOR_FOREST)))
    story.append(Spacer(1, 10))

    toc_rows = []
    for title, page_num in TOC_ITEMS:
        is_ch = title.startswith("CHAPTER") or title in ("Certificate", "Abstract", "Table of Contents", "List of Figures", "List of Tables", "REFERENCES") or title.startswith("APPENDIX")
        st = ParagraphStyle('TOCRow', fontName='Times-Bold' if is_ch else 'Times-Roman', fontSize=9, leading=11.5, textColor=COLOR_FOREST if is_ch else COLOR_DEEPGREEN)
        st_p = ParagraphStyle('TOCPage', fontName='Times-Bold' if is_ch else 'Times-Roman', fontSize=9, leading=11.5, alignment=TA_RIGHT, textColor=COLOR_FOREST)
        toc_rows.append([safe_p(title, st), safe_p(page_num, st_p)])

    t_toc = Table(toc_rows, colWidths=[355, 55])
    t_toc.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 0.8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0.8),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_toc)

    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # 4. LIST OF FIGURES (Page v)
    # -------------------------------------------------------------------------
    story.append(Spacer(1, 12))
    story.append(safe_p("LIST OF FIGURES", ParagraphStyle('LOFTitle', fontName='Times-Bold', fontSize=16, leading=22, alignment=TA_CENTER, textColor=COLOR_FOREST)))
    story.append(Spacer(1, 10))

    lof_rows = []
    for f_id, f_caption, f_page in LIST_OF_FIGURES:
        st_id = ParagraphStyle('LOFID', fontName='Times-Bold', fontSize=9, leading=12, textColor=COLOR_DEEPGREEN)
        st_cap = ParagraphStyle('LOFCap', fontName='Times-Roman', fontSize=9, leading=12, textColor=COLOR_FOREST)
        st_p = ParagraphStyle('LOFPage', fontName='Times-Bold', fontSize=9, leading=12, alignment=TA_RIGHT, textColor=COLOR_FOREST)
        lof_rows.append([safe_p(f_id, st_id), safe_p(f_caption, st_cap), safe_p(f_page, st_p)])

    t_lof = Table(lof_rows, colWidths=[70, 290, 50])
    t_lof.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_lof)

    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # 5. LIST OF TABLES (Page vi)
    # -------------------------------------------------------------------------
    story.append(Spacer(1, 12))
    story.append(safe_p("LIST OF TABLES", ParagraphStyle('LOTTitle', fontName='Times-Bold', fontSize=16, leading=22, alignment=TA_CENTER, textColor=COLOR_FOREST)))
    story.append(Spacer(1, 10))

    lot_rows = []
    for t_id, t_caption, t_page in LIST_OF_TABLES:
        st_id = ParagraphStyle('LOTID', fontName='Times-Bold', fontSize=9, leading=12, textColor=COLOR_DEEPGREEN)
        st_cap = ParagraphStyle('LOTCap', fontName='Times-Roman', fontSize=9, leading=12, textColor=COLOR_FOREST)
        st_p = ParagraphStyle('LOTPage', fontName='Times-Bold', fontSize=9, leading=12, alignment=TA_RIGHT, textColor=COLOR_FOREST)
        lot_rows.append([safe_p(t_id, st_id), safe_p(t_caption, st_cap), safe_p(t_page, st_p)])

    t_lot = Table(lot_rows, colWidths=[75, 285, 50])
    t_lot.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_lot)

    # -------------------------------------------------------------------------
    # 6. CHAPTERS 1 TO 10
    # -------------------------------------------------------------------------
    def format_table_flowable(t_data):
        headers = t_data["headers"]
        rows = t_data["rows"]
        raw_widths = t_data.get("col_widths", [1.0]*len(headers))
        sum_w = sum(raw_widths)
        scaled_w = [(w / sum_w) * 410 for w in raw_widths]

        t_rows = []
        t_rows.append([safe_p(h, style_th) for h in headers])

        for r in rows:
            row_cells = []
            for val in r:
                s_val = str(val)
                st = style_td_pending if "[PENDING" in s_val else style_td
                row_cells.append(safe_p(s_val, st))
            t_rows.append(row_cells)

        tbl = Table(t_rows, colWidths=scaled_w, repeatRows=1)
        tbl.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), COLOR_FOREST),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, COLOR_BG_LIGHT]),
            ('BOX', (0,0), (-1,-1), 0.8, COLOR_TAUPE),
            ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ]))
        return tbl

    for ch_idx, ch in enumerate(CHAPTERS):
        story.append(PageBreak())
        if ch_idx == 0:
            # Place ChapterMarker on first page of Chapter 1
            story.append(ChapterMarker())

        story.append(safe_p(f"CHAPTER {ch['number']}", style_ch_num))
        story.append(safe_p(ch["title"], style_ch_title))
        story.append(safe_p(ch["stage"], style_stage))

        for sec in ch.get("sections", []):
            story.append(safe_p(sec["title"], style_h1))

            for para in sec.get("content", []):
                story.append(safe_p(para, style_body))

            if "figure" in sec:
                fig = sec["figure"]
                im_fig = get_proportional_image(fig["path"], max_width=410, max_height=260)
                if im_fig:
                    story.append(Spacer(1, 6))
                    story.append(im_fig)
                    story.append(safe_p(fig["caption"], style_caption))

            if "table" in sec:
                story.append(Spacer(1, 4))
                story.append(format_table_flowable(sec["table"]))
                story.append(safe_p(sec["table"].get("caption", ""), style_caption))
                story.append(Spacer(1, 6))

            for subsec in sec.get("subsections", []):
                story.append(safe_p(subsec["title"], style_h2))
                story.append(safe_p(subsec["text"], style_body))
                if "figure" in subsec:
                    s_fig = subsec["figure"]
                    im_s_fig = get_proportional_image(s_fig["path"], max_width=410, max_height=260)
                    if im_s_fig:
                        story.append(Spacer(1, 6))
                        story.append(im_s_fig)
                        story.append(safe_p(s_fig["caption"], style_caption))

    # -------------------------------------------------------------------------
    # 7. REFERENCES
    # -------------------------------------------------------------------------
    story.append(PageBreak())
    story.append(safe_p("REFERENCES", ParagraphStyle('RefTitle', fontName='Times-Bold', fontSize=16, leading=22, alignment=TA_LEFT, textColor=COLOR_FOREST, spaceAfter=14)))
    for ref in REFERENCES:
        story.append(safe_p(ref, ParagraphStyle('RefEntry', fontName='Times-Roman', fontSize=10.5, leading=14.5, alignment=TA_JUSTIFY, textColor=COLOR_FOREST, spaceAfter=6)))

    # -------------------------------------------------------------------------
    # 8. APPENDICES A TO G
    # -------------------------------------------------------------------------
    for app in APPENDICES:
        story.append(PageBreak())
        story.append(safe_p(app["title"], ParagraphStyle('AppTitle', fontName='Times-Bold', fontSize=16, leading=22, alignment=TA_LEFT, textColor=COLOR_FOREST, spaceAfter=14)))
        for c_text in app.get("content", []):
            story.append(safe_p(c_text, ParagraphStyle('AppBody', fontName='Times-Roman', fontSize=11, leading=15.5, alignment=TA_JUSTIFY, textColor=COLOR_FOREST, spaceAfter=6)))
        if "table" in app:
            story.append(Spacer(1, 4))
            story.append(format_table_flowable(app["table"]))
            story.append(safe_p(app["table"].get("caption", ""), style_caption))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF report at: {out_pdf}")
    return out_pdf

if __name__ == "__main__":
    build_pdf_report()
