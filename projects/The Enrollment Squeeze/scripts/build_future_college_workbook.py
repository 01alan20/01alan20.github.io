import csv
from pathlib import Path
from artifact_tool import Workbook, SpreadsheetFile

PROJECT = Path('/mnt/data/future_freshman_project_build/future_freshman_project')
XLSX_PATH = Path('/mnt/data/future_college_market_financial_model.xlsx')
PREVIEW_PATH = Path('/mnt/data/future_college_market_workbook_preview.png')

def read_csv(path):
    with open(path, encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))

national = read_csv(PROJECT / 'data/phase3/national_college_market_2026_2041.csv')
state_market = read_csv(PROJECT / 'data/phase3/state_college_market_2026_2041.csv')
exposure = read_csv(PROJECT / 'data/phase4/institution_market_exposure_2030_2041.csv')
budget_2035 = [r for r in read_csv(PROJECT / 'data/phase5/institution_budget_pressure_2030_2041.csv') if r['projection_year']=='2035']
source_rows = read_csv(PROJECT / 'sources/source_manifest.csv')

inst = {}
for r in exposure:
    uid = r['unitid']
    if uid not in inst:
        inst[uid] = {
            'unitid': uid,
            'institution_name': r['institution_name'],
            'state': r['state'],
            'control_label': r['control_label'],
            'current_undergraduate_enrollment': float(r['current_undergraduate_enrollment']),
            'admission_rate': float(r['admission_rate']) if r['admission_rate'] not in ('','None') else None,
            'market_scope_proxy': r['market_scope_proxy'],
            'has_finance_snapshot': r['has_finance_snapshot']=='True',
            'tuition_revenue_per_fte': float(r['tuition_revenue_per_fte']) if r['tuition_revenue_per_fte'] not in ('','None') else None,
            'instructional_expenditure_per_fte': float(r['instructional_expenditure_per_fte']) if r['instructional_expenditure_per_fte'] not in ('','None') else None,
            'latitude': float(r['latitude']) if r['latitude'] not in ('','None') else None,
            'longitude': float(r['longitude']) if r['longitude'] not in ('','None') else None,
        }
    inst[uid][f"state_change_{r['projection_year']}"] = float(r['state_graduate_pool_change'])

institutions = sorted(inst.values(), key=lambda x:(x['state'], x['institution_name']))
n_inst = len(institutions)
inst_first = 4
inst_last = n_inst + 3
row_by_unitid = {r['unitid']: i+inst_first for i,r in enumerate(institutions)}
top_default = sorted(budget_2035, key=lambda r:float(r['annual_funding_gap_proxy']), reverse=True)[:20]

# Colors and formats
DARK='#17365D'; LIGHT='#D9EAF7'; PALE='#F3F6FA'; YELLOW='#FFF2CC'; WHITE='#FFFFFF'; GRAY='#666666'
BLUE='#0000FF'; BLACK='#000000'; GREEN='#008000'; RED='#C00000'
header_fmt={'fill':DARK,'font':{'bold':True,'color':WHITE},'horizontal_alignment':'center','vertical_alignment':'center','wrap_text':True}
section_fmt={'fill':DARK,'font':{'bold':True,'color':WHITE,'size':12},'horizontal_alignment':'left','vertical_alignment':'center'}
title_fmt={'font':{'bold':True,'size':20,'color':DARK},'vertical_alignment':'center'}
subtitle_fmt={'font':{'italic':True,'color':GRAY},'wrap_text':True}
num_fmt='#,##0;[Red](#,##0);-'; money_fmt='$#,##0;[Red]($#,##0);-'; pct_fmt='0.0%;[Red](0.0%);-'; ratio_fmt='0.00x'

wb=Workbook.create()
dash=wb.worksheets.add('Dashboard')
ass=wb.worksheets.add('Assumptions')
nat=wb.worksheets.add('National Market')
st=wb.worksheets.add('State Market')
im=wb.worksheets.add('Institution Model')
dd=wb.worksheets.add('Data Dictionary')
src=wb.worksheets.add('Sources')

