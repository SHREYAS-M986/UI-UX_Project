# build_docx.py
# Generates submission-ready DOCX report for AccessAudit UI/UX Project
# Follows VTU / East Point College of Engineering & Technology guidelines:
# A4, 1.5" left margin, 1.0" top/bottom/right, Times New Roman, 1.5 line spacing, justified.

import os
import io
from PIL import Image as PILImage
import docx
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

from report_data import (
    CERTIFICATE_DATA, ABSTRACT_TEXT, TOC_ITEMS, LIST_OF_FIGURES, LIST_OF_TABLES,
    CHAPTERS, REFERENCES, APPENDICES
)

# Colors
C_FOREST = RGBColor(0x15, 0x23, 0x1C)
C_DEEPGREEN = RGBColor(0x21, 0x40, 0x2A)
C_MIST = RGBColor(0xEC, 0xEC, 0xE4)
C_AMBER = RGBColor(0x8B, 0x62, 0x22)
C_TAUPE = RGBColor(0xA0, 0x85, 0x69)

HEX_FOREST = "15231C"
HEX_DEEPGREEN = "21402A"
HEX_MIST = "ECECE4"
HEX_TAUPE = "A08569"
HEX_WHITE = "FFFFFF"

def set_font(run, name="Times New Roman", size=12, bold=False, italic=False, color=None):
    run.font.name = name
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color:
        run.font.color.rgb = color
    rPr = run._r.get_or_add_rPr()
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:ascii'), name)
    rFonts.set(qn('w:hAnsi'), name)
    rFonts.set(qn('w:cs'), name)
    rPr.append(rFonts)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_borders(cell, top=None, bottom=None, left=None, right=None, color="A08569", sz="4"):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for side, active in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        if active:
            b = OxmlElement(f'w:{side}')
            b.set(qn('w:val'), 'single')
            b.set(qn('w:sz'), sz)
            b.set(qn('w:space'), '0')
            b.set(qn('w:color'), color)
            tcBorders.append(b)
        else:
            b = OxmlElement(f'w:{side}')
            b.set(qn('w:val'), 'none')
            tcBorders.append(b)
    tcPr.append(tcBorders)

def add_clean_picture(doc, img_path, width=Inches(5.5)):
    if not os.path.exists(img_path):
        return None
    try:
        im = PILImage.open(img_path)
        if im.format != 'PNG' or im.mode not in ('RGB', 'RGBA'):
            buf = io.BytesIO()
            im.convert('RGB').save(buf, format='PNG')
            buf.seek(0)
            return doc.add_picture(buf, width=width)
        else:
            return doc.add_picture(img_path, width=width)
    except Exception as e:
        print(f"Error adding picture {img_path}: {e}")
        return None

