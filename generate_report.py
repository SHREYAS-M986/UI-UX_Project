# generate_report.py
# Master entry point script for generating the complete AccessAudit UI/UX Project Report.
# Running this single command regenerates both DOCX and PDF deliverables dynamically:
#   python generate_report.py

import os
import sys
import openpyxl

def main():
    print("=" * 70)
    print(" ACCESSAUDIT: ADVANCED UI/UX ACADEMIC PROJECT REPORT GENERATOR")
    print(" Department of Computer Science & Engineering")
    print(" East Point College of Engineering & Technology (VTU)")
    print("=" * 70)

    # 1. Inspect evidence/research_data.xlsx for participant rows
    excel_path = "evidence/research_data.xlsx"
    has_participants = False
    p_count = 0
    if os.path.exists(excel_path):
        try:
            wb = openpyxl.load_workbook(excel_path, data_only=True)
            if "Participants" in wb.sheetnames:
                ws = wb["Participants"]
                rows = [r for r in ws.iter_rows(values_only=True) if any(r)]
                if len(rows) > 1:
                    has_participants = True
                    p_count = len(rows) - 1
            print(f"[EVIDENCE STATUS] research_data.xlsx found: {p_count} real human participant(s) logged.")
        except Exception as e:
            print(f"[EVIDENCE NOTE] Could not read {excel_path}: {e}")
    else:
        print("[EVIDENCE NOTE] research_data.xlsx not found; using pending placeholders.")

    if not has_participants:
        print("  -> Human evidence status: [PENDING: real data required]")
        print("  -> When you collect participant data and fill research_data.xlsx,")
        print("     re-running this script will automatically incorporate your findings.")

    # 2. Build DOCX
    print("\n[STEP 1/2] Generating Word Document (.docx)...")
    try:
        from build_docx import build_docx_report
        docx_path = build_docx_report()
        docx_size = os.path.getsize(docx_path) / (1024 * 1024)
        print(f"  -> Generated: {docx_path} ({docx_size:.2f} MB)")
    except Exception as e:
        print(f"  -> ERROR generating DOCX: {e}")
        import traceback
        traceback.print_exc()

    # 3. Build PDF
    print("\n[STEP 2/2] Generating PDF Document (.pdf)...")
    try:
        from build_pdf import build_pdf_report
        pdf_path = build_pdf_report()
        import pypdf
        reader = pypdf.PdfReader(pdf_path)
        total_pages = len(reader.pages)
        pdf_size = os.path.getsize(pdf_path) / (1024 * 1024)
        print(f"  -> Generated: {pdf_path} ({pdf_size:.2f} MB, {total_pages} pages)")
    except Exception as e:
        print(f"  -> ERROR generating PDF: {e}")
        import traceback
        traceback.print_exc()

    print("\n" + "=" * 70)
    print(" REPORT GENERATION COMPLETE")
    print(f" Output DOCX: report/Accessibility_Audit_Tool_UIUX_Report.docx")
    print(f" Output PDF:  report/Accessibility_Audit_Tool_UIUX_Report.pdf ({total_pages} pages)")
    print("=" * 70)

if __name__ == "__main__":
    main()