# Assumptions
ass.merge_cells('A1:D1'); ass.get_range('A1').values=[['Model Assumptions']]; ass.get_range('A1:D1').format=title_fmt
ass.get_range('A3:D3').values=[['Assumption','Central / Selected','Low','High']]; ass.get_range('A3:D3').format=header_fmt
ass_rows=[
 ['Projection year',2035,2030,2041],
 ['College-going rate',0.628,0.578,0.678],
 ['Four-year share',2/3,2/3-0.05,2/3+0.05],
 ['Undergraduate cohort divisor',4.25,4.0,4.5],
 ['Headcount-to-FTE factor',0.85,0.75,0.95],
 ['Variable instructional expense share',0.30,0.20,0.40],
 ['Institution market-share change',0.00,-0.02,0.02],
 ['National recruiter: state weight',0.25,0.10,0.40],
 ['Statewide recruiter: state weight',0.60,0.45,0.75],
 ['Regional recruiter: state weight',0.85,0.75,0.95],
]
ass.get_range('A4:D13').values=ass_rows
ass.get_range('B4:D13').format.font={'color':BLUE}; ass.get_range('B4:B13').format.fill=YELLOW
ass.get_range('B4').data_validation={'rule':{'type':'list','values':[2030,2035,2041]}}
ass.get_range('B5:D6').format.number_format=pct_fmt; ass.get_range('B8:D13').format.number_format=pct_fmt; ass.get_range('B7:D7').format.number_format='0.00'
ass.get_range('A16:D16').values=[['National graduate market change','2030','2035','2041']]; ass.get_range('A16:D16').format=header_fmt
national_change={int(r['class_year']):float(r['pct_change_from_2026']) for r in national}
ass.get_range('A17:D17').values=[['Change from 2026',national_change[2030],national_change[2035],national_change[2041]]]
ass.get_range('B17:D17').format.number_format=pct_fmt; ass.get_range('B17:D17').format.font={'color':BLUE}
ass.get_range('A19:B19').values=[['Selected national change',None]]; ass.get_range('B19').formulas=[['=IF(B4=2030,B17,IF(B4=2035,C17,D17))']]
ass.get_range('B19').format.number_format=pct_fmt
ass.get_range('A22:D22').values=[['Interpretation','Value','Source / note','Editable?']]; ass.get_range('A22:D22').format=header_fmt
ass.get_range('A23:D26').values=[
 ['College-going rate','62.8%','BLS October 2024 recent high-school graduate enrollment','Yes'],
 ['Four-year share','Two-thirds','BLS: about 2 in 3 enrolled recent graduates attended four-year colleges','Yes'],
 ['Finance proxy','Net tuition less adjustable instructional cost','Does not equal total institutional operating budget','Yes'],
 ['Institutional data vintage','2024 enrollment / 2022 finance','Official Scorecard has a newer June 2026 release not ingested here','No'],
]
ass.get_range('A23:D26').format.wrap_text=True; ass.freeze_panes.freeze_rows(3)

# National Market
nat.merge_cells('A1:H1'); nat.get_range('A1').values=[['National Market Outlook']]; nat.get_range('A1:H1').format=title_fmt
nat.get_range('A3:H3').values=[['Class year','Projected high-school graduates','College-going rate','Likely college entrants','Four-year share','Likely four-year entrants','Change from 2026','Scenario note']]; nat.get_range('A3:H3').format=header_fmt
for i,r in enumerate(national,start=4):
    nat.get_range(f'A{i}:B{i}').values=[[int(r['class_year']),float(r['projected_high_school_graduates'])]]
    nat.get_range(f'C{i}').formulas=[['=Assumptions!$B$5']]
    nat.get_range(f'D{i}').formulas=[[f'=B{i}*C{i}']]
    nat.get_range(f'E{i}').formulas=[['=Assumptions!$B$6']]
    nat.get_range(f'F{i}').formulas=[[f'=D{i}*E{i}']]
    nat.get_range(f'G{i}:H{i}').values=[[float(r['pct_change_from_2026']),'Central scenario; rates held constant across years']]
