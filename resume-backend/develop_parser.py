import re
import json

sample_text = """
PUVVADI SIMHADHRI 
9390718782 | puvvadisimhadri123@gmail.com | 
LinkedIn: https://www.linkedin.com/in/puvvadi-simhadhri-3b744726a 
OBJECTIVE 
Entry-level Data Analyst with hands-on experience in Python, SQL, Excel, Power BI, and 
Tableau. Skilled in data cleaning, exploratory data analysis (EDA), data visualization, and 
KPI reporting to generate actionable business insights. Experienced in real-world analytics 
projects and job simulations with strong problem-solving and data storytelling skills. 
EDUCATION 
 B.Tech – Artificial Intelligence & Data Science 
Dhanalakshmi Srinivasan University, Tamil Nadu | 2022 – 2026    
CGPA- 8.0 
 Intermediate Education – Narayana Junior College, Andhra Pradesh | 2020-2022 
Percentage – 87.3 
 High School – Sri Chaitanya High School, Andhra Pradesh | 2020 
Percentage -100% 
SKILLS 
 Analytical Tools: Excel (Dashboards, Reports), SQL, Python (Pandas,Numpy,Matplotlib), 
Power BI, Tableau 
 Communication & Leadership: Public speaking, presentation, team collaboration 
 Productivity Tools: MS PowerPoint, MS Word, 
 Core Competencies: Time management, adaptability, problem-solving, result 
orientation 
CERTIFICATIONS 
 Professional Certificate in SQL & Data Analytics – Udemy, 2025 
 AI Tools Workshop – Be10x, 2025 
 Excel for Beginners – Simplilearn (Microsoft Powered) 
 Gen AI Powered Data Analytics Job Simulation – Forage 
Completed Tasks including EDA, AI-based predictions, Reporting and Strategy 
 Deloitte Australia Data Analytics Job Simulation on Forage - January 2026 
Completed a Deloitte job simulation involving data analysis and forensic technology 
Created a data dashboard using Tableau 
Used Excel to classify data and draw business conclusions 
INTERNSHIP 
Power BI Intern - CodTech IT Solutions | Remote 
Duration: Month Year – Month Year 
Key Responsibilities & Achievements: - Developed Power BI dashboards using business datasets to generate actionable insights - Integrated multiple data sources (SQL Server and Excel) into a unified Power BI data model. - Designed dashboards with KPIs, slicers, drill-downs, and filters for dynamic analysis. - Built a real-time streaming dashboard using Power BI Service to visualize live data updates. 
PROJECTS 
 Customer Insights Dashboard (Excel) 
Project Description - Designed an interactive Customer Insights Dashboard in Excel to analyze customer 
behavior and business performance. - Performed data cleaning and preprocessing using Excel formulas and Power Query. - Used Pivot Tables, Pivot Charts, slicers, and filters to enable dynamic analysis. 
 Tableau Dashboard – Data Visualization & Insights 
Project Description: - Designed an interactive Tableau dashboard to visualize and analyze business data. - Created KPIs, charts, and visual reports to identify trends and patterns. - Used filters, parameters, and calculated fields for dynamic user interaction. - Delivered actionable insights to support data-driven decision-making. 
 Integrated Power BI Sales Dashboard 
Project Description: - Designed and developed an integrated Power BI Sales Dashboard by combining data 
from multiple sources. - Created interactive dashboards with slicers, drill-downs, and filters for real-time 
analysis. - Provided actionable insights to track sales performance, customer trends, and regional 
analysis.
"""

