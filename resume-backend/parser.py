import re
import os
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try importing pdfminer
try:
    from pdfminer.high_level import extract_text as extract_pdf_text
except ImportError:
    logger.warning("pdfminer.six not found. PDF parsing will be disabled.")
    extract_pdf_text = None

# Try importing python-docx
try:
    from docx import Document
except ImportError:
    logger.warning("python-docx not found. DOCX parsing will be disabled.")
    Document = None

def extract_text_from_pdf(file_path: str) -> str:
    if not extract_pdf_text:
        return ""
    try:
        return extract_pdf_text(file_path)
    except Exception as e:
        logger.error(f"Error extracting PDF text: {e}")
        return ""

def extract_text_from_docx(file_path: str) -> str:
    if not Document:
        return ""
    try:
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        logger.error(f"Error extracting DOCX text: {e}")
        return ""

def _get_empty_resume_data():
    return {
        "personal": {
            "fullName": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": "",
            "github": "",
            "portfolio": "",
            "title": "",
            "photoUrl": ""
        },
        "summary": "",
        "skills": [],
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": [],
        "customSections": []
    }

def parse_full_resume_text(text: str) -> Dict[str, Any]:
    """
    Parses resume text into a structured JSON object.
    """
    # Defensive check
    if not text:
        return _get_empty_resume_data()

    # 1. Cleaning and Normalization
    def clean(s):
        # Replace various dashes with standard hyphen
        s = s.replace('–', '-').replace('—', '-').replace('−', '-')
        # Replace bullet points
        s = s.replace('•', '-').replace('⚫', '-').replace('▪', '-')
        # Normalize whitespace
        return re.sub(r'\s+', ' ', s or "").strip()

    lines = [clean(l) for l in text.splitlines() if clean(l)]

    if not lines:
        return _get_empty_resume_data()

    data = _get_empty_resume_data()

    # 2. Parse Basic Info (Top Section)
    # Heuristic: Name is usually the first non-header line.
    # Email/Phone/Links can be extracted via regex from the entire text or top section.

    # Regexes
    EMAIL_REGEX = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    PHONE_REGEX = r'(?:\+?\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}'
    LINKEDIN_REGEX = r'(?:linkedin\.com\/(?:in|profile)\/[\w\.-]+)'
    GITHUB_REGEX = r'(?:github\.com\/[\w\.-]+)'
    # Generic URL for portfolio (excluding known social media if possible, logic below)
    URL_REGEX = r'(https?:\/\/[^\s]+)|(www\.[^\s]+)'

    # Extract Basic Fields
    email_match = re.search(EMAIL_REGEX, text)
    if email_match:
        data["personal"]["email"] = email_match.group(0)

    phone_match = re.search(PHONE_REGEX, text)
    if phone_match:
        data["personal"]["phone"] = phone_match.group(0)

    # Links
    links = re.findall(URL_REGEX, text)
    for l_tuple in links:
        link = "".join(l_tuple)
        if "linkedin.com" in link:
            data["personal"]["linkedin"] = link
        elif "github.com" in link:
            data["personal"]["github"] = link
        elif "portfolio" in link.lower() or (not data["personal"]["portfolio"] and "linkedin" not in link and "github" not in link):
            data["personal"]["portfolio"] = link

    # Name: Assume first line.
    # Exclude if it looks like "Resume" or contact info.
    if lines:
        first_line = lines[0]
        if "resume" not in first_line.lower() and "@" not in first_line:
             data["personal"]["fullName"] = first_line

    # 3. Section Segmentation
    # Headers to look for
    SECTION_HEADERS = {
        "summary": ["summary", "professional summary", "about", "about me", "profile", "objective"],
        "experience": ["experience", "work experience", "employment", "professional experience", "work history"],
        "projects": ["projects", "personal projects", "academic projects", "key projects"],
        "education": ["education", "academic background", "qualifications", "education details"],
        "skills": ["skills", "technical skills", "technologies", "core competencies", "skills & abilities"],
        "certifications": ["certifications", "licenses", "courses", "achievements", "awards"],
        "custom": [] # Placeholder
    }
    
    # Invert mapping for easier lookup
    header_map = {}
    for sec, headers in SECTION_HEADERS.items():
        for h in headers:
            header_map[h] = sec

    sections = {} # { "summary": ["line1", "line2"], ... }
    current_section = None
    
    # Iterate lines to group by section
    for line in lines:
        lower_line = line.lower().replace(":", "").strip()
        
        # Check if line is a header
        if lower_line in header_map:
            current_section = header_map[lower_line]
            if current_section not in sections:
                sections[current_section] = []
            continue # Don't add header itself
        
        if current_section:
            sections[current_section].append(line)
        else:
            # If no section yet, maybe add to summary if it's not the name/contact
            # Heuristic: if summary not started, and line is long, maybe implicit summary?
            pass

    # 4. Parse Specific Sections
    
    # --- SUMMARY ---
    if "summary" in sections:
        data["summary"] = " ".join(sections["summary"])

    # --- EXPERIENCE ---
    if "experience" in sections:
        exp_list = []
        current_exp = {}
        
        # Date Pattern: (Month Year) - (Month Year | Present)
        # Supports: Sep 2022, Sept 2022, 09/2022, 2022
        MONTHS = r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?'
        YEAR = r'\d{4}'
        DATE_PART = f'(?:{MONTHS}\\s*{YEAR}|\\d{{1,2}}/{YEAR}|{YEAR}|Present|Current|Now)'
        # Range: Part - Part
        DATE_RANGE_REGEX = re.compile(f'({DATE_PART})\\s*[-to]+\\s*({DATE_PART})', re.IGNORECASE)
        
        exp_lines = sections["experience"]
        i = 0
        while i < len(exp_lines):
            line = exp_lines[i]
            
            # Check for Company + Date Line
            date_match = DATE_RANGE_REGEX.search(line)
            
            if date_match and len(line) < 100: # Heuristic length check
                # Found new job start
                company_part = line[:date_match.start()].strip().strip(',|- ')
                # If company part is empty, maybe it's on previous line? 
                # User constraint: "company + date line". Assume company is here.
                company = company_part if company_part else "Unknown Company"
                
                start_date = date_match.group(1)
                end_date = date_match.group(2)
                
                role = ""
                bullets = []
                
                # Next line = Role (User constraint)
                i += 1
                if i < len(exp_lines):
                    role_line = exp_lines[i]
                    if not role_line.startswith("-"):
                        role = role_line
                        i += 1
                    else:
                        # Sometimes role is missing or merged? 
                        pass
                
                # Next lines = Bullets
                while i < len(exp_lines):
                    bullet_line = exp_lines[i]
                    # Check if this line looks like a new job date line
                    if DATE_RANGE_REGEX.search(bullet_line):
                        break # Stop, new job found
                    
                    if bullet_line.startswith("-"):
                        bullets.append(bullet_line.lstrip("- ").strip())
                    else:
                        # Append checks? 
                        # If robust, maybe assume anything not a date line is part of description
                        bullets.append(bullet_line)
                    i += 1
                
                exp_list.append({
                    "id": f"exp-{len(exp_list)+1}",
                    "company": company,
                    "role": role,
                    "startDate": start_date,
                    "endDate": end_date,
                    "location": "",
                    "bullets": bullets
                })
                continue # Continued in inner loop
            else:
                # Line didn't match date range, maybe just text or stray line?
                pass
                
            i += 1
        
        data["experience"] = exp_list

    # --- PROJECTS ---
    if "projects" in sections:
        proj_list = []
        proj_lines = sections["projects"]
        i = 0
        
        while i < len(proj_lines):
            line = proj_lines[i]
            
            # Project Title Line
            # User constraint: title line (possibly with | Demo) followed by bullets
            # Identify title by NOT being a bullet
            if not line.startswith("-"):
                raw_title = line
                # Extract Link if "Live Demo" or "|"
                link = ""
                name = raw_title
                
                if "Live Demo" in raw_title:
                     parts = raw_title.split("Live Demo")
                     name = parts[0].strip().strip("| ")
                     # Check if URL in parts[1]? regex would catch it in links list, 
                     # but associating here is harder without context. 
                     # Just use name for now.
                
                if "|" in name:
                    name = name.split("|")[0].strip()
                
                bullets = []
                i += 1
                while i < len(proj_lines):
                    b_line = proj_lines[i]
                    if not b_line.startswith("-"):
                        break
                    bullets.append(b_line.lstrip("- ").strip())
                    i += 1
                
                proj_list.append({
                    "id": f"proj-{len(proj_list)+1}",
                    "name": name,
                    "description": "", # User didn't specify description parsing
                    "technologies": [],
                    "bullets": bullets,
                    "link": link
                })
                continue
            i += 1
            
        data["projects"] = proj_list

    # --- EDUCATION ---
    if "education" in sections:
        edu_list = []
        edu_lines = sections["education"]
        # Pattern: Institution, Degree, Date, GPA parsing
        # Robust strategy: Treat blocks separated by dates?
        
        # Similar logic to Experience but for Edu
        # Regex for single date (Graduation year) or range
        YEAR_REGEX = r'\b(20\d{2})\b'
        
        current_edu = {}
        
        for line in edu_lines:
             # Heuristic: Date usually marks an entry
             date_match = re.search(YEAR_REGEX, line)
             
             # If line contains University/College/Institute/School -> New Institution
             is_inst = any(k in line.lower() for k in ['university', 'college', 'school', 'institute'])
             # If line contains Degree -> Degree
             is_degree = any(k in line.lower() for k in ['b.tech', 'm.tech', 'bachelor', 'master', 'degree', 'diploma', 'phd'])
             
             if is_inst or (date_match and not current_edu):
                 if current_edu and current_edu.get("institution"):
                     edu_list.append(current_edu)
                     current_edu = {}
                 
                 if not current_edu:
                      current_edu = {"id": f"edu-{len(edu_list)+1}", "institution": "", "degree": "", "startDate": "", "endDate": "", "gpa": ""}
                 
                 if is_inst:
                     # Clean date from inst line if present
                     current_edu["institution"] = re.sub(YEAR_REGEX, '', line).strip().strip(',|- ')
                 
                 # Check for dates in this line
                 dates = re.findall(YEAR_REGEX, line)
                 if dates:
                     current_edu["endDate"] = dates[-1] # Assume last date is grad year
                     if len(dates) > 1:
                         current_edu["startDate"] = dates[0]
             
             if is_degree:
                 if not current_edu:
                      current_edu = {"id": f"edu-{len(edu_list)+1}", "institution": "", "degree": "", "startDate": "", "endDate": "", "gpa": ""}
                 current_edu["degree"] = line
            
             # GPA
             gpa_match = re.search(r'(?:GPA|CGPA|Percentage)[:\s]+([\d\.]+)', line, re.IGNORECASE)
             if gpa_match:
                 if not current_edu:
                     current_edu = {"id": f"edu-{len(edu_list)+1}", "institution": "", "degree": "", "startDate": "", "endDate": "", "gpa": ""}
                 current_edu["gpa"] = gpa_match.group(1)

        if current_edu:
            edu_list.append(current_edu)
        
        data["education"] = edu_list

    # --- SKILLS ---
    if "skills" in sections:
        skills = []
        for line in sections["skills"]:
            # Pattern: "Backend: Node, Python"
            if ":" in line:
                val = line.split(":", 1)[1]
                parts = [s.strip() for s in val.split(",")]
                skills.extend([p for p in parts if p])
            else:
                # Just list
                parts = [s.strip() for s in line.split(",")]
                skills.extend([p for p in parts if p])
        
        data["skills"] = list(set(skills)) # Unique

    # --- CERTIFICATIONS ---
    if "certifications" in sections:
        cert_list = []
        # Pattern: • React.js Crash Course Udemy, Dec 2024
        for line in sections["certifications"]:
            clean_l = line.lstrip("- ")
            # Try to extract Date (Dec 2024)
            # Regex: (.*?),? ((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})
            date_match = re.search(r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})', clean_l, re.IGNORECASE)
            
            name = clean_l
            date = ""
            issuer = ""
            
            if date_match:
                date = date_match.group(1)
                text_before = clean_l[:date_match.start()].strip().strip(',- ')
                name = text_before
            
            # Issuer heuristic: Last word before date? Or separated by comma?
            # "React Course Udemy, Dec 2024" -> Name: React Course, Issuer: Udemy
            # Split by last comma if present
            if "," in name:
                parts = name.rsplit(",", 1)
                name = parts[0].strip()
                issuer = parts[1].strip()
            
            cert_list.append({
                "id": f"cert-{len(cert_list)+1}",
                "name": name,
                "issuer": issuer,
                "date": date,
                "link": ""
            })
        data["certifications"] = cert_list

    return data

def parse_resume(file_path: str) -> Dict[str, Any]:
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    
    logger.info(f"Parsing file: {file_path} with extension {ext}")

    if ext == ".pdf":
        text = extract_text_from_pdf(file_path)
    elif ext == ".docx":
        text = extract_text_from_docx(file_path)
    
    try:
        if not text:
            logger.warning("No text extracted from file.")
            return _get_empty_resume_data()
            
        # Use AI Parser instead of rule-based
        from ai_parser import parse_resume_with_ai
        return parse_resume_with_ai(text)
        
    except Exception as e:
        logger.error(f"Error in parse_resume: {e}")
        return _get_empty_resume_data()