nat.get_range('A4:B7').format.font={'color':BLUE}; nat.get_range('G4:H7').format.font={'color':BLUE}
nat.get_range('C4:C7').format.font={'color':GREEN}; nat.get_range('E4:E7').format.font={'color':GREEN}
nat.get_range('B4:B7').format.number_format=num_fmt; nat.get_range('C4:C7').format.number_format=pct_fmt; nat.get_range('D4:D7').format.number_format=num_fmt; nat.get_range('E4:E7').format.number_format=pct_fmt; nat.get_range('F4:F7').format.number_format=num_fmt; nat.get_range('G4:G7').format.number_format=pct_fmt
nat.freeze_panes.freeze_rows(3)

# State Market
st.merge_cells('A1:P1'); st.get_range('A1').values=[['State and Local Market Outlook']]; st.get_range('A1:P1').format=title_fmt
st_headers=['State','State name','Class year','Projected high-school graduates','Change from 2026','College-going rate','Likely college entrants','Four-year share','Likely four-year entrants','Low scenario','High scenario','Current four-year UG enrollment','Institution count','Annual capacity proxy','Local pool coverage proxy','Interpretation']
st.get_range('A3:P3').values=[st_headers]; st.get_range('A3:P3').format=header_fmt
for i,r in enumerate(state_market,start=4):
    st.get_range(f'A{i}:E{i}').values=[[r['state'],r['state_name'],int(r['class_year']),float(r['projected_high_school_graduates']),float(r['pct_change_from_2026'])]]
    st.get_range(f'F{i}').formulas=[['=Assumptions!$B$5']]
    st.get_range(f'G{i}').formulas=[[f'=D{i}*F{i}']]
    st.get_range(f'H{i}').formulas=[['=Assumptions!$B$6']]
    st.get_range(f'I{i}').formulas=[[f'=G{i}*H{i}']]
    st.get_range(f'J{i}').formulas=[[f'=D{i}*Assumptions!$C$5*Assumptions!$C$6']]
    st.get_range(f'K{i}').formulas=[[f'=D{i}*Assumptions!$D$5*Assumptions!$D$6']]
    st.get_range(f'L{i}:M{i}').values=[[float(r['current_four_year_undergraduate_enrollment']),int(r['four_year_institution_count'])]]
    st.get_range(f'N{i}').formulas=[[f'=IF(L{i}=0,0,L{i}/Assumptions!$B$7)']]
    st.get_range(f'O{i}').formulas=[[f'=IF(N{i}=0,0,I{i}/N{i})']]
    st.get_range(f'P{i}').values=[['Coverage below 1.0 indicates reliance on imported, transfer, adult, international, or higher-participation demand.']]
last_state=len(state_market)+3
st.get_range(f'A4:E{last_state}').format.font={'color':BLUE}; st.get_range(f'L4:M{last_state}').format.font={'color':BLUE}; st.get_range(f'P4:P{last_state}').format.font={'color':BLUE}
st.get_range(f'F4:F{last_state}').format.font={'color':GREEN}; st.get_range(f'H4:H{last_state}').format.font={'color':GREEN}; st.get_range(f'J4:K{last_state}').format.font={'color':GREEN}
st.get_range(f'D4:D{last_state}').format.number_format=num_fmt; st.get_range(f'E4:F{last_state}').format.number_format=pct_fmt; st.get_range(f'G4:G{last_state}').format.number_format=num_fmt; st.get_range(f'H4:H{last_state}').format.number_format=pct_fmt; st.get_range(f'I4:N{last_state}').format.number_format=num_fmt; st.get_range(f'O4:O{last_state}').format.number_format=ratio_fmt; st.get_range(f'P4:P{last_state}').format.wrap_text=True
st.freeze_panes.freeze_rows(3); st.freeze_panes.freeze_columns(2)