def build_docx_report():
    doc = Document()

    # 1. Page Setup: A4, 1.5" left margin, 1.0" right/top/bottom
    section_prelim = doc.sections[0]
    section_prelim.page_width = Inches(8.27)
    section_prelim.page_height = Inches(11.69)
    section_prelim.top_margin = Inches(1.0)
    section_prelim.bottom_margin = Inches(1.0)
    section_prelim.left_margin = Inches(1.5)
    section_prelim.right_margin = Inches(1.0)

    # Set base Normal style
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Times New Roman'
    style_normal.font.size = Pt(12)
    style_normal.font.color.rgb = C_FOREST
    style_normal.paragraph_format.line_spacing = 1.5
    style_normal.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    # Configure prelim footer for Roman numerals
    footer_prelim = section_prelim.footer
    f_p = footer_prelim.paragraphs[0]
    f_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    # Page field
    r_f = f_p.add_run()
    set_font(r_f, size=10, italic=True)
    fldSimple = parse_xml(r'<w:fldSimple %s w:instr="PAGE \*roman"/>' % nsdecls('w'))
    r_f._r.append(fldSimple)

    # Set page number format on section to Roman
    sectPr = section_prelim._sectPr
    pgNumType = parse_xml(r'<w:pgNumType %s w:fmt="roman"/>' % nsdecls('w'))
    sectPr.append(pgNumType)

    def p(text="", size=12, bold=False, italic=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, color=C_FOREST, line_spacing=1.5):
        para = doc.add_paragraph()
        para.alignment = align
        para.paragraph_format.line_spacing = line_spacing
        para.paragraph_format.space_before = Pt(space_before)
        para.paragraph_format.space_after = Pt(space_after)
        if text:
            run = para.add_run(text)
            set_font(run, size=size, bold=bold, italic=italic, color=color)
        return para

    # -------------------------------------------------------------------------
    # CERTIFICATE PAGE (Page i)
    # -------------------------------------------------------------------------
    cert = CERTIFICATE_DATA
    # College Header
    if os.path.exists(cert["header_image"]):
        p_hdr = doc.add_paragraph()
        p_hdr.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_hdr.paragraph_format.space_before = Pt(0)
        p_hdr.paragraph_format.space_after = Pt(8)
        run_hdr = p_hdr.add_run()
        add_clean_picture(doc, cert["header_image"], width=Inches(5.4))

    p(cert["department"], size=13, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=4, color=C_FOREST)
    p(cert["course"], size=12, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=12, color=C_DEEPGREEN)
    
    p("CERTIFICATE", size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=8, space_after=14, color=C_FOREST)
    
    p(cert["body_text"], size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=6, space_after=18, line_spacing=1.5)

    # Signatures Table
    sig_table = doc.add_table(rows=2, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False
    col_w = Inches(2.7)
    for row in sig_table.rows:
        row.cells[0].width = col_w
        row.cells[1].width = col_w
        for c in row.cells:
            set_cell_borders(c, False, False, False, False)
            set_cell_margins(c, top=80, bottom=80, left=60, right=60)

    # Guide
    c0 = sig_table.rows[0].cells[0]
    p_g = c0.paragraphs[0]
    p_g.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run_g = p_g.add_run(f"Signature of Guide:\n\n\n___________________________\n{cert['guide_name']}\n{cert['guide_title']}")
    set_font(run_g, size=11, bold=True)

    # HOD
    c1 = sig_table.rows[0].cells[1]
    p_h = c1.paragraphs[0]
    p_h.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run_h = p_h.add_run(f"Signature of HOD:\n\n\n___________________________\n{cert['hod_name']}\n{cert['hod_title']}")
    set_font(run_h, size=11, bold=True)

    # Date
    c_d = sig_table.rows[1].cells[0]
    p_d = c_d.paragraphs[0]
    p_d.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run_d = p_d.add_run(f"\nDate: {cert['date']}")
    set_font(run_d, size=11, bold=True)

    # Examiners
    p("\nViva-Voce Examiners:", size=11, bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    p(cert["examiner_1"], size=11, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=2, space_after=2)
    p(cert["examiner_2"], size=11, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=2, space_after=0)

    doc.add_page_break()

    # -------------------------------------------------------------------------
    # ABSTRACT PAGE (Page ii)
    # -------------------------------------------------------------------------
    p("ABSTRACT", size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=14, color=C_FOREST)
    p(ABSTRACT_TEXT, size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=6, space_after=12, line_spacing=1.5)
    
    doc.add_page_break()

    # -------------------------------------------------------------------------
    # TABLE OF CONTENTS (Page iii)
    # -------------------------------------------------------------------------
    p("TABLE OF CONTENTS", size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=14, color=C_FOREST)
    
    toc_table = doc.add_table(rows=len(TOC_ITEMS), cols=2)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    toc_table.autofit = False
    for i, (title, page_num) in enumerate(TOC_ITEMS):
        row = toc_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(5.0)
        c1.width = Inches(0.7)
        set_cell_borders(c0, False, False, False, False)
        set_cell_borders(c1, False, False, False, False)
        set_cell_margins(c0, top=40, bottom=40, left=40, right=40)
        set_cell_margins(c1, top=40, bottom=40, left=40, right=40)

        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
        is_ch = title.startswith("CHAPTER") or title in ("Certificate", "Abstract", "Table of Contents", "List of Figures", "List of Tables", "REFERENCES") or title.startswith("APPENDIX")
        r0 = p0.add_run(title)
        set_font(r0, size=11, bold=is_ch, color=C_FOREST if is_ch else C_DEEPGREEN)

        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r1 = p1.add_run(page_num)
        set_font(r1, size=11, bold=is_ch)

    doc.add_page_break()

    # -------------------------------------------------------------------------
    # LIST OF FIGURES (Page iv)
    # -------------------------------------------------------------------------
    p("LIST OF FIGURES", size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=14, color=C_FOREST)
    
    lof_table = doc.add_table(rows=len(LIST_OF_FIGURES), cols=3)
    lof_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    lof_table.autofit = False
    for i, (f_id, f_caption, f_page) in enumerate(LIST_OF_FIGURES):
        row = lof_table.rows[i]
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        c0.width = Inches(1.1)
        c1.width = Inches(4.0)
        c2.width = Inches(0.6)
        set_cell_borders(c0, False, False, False, False)
        set_cell_borders(c1, False, False, False, False)
        set_cell_borders(c2, False, False, False, False)
        set_cell_margins(c0, top=40, bottom=40, left=40, right=40)
        set_cell_margins(c1, top=40, bottom=40, left=40, right=40)
        set_cell_margins(c2, top=40, bottom=40, left=40, right=40)

        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r0 = p0.add_run(f_id)
        set_font(r0, size=11, bold=True, color=C_DEEPGREEN)

        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r1 = p1.add_run(f_caption)
        set_font(r1, size=11)

        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r2 = p2.add_run(f_page)
        set_font(r2, size=11, bold=True)

    doc.add_page_break()

    # -------------------------------------------------------------------------
    # LIST OF TABLES (Page v)
    # -------------------------------------------------------------------------
    p("LIST OF TABLES", size=16, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=14, color=C_FOREST)
    
    lot_table = doc.add_table(rows=len(LIST_OF_TABLES), cols=3)
    lot_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    lot_table.autofit = False
    for i, (t_id, t_caption, t_page) in enumerate(LIST_OF_TABLES):
        row = lot_table.rows[i]
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        c0.width = Inches(1.2)
        c1.width = Inches(3.9)
        c2.width = Inches(0.6)
        set_cell_borders(c0, False, False, False, False)
        set_cell_borders(c1, False, False, False, False)
        set_cell_borders(c2, False, False, False, False)
        set_cell_margins(c0, top=40, bottom=40, left=40, right=40)
        set_cell_margins(c1, top=40, bottom=40, left=40, right=40)
        set_cell_margins(c2, top=40, bottom=40, left=40, right=40)

        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r0 = p0.add_run(t_id)
        set_font(r0, size=11, bold=True, color=C_DEEPGREEN)

        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r1 = p1.add_run(t_caption)
        set_font(r1, size=11)

        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r2 = p2.add_run(t_page)
        set_font(r2, size=11, bold=True)

    # -------------------------------------------------------------------------
    # CHAPTERS 1 TO 10 (Main Content, Arabic Page Numbers)
    # -------------------------------------------------------------------------
    # Create new section for Chapters
    section_main = doc.add_section(docx.enum.section.WD_SECTION.NEW_PAGE)
    section_main.page_width = Inches(8.27)
    section_main.page_height = Inches(11.69)
    section_main.top_margin = Inches(1.0)
    section_main.bottom_margin = Inches(1.0)
    section_main.left_margin = Inches(1.5)
    section_main.right_margin = Inches(1.0)

    # Unlink header & footer
    section_main.header.is_linked_to_previous = False
    section_main.footer.is_linked_to_previous = False

    # Running header on Chapter pages
    hdr = section_main.header.paragraphs[0]
    hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_hdr = hdr.add_run("AccessAudit: Accessibility Audit Tool for Developers")
    set_font(r_hdr, size=9, italic=True, color=C_TAUPE)

    # Footer with Arabic page numbers starting at 1
    ftr = section_main.footer.paragraphs[0]
    ftr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_ftr = ftr.add_run("Page ")
    set_font(r_ftr, size=10)
    fldPage = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
    r_ftr._r.append(fldPage)
    r_ftr2 = ftr.add_run(" of ")
    set_font(r_ftr2, size=10)
    fldNumPages = parse_xml(r'<w:fldSimple %s w:instr="NUMPAGES"/>' % nsdecls('w'))
    r_ftr2._r.append(fldNumPages)

    sectPr_main = section_main._sectPr
    pgNumType_main = parse_xml(r'<w:pgNumType %s w:start="1" w:fmt="decimal"/>' % nsdecls('w'))
    sectPr_main.append(pgNumType_main)

    def render_table(t_data):
        headers = t_data["headers"]
        rows = t_data["rows"]
        col_w = [Inches(w) for w in t_data.get("col_widths", [1.5]*len(headers))]

        tbl = doc.add_table(rows=len(rows)+1, cols=len(headers))
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False

        # Repeat header row on page breaks
        trPr = tbl.rows[0]._tr.get_or_add_trPr()
        trPr.append(parse_xml(r'<w:tblHeader %s/>' % nsdecls('w')))

        # Header row formatting
        for j, h_text in enumerate(headers):
            cell = tbl.rows[0].cells[j]
            cell.width = col_w[j]
            set_cell_background(cell, HEX_FOREST)
            set_cell_borders(cell, True, True, True, True, color=HEX_TAUPE, sz="6")
            set_cell_margins(cell, top=100, bottom=100, left=80, right=80)
            p_c = cell.paragraphs[0]
            p_c.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p_c.add_run(h_text)
            set_font(r, size=9.5, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))

        # Data rows formatting
        for i, row_data in enumerate(rows):
            row = tbl.rows[i+1]
            # cantSplit so row doesn't break across pages
            trPr_r = row._tr.get_or_add_trPr()
            trPr_r.append(parse_xml(r'<w:cantSplit %s/>' % nsdecls('w')))
            bg_col = "F8F9F7" if i % 2 == 1 else "FFFFFF"

            for j, val in enumerate(row_data):
                cell = row.cells[j]
                cell.width = col_w[j]
                set_cell_background(cell, bg_col)
                set_cell_borders(cell, True, True, True, True, color="D0D5CE", sz="4")
                set_cell_margins(cell, top=80, bottom=80, left=80, right=80)
                p_c = cell.paragraphs[0]
                p_c.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p_c.paragraph_format.line_spacing = 1.15
                r = p_c.add_run(str(val))
                is_pending = "[PENDING" in str(val)
                set_font(r, size=9, bold=is_pending, italic=is_pending, color=C_AMBER if is_pending else C_FOREST)

        # Table caption below
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(4)
        p_cap.paragraph_format.space_after = Pt(12)
        r_cap = p_cap.add_run(t_data.get("caption", ""))
        set_font(r_cap, size=9.5, bold=True, italic=True, color=C_DEEPGREEN)

    for ch_idx, ch in enumerate(CHAPTERS):
        if ch_idx > 0:
            doc.add_page_break()

        # Chapter Title
        p(f"CHAPTER {ch['number']}", size=16, bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=16, space_after=2, color=C_FOREST)
        p(ch["title"], size=16, bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=4, color=C_FOREST)
        # Stage Subtitle
        p(ch["stage"], size=11, bold=False, italic=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=14, color=C_DEEPGREEN)

        for sec in ch.get("sections", []):
            p(sec["title"], size=14, bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=14, space_after=4, color=C_FOREST)

            for para in sec.get("content", []):
                p(para, size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.5)

            if "figure" in sec:
                fig = sec["figure"]
                if os.path.exists(fig["path"]):
                    p_img = doc.add_paragraph()
                    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_img.paragraph_format.space_before = Pt(8)
                    p_img.paragraph_format.space_after = Pt(2)
                    add_clean_picture(doc, fig["path"], width=Inches(5.5))

                    p_cap = doc.add_paragraph()
                    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_cap.paragraph_format.space_before = Pt(2)
                    p_cap.paragraph_format.space_after = Pt(10)
                    r_cap = p_cap.add_run(fig["caption"])
                    set_font(r_cap, size=9.5, bold=True, italic=True, color=C_DEEPGREEN)

            if "table" in sec:
                render_table(sec["table"])

            for subsec in sec.get("subsections", []):
                p(subsec["title"], size=12, bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=8, space_after=2, color=C_DEEPGREEN)
                p(subsec["text"], size=12, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.5)
                if "figure" in subsec:
                    s_fig = subsec["figure"]
                    if os.path.exists(s_fig["path"]):
                        p_s_img = doc.add_paragraph()
                        p_s_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        p_s_img.paragraph_format.space_before = Pt(8)
                        p_s_img.paragraph_format.space_after = Pt(2)
                        add_clean_picture(doc, s_fig["path"], width=Inches(5.5))

                        p_s_cap = doc.add_paragraph()
                        p_s_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        p_s_cap.paragraph_format.space_before = Pt(2)
                        p_s_cap.paragraph_format.space_after = Pt(10)
                        r_s_cap = p_s_cap.add_run(s_fig["caption"])
                        set_font(r_s_cap, size=9.5, bold=True, italic=True, color=C_DEEPGREEN)

    # -------------------------------------------------------------------------
    # REFERENCES
    # -------------------------------------------------------------------------
    doc.add_page_break()
    p("REFERENCES", size=16, bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=16, space_after=14, color=C_FOREST)
    for ref in REFERENCES:
        p(ref, size=11, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.3)

    # -------------------------------------------------------------------------
    # APPENDICES A TO G
    # -------------------------------------------------------------------------
    for app in APPENDICES:
        doc.add_page_break()
        p(app["title"], size=16, bold=True, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=16, space_after=14, color=C_FOREST)
        for c_text in app.get("content", []):
            p(c_text, size=11.5, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.4)
        if "table" in app:
            render_table(app["table"])

    # Ensure report folder exists
    os.makedirs("report", exist_ok=True)
    out_docx = "report/Accessibility_Audit_Tool_UIUX_Report.docx"
    doc.save(out_docx)
    print(f"Successfully generated DOCX report at: {out_docx}")
    return out_docx

if __name__ == "__main__":
    build_docx_report()

