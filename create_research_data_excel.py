import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import os

def create_excel():
    wb = openpyxl.Workbook()
    # Remove default sheet
    wb.remove(wb.active)

    # Styles
    header_fill = PatternFill(start_color="21402A", end_color="21402A", fill_type="solid")
    header_font = Font(name="Times New Roman", size=11, bold=True, color="FFFFFF")
    cell_font = Font(name="Times New Roman", size=11)
    center_align = Alignment(horizontal="center", vertical="center", wrap_text=True)
    left_align = Alignment(horizontal="left", vertical="center", wrap_text=True)
    border_thin = Border(
        left=Side(style='thin', color='A08569'),
        right=Side(style='thin', color='A08569'),
        top=Side(style='thin', color='A08569'),
        bottom=Side(style='thin', color='A08569')
    )

    # 1. Participants Sheet
    ws1 = wb.create_sheet(title="Participants")
    headers1 = ["Participant_ID", "Profile_Name", "Role", "Years_Experience", "Tech_Stack", "Consent_Given", "Date_Conducted", "Method"]
    ws1.append(headers1)
    # Empty placeholder row indicating [PENDING: real data required]
    # No fake data inserted

    # 2. Interview_Notes Sheet
    ws2 = wb.create_sheet(title="Interview_Notes")
    headers2 = ["Participant_ID", "Question_Number", "Question_Prompt", "Verbatim_Answer", "Finding_Tag"]
    ws2.append(headers2)

    # 3. Wireframe_Feedback Sheet
    ws3 = wb.create_sheet(title="Wireframe_Feedback")
    headers3 = ["Feedback_ID", "Participant_ID", "Role", "Screen_Evaluated", "Observation_Feedback", "Action_Taken"]
    ws3.append(headers3)

    # 4. Usability_Results Sheet
    ws4 = wb.create_sheet(title="Usability_Results")
    headers4 = ["User_ID", "Task_ID", "Task_Description", "Success_YN", "Time_Seconds", "Errors_Count", "Qualitative_Observations", "Severity_Rating_0_to_4"]
    ws4.append(headers4)

    # 5. SUS_Responses Sheet
    ws5 = wb.create_sheet(title="SUS_Responses")
    headers5 = [
        "Participant_ID",
        "Q1_Frequent_Use",
        "Q2_Unnecessarily_Complex",
        "Q3_Easy_To_Use",
        "Q4_Need_Tech_Support",
        "Q5_Well_Integrated",
        "Q6_Too_Much_Inconsistency",
        "Q7_Learn_Quickly",
        "Q8_Cumbersome",
        "Q9_Confident",
        "Q10_Need_To_Learn_A_Lot",
        "SUS_Score"
    ]
    ws5.append(headers5)
    # Add template formula rows for when users add rows 2 to 10
    for r in range(2, 7):
        formula = f"=IF(B{r}<>\"\", ((B{r}-1)+(5-C{r})+(D{r}-1)+(5-E{r})+(F{r}-1)+(5-G{r})+(H{r}-1)+(5-I{r})+(J{r}-1)+(5-K{r}))*2.5, \"\")"
        ws5.cell(row=r, column=12, value=formula)

    # 6. Findings_Log Sheet
    ws6 = wb.create_sheet(title="Findings_Log")
    headers6 = ["Finding_ID", "Core_Insight", "Source_Participants", "Impact_On_Design"]
    ws6.append(headers6)

    # Format all sheets
    for ws in wb.worksheets:
        for col_idx, col in enumerate(ws.columns, 1):
            cell = ws.cell(row=1, column=col_idx)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = center_align
            cell.border = border_thin
            # Column width auto adjustment
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col_idx)
            ws.column_dimensions[col_letter].width = max(max_len + 4, 15)

    os.makedirs("evidence", exist_ok=True)
    out_file = "evidence/research_data.xlsx"
    wb.save(out_file)
    print(f"Successfully generated clean evidence template at: {os.path.abspath(out_file)}")

if __name__ == '__main__':
    create_excel()