# Institution Model
im.merge_cells('A1:AH1'); im.get_range('A1').values=[['Institution Enrollment and Financial-Pressure Model']]; im.get_range('A1:AH1').format=title_fmt
im.merge_cells('A2:AH2'); im.get_range('A2').values=[['Blue cells are source inputs; green formulas link to assumptions; black formulas are same-sheet calculations. Market scope and weights are heuristic.']]; im.get_range('A2:AH2').format=subtitle_fmt
im_headers=['UNITID','Institution','State','Control','Current UG enrollment','Admission rate','Market scope proxy','State weight','State change 2030','State change 2035','State change 2041','Selected state change','Selected national change','Blended market change','Market-share change','Projected UG enrollment','UG enrollment change','Finance data?','Net tuition revenue / FTE','Instructional expense / FTE','Current UG FTE proxy','Projected UG FTE proxy','FTE change','Tuition revenue change','Adjustable expense change','Net operating impact','Funding gap proxy','Gap % of tuition proxy','Students to close gap','Tuition increase % to close','Risk band','Latitude','Longitude','Model limitation']
im.get_range('A3:AH3').values=[im_headers]; im.get_range('A3:AH3').format=header_fmt
hard_rows=[]
for r in institutions:
    hard_rows.append([int(r['unitid']),r['institution_name'],r['state'],r['control_label'],r['current_undergraduate_enrollment'],r['admission_rate'],r['market_scope_proxy'],None,r.get('state_change_2030'),r.get('state_change_2035'),r.get('state_change_2041'),None,None,None,None,None,None,'Yes' if r['has_finance_snapshot'] else 'No',r['tuition_revenue_per_fte'],r['instructional_expenditure_per_fte'],None,None,None,None,None,None,None,None,None,None,None,r['latitude'],r['longitude'],'Undergraduate tuition-contribution proxy only; not an audited total institutional budget.'])
im.get_range(f'A4:AH{inst_last}').values=hard_rows

# Formula columns
formula_map={
'H': lambda r:f'=IF(G{r}="National",Assumptions!$B$11,IF(G{r}="Statewide",Assumptions!$B$12,Assumptions!$B$13))',
'L': lambda r:f'=IF(Assumptions!$B$4=2030,I{r},IF(Assumptions!$B$4=2035,J{r},K{r}))',
'M': lambda r:'=Assumptions!$B$19',
'N': lambda r:f'=H{r}*L{r}+(1-H{r})*M{r}+O{r}',
'O': lambda r:'=Assumptions!$B$10',
'P': lambda r:f'=E{r}*(1+N{r})',
'Q': lambda r:f'=P{r}-E{r}',
'U': lambda r:f'=E{r}*Assumptions!$B$8',
'V': lambda r:f'=P{r}*Assumptions!$B$8',
'W': lambda r:f'=V{r}-U{r}',
'X': lambda r:f'=IF(R{r}="No","",W{r}*S{r})',
'Y': lambda r:f'=IF(R{r}="No","",W{r}*T{r}*Assumptions!$B$9)',
'Z': lambda r:f'=IF(R{r}="No","",X{r}-Y{r})',
'AA':lambda r:f'=IF(R{r}="No","",MAX(0,-Z{r}))',
'AB':lambda r:f'=IF(OR(R{r}="No",U{r}*S{r}=0),"",AA{r}/(U{r}*S{r}))',
'AC':lambda r:f'=IF(OR(R{r}="No",S{r}-T{r}*Assumptions!$B$9<=0),"",AA{r}/(Assumptions!$B$8*(S{r}-T{r}*Assumptions!$B$9)))',
'AD':lambda r:f'=IF(OR(R{r}="No",U{r}*S{r}=0),"",AA{r}/(U{r}*S{r}))',
'AE':lambda r:f'=IF(R{r}="No","No finance data",IF(AB{r}>=10%,"Severe",IF(AB{r}>=5%,"High",IF(AB{r}>=2%,"Moderate","Low"))))',
}
for col,fn in formula_map.items():
    im.get_range(f'{col}4:{col}{inst_last}').formulas=[[fn(r)] for r in range(4,inst_last+1)]
for rng in [f'A4:G{inst_last}',f'I4:K{inst_last}',f'R4:T{inst_last}',f'AF4:AH{inst_last}']:
    im.get_range(rng).format.font={'color':BLUE}
