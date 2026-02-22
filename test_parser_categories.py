
import sys
import os
import json

# Add resume-backend to path
# This assumes the script is run from the project root (e.g. c:\Users\Harsha\Downloads\ai-resume-studio (2))
project_root = os.getcwd()
backend_path = os.path.join(project_root, 'resume-backend')

if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

print(f"Added {backend_path} to sys.path")

try:
    from ai_parser import parse_resume_with_ai
except ImportError as e:
    print(f"Error importing ai_parser: {e}")
    sys.exit(1)

# Mock text designed to trigger categorization
mock_resume_text = """
Jane Doe
Senior Full Stack Engineer

Professional Summary
Experienced engineer with a focus on scalable web applications.

Skills
Languages: Python, JavaScript, TypeScript, Go
Frontend: React, Next.js, Tailwind CSS, Redux
Backend: Node.js, Django, PostgreSQL, Redis
DevOps: Docker, Kubernetes, AWS, CI/CD
Soft Skills: Leadership, Communication, Agile

Experience
Senior Developer at Tech Corp
Jan 2020 - Present
- Built scalable APIs using Django and Node.js
"""

print("\n--- Testing Parser with Categorized Skills ---")
print("Sending mock resume text to AI parser...")

try:
    # Call the parser
    result = parse_resume_with_ai(mock_resume_text)
    
    print("\n--- Parsed Result (Skills Section) ---")
    skills_data = result.get("skills", [])
    
    # Pretty print the skills section
    print(json.dumps(skills_data, indent=2))
    
    # Verification logic
    is_categorized = False
    if isinstance(skills_data, list) and len(skills_data) > 0:
        first_item = skills_data[0]
        if isinstance(first_item, dict) and "name" in first_item and "items" in first_item:
            is_categorized = True
            
    if is_categorized:
        print("\n✅ SUCCESS: Skills are correctly categorized!")
        print(f"Found {len(skills_data)} categories.")
        for cat in skills_data:
            print(f"- {cat.get('name')}: {len(cat.get('items', []))} items")
    else:
        print("\n❌ FAILURE: Skills are NOT categorized correctly.")
        print("Expected list of objects with 'name' and 'items', got:", type(skills_data))

except Exception as e:
    print(f"\n❌ Error during parsing: {e}")
