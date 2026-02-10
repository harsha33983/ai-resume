import os
import json
import logging
from openai import OpenAI
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
API_KEY = "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"
BASE_URL = "https://integrate.api.nvidia.com/v1"
MODEL = "qwen/qwen2.5-coder-32b-instruct"

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

def parse_resume_with_ai(text: str) -> Dict[str, Any]:
    """
    Parses resume text using the Nvidia API (Qwen 2.5 Coder) with streaming.
    Returns a structured dictionary matching the ResumeData schema.
    """
    if not text or not text.strip():
        return _get_empty_resume_data()

    client = OpenAI(
        base_url=BASE_URL,
        api_key=API_KEY
    )

    schema_instruction = """
    You are a precise resume parsing AI. Convert the following resume text into a STRICT JSON object.
    
    The output must strictly follow this schema:
    {
        "personal": {
            "fullName": "Name",
            "email": "Email",
            "phone": "Phone",
            "location": "City, Country",
            "linkedin": "URL",
            "github": "URL",
            "portfolio": "URL",
            "title": "Job Title (e.g. Software Engineer)",
            "photoUrl": ""
        },
        "summary": "Professional summary text...",
        "skills": ["Skill1", "Skill2", ...],
        "education": [
            { "id": "edu-1", "institution": "University Name", "degree": "Degree Name", "startDate": "YYYY", "endDate": "YYYY", "gpa": "3.8" }
        ],
        "experience": [
            { "id": "exp-1", "company": "Company Name", "role": "Job Title", "startDate": "Month YYYY", "endDate": "Month YYYY or Present", "location": "City", "bullets": ["Task 1", "Task 2"] }
        ],
        "projects": [
            { "id": "proj-1", "name": "Project Name", "description": "Short description", "technologies": ["Tech1", "Tech2"], "bullets": ["Feature 1", "Feature 2"], "link": "URL" }
        ],
        "certifications": [
            { "id": "cert-1", "name": "Cert Name", "issuer": "Issuer", "date": "Date", "link": "" }
        ],
        "customSections": []
    }

    IMPORTANT:
    - Return ONLY the raw JSON string. Do not use markdown formatting (```json ... ```).
    - If a field is missing, use an empty string "" or empty list [].
    - Extract dates in a consistent format if possible.
    - Ensure all lists (experience, projects, education) have unique "id" fields (e.g., "exp-1", "exp-2").
    """

    messages = [
        {"role": "system", "content": schema_instruction},
        {"role": "user", "content": f"Resume Text:\n\n{text}"}
    ]

    try:
        logger.info("Sending resume text to Nvidia API for parsing...")
        completion = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.2, # Low temperature for consistent JSON
            top_p=0.7,
            max_tokens=2048, # Increased to ensure full JSON fits
            stream=True # Enable stream as requested
        )

        full_content = ""
        
        # Accumulate streaming response
        for chunk in completion:
            if chunk.choices and chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                full_content += content
                # Optional: print(content, end="", flush=True) if debugging needed

        # Clean response if it contains markdown code blocks
        clean_content = full_content.strip()
        if clean_content.startswith("```json"):
            clean_content = clean_content[7:]
        if clean_content.startswith("```"):
            clean_content = clean_content[3:]
        if clean_content.endswith("```"):
            clean_content = clean_content[:-3]
            
        parsed_data = json.loads(clean_content.strip())
        
        # Merge with default to ensure no missing keys
        default_data = _get_empty_resume_data()
        
        # Helper to merge dicts safely (shallow merge for top keys)
        final_data = default_data.copy()
        for key in final_data:
            if key in parsed_data:
                final_data[key] = parsed_data[key]
                
        logger.info("Successfully parsed resume with AI.")
        return final_data

    except json.JSONDecodeError as je:
        logger.error(f"Failed to decode JSON from AI response: {je}")
        logger.error(f"Response content (partial): {full_content[:500]}...")
        return _get_empty_resume_data()
    except Exception as e:
        logger.error(f"Error calling Nvidia API: {e}")
        return _get_empty_resume_data()