for rng in [f'H4:H{inst_last}',f'L4:M{inst_last}',f'O4:O{inst_last}',f'U4:V{inst_last}',f'Y4:Y{inst_last}']:
    im.get_range(rng).format.font={'color':GREEN}
for rng in [f'N4:N{inst_last}',f'P4:Q{inst_last}',f'W4:AE{inst_last}']:
    im.get_range(rng).format.font={'color':BLACK}
im.get_range(f'E4:E{inst_last}').format.number_format=num_fmt; im.get_range(f'F4:F{inst_last}').format.number_format=pct_fmt; im.get_range(f'H4:O{inst_last}').format.number_format=pct_fmt; im.get_range(f'P4:Q{inst_last}').format.number_format=num_fmt; im.get_range(f'S4:T{inst_last}').format.number_format=money_fmt; im.get_range(f'U4:W{inst_last}').format.number_format=num_fmt; im.get_range(f'X4:AA{inst_last}').format.number_format=money_fmt; im.get_range(f'AB4:AB{inst_last}').format.number_format=pct_fmt; im.get_range(f'AC4:AC{inst_last}').format.number_format=num_fmt; im.get_range(f'AD4:AD{inst_last}').format.number_format=pct_fmt; im.get_range(f'AF4:AG{inst_last}').format.number_format='0.0000'; im.get_range(f'AH4:AH{inst_last}').format.wrap_text=True
im.get_range(f'AA4:AA{inst_last}').conditional_formats.add_data_bar({'color':'#4472C4','gradient':True})
im.get_range(f'AB4:AB{inst_last}').conditional_formats.add_color_scale({'minColor':'#E2F0D9','midColor':'#FFF2CC','maxColor':'#F4CCCC'})
im.freeze_panes.freeze_rows(3); im.freeze_panes.freeze_columns(2)
im.tables.add(f'A3:AH{inst_last}',True,'InstitutionModelTable')

# Dashboard
dash.merge_cells('A1:J1'); dash.get_range('A1').values=[['The Future College Market']]; dash.get_range('A1:J1').format=title_fmt
dash.merge_cells('A2:J2'); dash.get_range('A2').values=[['Future student demand, institutional enrollment exposure, and an editable tuition-contribution pressure scenario']]; dash.get_range('A2:J2').format=subtitle_fmt
dash.merge_cells('A4:J4'); dash.get_range('A4').values=[['Selected Scenario']]; dash.get_range('A4:J4').format=section_fmt
dash.get_range('A5:B5').values=[['Projection year',None]]; dash.get_range('B5').formulas=[['=Assumptions!B4']]
dash.get_range('D5:E5').values=[['College-going rate',None]]; dash.get_range('E5').formulas=[['=Assumptions!B5']]
dash.get_range('G5:H5').values=[['Four-year share',None]]; dash.get_range('H5').formulas=[['=Assumptions!B6']]
dash.get_range('J5').values=[['Edit on Assumptions sheet']]
for cell in ['B5','E5','H5']:
    dash.get_range(cell).format.font={'color':GREEN}
dash.get_range('E5').format.number_format=pct_fmt; dash.get_range('H5').format.number_format=pct_fmt

dash.merge_cells('A7:J7'); dash.get_range('A7').values=[['Key Outputs']]; dash.get_range('A7:J7').format=section_fmt
dash.get_range('A8:J8').values=[['Likely national four-year entrants','','National market change','','Projected UG enrollment','','Annual funding gap proxy','','Institutions modeled','']]; dash.get_range('A8:J8').format={'fill':LIGHT,'font':{'bold':True,'color':DARK},'wrap_text':True}
for span in ['A9:B9','C9:D9','E9:F9','G9:H9','I9:J9']:
    dash.merge_cells(span)