def parse_full_resume(text):
    # Regex Patterns
    EMAIL_PATTERN = r'[\w\.-]+@[\w\.-]+\.\w+'
    PHONE_PATTERN = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
    LINKEDIN_PATTERN = r'linkedin\.com/in/[\w\.-]+'
    
    # Sections to identify
    SECTIONS = {
        "OBJECTIVE": ["OBJECTIVE", "SUMMARY", "PROFESSIONAL SUMMARY"],
        "EDUCATION": ["EDUCATION", "ACADEMIC BACKGROUND"],
        "SKILLS": ["SKILLS", "TECHNICAL SKILLS", "CORE COMPETENCIES"],
        "CERTIFICATIONS": ["CERTIFICATIONS", "COURSES"],
        "EXPERIENCE": ["INTERNSHIP", "EXPERIENCE", "WORK EXPERIENCE", "EMPLOYMENT"],
        "PROJECTS": ["PROJECTS", "ACADEMIC PROJECTS"]
    }

    lines = [line.strip() for line in text.split('\n') if line.strip()]

    # 1. Basic Info
    email_match = re.search(EMAIL_PATTERN, text)
    phone_match = re.search(PHONE_PATTERN, text)
    linkedin_match = re.search(LINKEDIN_PATTERN, text, re.I)
    
    name = lines[0] # Assumption

    # 2. Section Segmentation
    section_content = {k: [] for k in SECTIONS}
    current_section = None
    
    # Heuristic: headers are usually short, uppercase, and match keywords
    for line in lines:
        upper_line = line.upper().replace(":", "").strip()
        
        is_header = False
        for section, keywords in SECTIONS.items():
            if upper_line in keywords:
                current_section = section
                is_header = True
                break
        
        if is_header:
            continue
            
        if current_section:
            section_content[current_section].append(line)
        elif not current_section and len(section_content["OBJECTIVE"]) == 0:
             # Captured lines before any section as potential Summary/Objective if not already captured
             pass 

    # 3. Parse Specific Sections
    
    # EDUCATION
    education = []
    edu_lines = section_content["EDUCATION"]
    current_edu = {}
    
    for i, line in enumerate(edu_lines):
        # Detect new education block by keyword
        if any(kw in line.upper() for kw in ["B.TECH", "M.TECH", "DEGREE", "INTERMEDIATE", "HIGH SCHOOL", "BACHELOR", "MASTER", "DIPLOMA"]):
            if current_edu: education.append(current_edu)
            current_edu = {"id": f"edu-{len(education)+1}", "degree": line, "institution": "", "startDate": "", "endDate": "", "gpa": ""}
        elif current_edu:
            # Check for year (e.g., 2022 - 2026)
            year_match = re.search(r'(20\d{2})\s*[-–]\s*(20\d{2}|Present)', line)
            year_single = re.search(r'(20\d{2})', line)
            
            if year_match:
                 current_edu["startDate"] = year_match.group(1)
                 current_edu["endDate"] = "Present" if "Present" in year_match.group(0) else year_match.group(2)
            elif year_single and not current_edu.get("startDate"):
                 # if explicit start not found, maybe completion year
                 current_edu["endDate"] = year_single.group(1)
            
            # Check for institution
            if "UNIVERSITY" in line.upper() or "COLLEGE" in line.upper() or "SCHOOL" in line.upper():
                 current_edu["institution"] = line.split('|')[0].strip()

            # Check for GPA
            if "CGPA" in line.upper() or "PERCENTAGE" in line.upper():
                  current_edu["gpa"] = re.sub(r'[^\d\.]', '', line)

    if current_edu: education.append(current_edu)

    # EXPERIENCE
    experience = []
    exp_lines = section_content["EXPERIENCE"]
    current_exp = {}
    
    for line in exp_lines:
        if "INTERN" in line.upper() or "ANALYST" in line.upper() or "DEVELOPER" in line.upper():
             if current_exp: experience.append(current_exp)
             parts = line.split('-')
             role = parts[0].strip()
             company = parts[1].split('|')[0].strip() if len(parts) > 1 else ""
             current_exp = {
                "id": f"exp-{len(experience)+1}",
                "role": role,
                "company": company,
                "startDate": "", "endDate": "", "location": "", "bullets": []
            }
        elif current_exp:
            if "Duration:" in line:
                 current_exp["startDate"] = line.replace("Duration:", "").strip()
            elif line.startswith("-") or line.startswith("•"):
                 current_exp["bullets"].append(line.lstrip("-• "))
            elif line.startswith("Key Responsibilities"):
                 pass
    
    if current_exp: experience.append(current_exp)

    # PROJECTS
    projects = []
    proj_lines = section_content["PROJECTS"]
    current_proj = {}
    
    for line in proj_lines:
        # Detect Project Title (heuristic: not starting with bullet, shortish, not "Project Description")
        if not line.startswith("-") and "Description" not in line and len(line) < 50:
             if current_proj: projects.append(current_proj)
             current_proj = {
                 "id": f"proj-{len(projects)+1}",
                 "name": line,
                 "description": "",
                 "technologies": [],
                 "bullets": [],
                 "link": ""
             }
        elif current_proj:
            if line.startswith("-") or line.startswith("•"):
                 current_proj["bullets"].append(line.lstrip("-• "))
            elif "Description" in line:
                 current_proj["description"] = line.split("Description")[-1].lstrip(":- ").strip()

    if current_proj: projects.append(current_proj)

    # SKILLS
    skills = []
    skill_lines = section_content["SKILLS"]
    for line in skill_lines:
        # User format: "Category: Skill1, Skill2"
        if ":" in line:
             _, s_list = line.split(":", 1)
             skills.extend([s.strip() for s in s_list.split(',')])
        else:
             skills.extend([s.strip() for s in line.split(',')])
    
    # Clean empty skills
    skills = [s for s in skills if s]

    return {
        "personal": {
            "fullName": name,
            "email": email_match.group(0) if email_match else "",
            "phone": phone_match.group(0) if phone_match else "",
            "linkedin": linkedin_match.group(0) if linkedin_match else "",
            "portfolio": "",
            "github": "",
            "title": "",
            "photoUrl": ""
        },
        "summary": " ".join(section_content["OBJECTIVE"]),
        "skills": skills,
        "education": education,
        "experience": experience,
        "projects": projects,
        "certifications": [], # TODO
        "customSections": []
    }

result = parse_full_resume(sample_text)
print(json.dumps(result, indent=2))