dash.get_range('A9').formulas=[["=SUMIF('National Market'!$A$4:$A$7,Assumptions!$B$4,'National Market'!$F$4:$F$7)"]]
dash.get_range('C9').formulas=[['=Assumptions!$B$19']]
dash.get_range('E9').formulas=[[f"=SUM('Institution Model'!$P$4:$P${inst_last})"]]
dash.get_range('G9').formulas=[[f"=SUM('Institution Model'!$AA$4:$AA${inst_last})"]]
dash.get_range('I9').values=[[n_inst]]
dash.get_range('A9:J9').format={'fill':PALE,'font':{'bold':True,'size':15,'color':DARK},'horizontal_alignment':'center'}
dash.get_range('A9:B9').format.number_format=num_fmt; dash.get_range('C9:D9').format.number_format=pct_fmt; dash.get_range('E9:F9').format.number_format=num_fmt; dash.get_range('G9:H9').format.number_format=money_fmt; dash.get_range('I9:J9').format.number_format=num_fmt

dash.merge_cells('A12:F12'); dash.get_range('A12').values=[['Top default 2035 pressure cases']]; dash.get_range('A12:F12').format=section_fmt
dash.get_range('A13:F13').values=[['Institution','State','Scope','Dynamic funding gap','Gap % of tuition','Dynamic risk band']]; dash.get_range('A13:F13').format=header_fmt
for i,r in enumerate(top_default,start=14):
    sr=row_by_unitid[r['unitid']]
    dash.get_range(f'A{i}:C{i}').values=[[r['institution_name'],r['state'],r['market_scope_proxy']]]
    dash.get_range(f'D{i}').formulas=[[f"='Institution Model'!AA{sr}"]]
    dash.get_range(f'E{i}').formulas=[[f"='Institution Model'!AB{sr}"]]
    dash.get_range(f'F{i}').formulas=[[f"='Institution Model'!AE{sr}"]]
dash.get_range('A14:C33').format.font={'color':BLUE}; dash.get_range('D14:F33').format.font={'color':GREEN}; dash.get_range('D14:D33').format.number_format=money_fmt; dash.get_range('E14:E33').format.number_format=pct_fmt

dash.merge_cells('H12:J12'); dash.get_range('H12').values=[['Read this first']]; dash.get_range('H12:J12').format=section_fmt
dash.merge_cells('H13:J22'); dash.get_range('H13').values=[['The funding gap is not an official institutional deficit. It estimates the loss of undergraduate net-tuition contribution after a limited variable instructional-cost adjustment. It excludes appropriations, grants, gifts, auxiliaries, hospitals, graduate enrollment, debt service, investment returns, and strategic responses. Finance inputs are older than the demographic projections.']]; dash.get_range('H13:J22').format={'fill':YELLOW,'wrap_text':True,'vertical_alignment':'top'}
chart1=dash.charts.add('line',nat.get_range('A3:F7')); chart1.title_text='National Student Market'; chart1.has_legend=True; chart1.legend.position='bottom'; chart1.set_position('H24','N40')
chart2=dash.charts.add('bar',dash.get_range('A13:D28')); chart2.title_text='Default 2035 Funding-Gap Cases'; chart2.has_legend=False; chart2.set_position('A36','G55')
dash.freeze_panes.freeze_rows(2)

# Data dictionary
dd.merge_cells('A1:D1'); dd.get_range('A1').values=[['Data Dictionary and Interpretation']]; dd.get_range('A1:D1').format=title_fmt
dd.get_range('A3:D3').values=[['Field / concept','Definition','Status','Important limitation']]; dd.get_range('A3:D3').format=header_fmt
dd_rows=[
 ['Projected high-school graduates','WICHE state projection allocated to counties using Phase 2 demographic cohorts','Source/model input','Not an independent school-grade survival forecast'],
 ['Likely college entrants','Projected graduates × college-going assumption','Formula','National behavior assumption applied uniformly'],
 ['Likely four-year entrants','Likely college entrants × four-year share assumption','Formula','Does not measure institution-specific academic eligibility'],
 ['Market scope proxy','Heuristic National / Statewide / Regional institution classification','Model assumption','Not based on actual applicant-origin files'],
 ['Blended market change','Weighted state and national graduate-pool change plus market-share scenario','Formula','Assumes other demand drivers are unchanged'],
 ['Net tuition revenue / FTE','Scorecard net tuition revenue per full-time-equivalent student','Older source input','May include graduate students'],
 ['Instructional expense / FTE','Scorecard instructional expenditure per full-time-equivalent student','Older source input','Not total institutional expense'],
 ['Funding gap proxy','Modeled tuition decline remaining after adjustable instructional-cost change','Formula','Not an audited operating deficit or cash requirement'],
]
dd.get_range('A4:D11').values=dd_rows; dd.get_range('A4:D11').format.wrap_text=True; dd.freeze_panes.freeze_rows(3)

# Sources
src.merge_cells('A1:E1'); src.get_range('A1').values=[['Sources and Data Vintages']]; src.get_range('A1:E1').format=title_fmt
src.get_range('A3:E3').values=[['Source','Use','Vintage','URL','Local file']]; src.get_range('A3:E3').format=header_fmt
src.get_range(f'A4:E{3+len(source_rows)}').values=[[r['source'],r['use'],r['vintage'],r['url'],r['local_location']] for r in source_rows]
src.get_range(f'A4:E{3+len(source_rows)}').format.wrap_text=True; src.get_range(f'D4:D{3+len(source_rows)}').format.font={'color':RED,'underline':True}; src.freeze_panes.freeze_rows(3)

# Column sizing
for col,width in {'A':14,'B':34,'C':12,'D':18,'E':18,'F':16,'G':18,'H':16,'I':16,'J':16,'K':16,'L':17,'M':17,'N':17,'O':16,'P':40}.items(): st.get_range(f'{col}1:{col}{last_state}').format.column_width=width
for col,width in {'A':12,'B':34,'C':8,'D':18,'E':17,'F':13,'G':16,'H':13,'I':14,'J':14,'K':14,'L':15,'M':15,'N':16,'O':15,'P':18,'Q':17,'R':12,'S':18,'T':18,'U':16,'V':16,'W':14,'X':18,'Y':18,'Z':18,'AA':18,'AB':16,'AC':16,'AD':16,'AE':13,'AF':12,'AG':12,'AH':38}.items(): im.get_range(f'{col}1:{col}{inst_last}').format.column_width=width
for col,width in {'A':30,'B':15,'C':15,'D':15,'E':15,'F':15,'G':15,'H':18,'I':15,'J':18}.items(): dash.get_range(f'{col}1:{col}60').format.column_width=width
ass.get_range('A1:A26').format.column_width=36; ass.get_range('B1:D26').format.column_width=18
nat.get_range('A1:G7').format.column_width=20; nat.get_range('H1:H7').format.column_width=40
dd.get_range('A1:A11').format.column_width=30; dd.get_range('B1:B11').format.column_width=50; dd.get_range('C1:C11').format.column_width=20; dd.get_range('D1:D11').format.column_width=50
src.get_range(f'A1:A{3+len(source_rows)}').format.column_width=38; src.get_range(f'B1:B{3+len(source_rows)}').format.column_width=42; src.get_range(f'C1:C{3+len(source_rows)}').format.column_width=30; src.get_range(f'D1:D{3+len(source_rows)}').format.column_width=55; src.get_range(f'E1:E{3+len(source_rows)}').format.column_width=48

nat.tables.add('A3:H7',True,'NationalMarketTable'); st.tables.add(f'A3:P{last_state}',True,'StateMarketTable'); src.tables.add(f'A3:E{3+len(source_rows)}',True,'SourcesTable')

SpreadsheetFile.export_xlsx(wb).save(str(XLSX_PATH))
print(wb.inspect({'kind':'table','range':'Dashboard!A1:J22','include':'values,formulas','table_max_rows':22,'table_max_cols':10}).ndjson)
print(wb.inspect({'kind':'match','search_term':'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A','options':{'use_regex':True,'max_results':100},'summary':'final formula error scan'}).ndjson)
wb.render({'sheet_name':'Dashboard','range':'A1:J33','scale':1.2}).save(str(PREVIEW_PATH))
print(f'Workbook saved: {XLSX_PATH}')
print(f'Institutions: {n_inst}')
