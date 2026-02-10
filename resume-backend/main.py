import os
import uuid
import shutil
import logging
from typing import Dict
from fastapi import FastAPI, File, UploadFile, HTTPException, status, Body
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import the parser function exactly as requested
from parser import parse_resume

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Resume Parser Backend")

# CORS Middleware for Next.js
# Allowing all origins for development convenience, but this should be restricted in production.
origins = [
    "http://localhost:3000",  # Default Next.js port
    "*", # Allow all for now to avoid issues if port differs
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/health", status_code=status.HTTP_200_OK)
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify the service is running.
    """
    return {"status": "ok"}

@app.post("/parse-resume", status_code=status.HTTP_200_OK)
async def parse_resume_endpoint(file: UploadFile = File(...)):
    """
    Endpoint to parse a resume file.
    
    Accepts: .pdf, .docx
    Returns: Parsed JSON data
    """
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in [".pdf", ".docx"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only .pdf and .docx are allowed."
        )

    # Use UUID for a unique filename to prevent collisions
    temp_filename = f"{uuid.uuid4()}{file_extension}"
    temp_file_path = os.path.join(TEMP_DIR, temp_filename)

    try:
        # Save the file temporarily
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"File saved to {temp_file_path}, processing...")

        # Parse the resume using the imported function
        # This is a synchronous call. If parsing is heavy, consider running in a threadpool.
        # But for this requirement, we call it directly as requested.
        parsed_data = parse_resume(temp_file_path)
        
        logger.info("Resume parsed successfully.")
        return parsed_data

    except Exception as e:
        logger.error(f"Error parsing resume: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the resume: {str(e)}"
        )
    finally:
        # cleanup: always delete the temp file
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
                logger.info(f"Temporary file {temp_file_path} deleted.")
            except Exception as cleanup_error:
                logger.warning(f"Failed to delete temporary file: {cleanup_error}")

class TextRequest(BaseModel):
    text: str

@app.post("/parse-text", status_code=status.HTTP_200_OK)
async def parse_text_endpoint(request: TextRequest):
    """
    Endpoint to parse raw resume text.
    """
    try:
        # Import inside function to avoid circular dependency if moved
        from ai_parser import parse_resume_with_ai
        from parser import _get_empty_resume_data
        
        if not request.text.strip():
             return _get_empty_resume_data()
             
        # Reuse the logic from parser.py
        try:
             return parse_resume_with_ai(request.text)
        except Exception as e:
             logger.error(f"Error parsing text: {e}")
             return _get_empty_resume_data()
             
    except Exception as e:
        logger.error(f"Error in parse-text endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )

# ----------------- Interview Prep Endpoint -----------------

class InterviewRequest(BaseModel):
    role: str
    topic: str
    messages: list = []

@app.post("/interview-prep", status_code=status.HTTP_200_OK)
async def interview_prep_endpoint(request: InterviewRequest):
    """
    Endpoint for AI Interview Prep using Nvidia API.
    """
    try:
        from openai import OpenAI
        
        # Use key provided by user
        API_KEY = "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"
        BASE_URL = "https://integrate.api.nvidia.com/v1"
        
        client = OpenAI(
            base_url=BASE_URL,
            api_key=API_KEY
        )
        
        system_prompt = f"""You are an expert technical interviewer conducting a mock interview for a {request.role} position. 
        The focus area is: {request.topic}.
        
        Your goal is to assess the candidate's knowledge, problem-solving skills, and communication.
        
        CRITICAL INSTRUCTION:
        - If the user has provided an answer to a previous question, you MUST evaluate it first. Start your response with "Evaluation: [Correct/Partially Correct/Incorrect]" followed by a brief specific feedback.
        - Then, ask the NEXT question.
        
        Guidelines:
        - Ask ONE question at a time.
        - If the candidate answers correctly, acknowledge it briefly and move to a slightly harder or related question.
        - If the candidate is wrong or stuck, provide a helpful hint or guidance without giving the full answer immediately, then ask a follow-up.
        - Keep your responses concise and conversational (suitable for voice interaction).
        - Do not output markdown lists or long code blocks unless absolutely necessary, as this is primarily a voice/text chat.
        - Be professional, encouraging, but rigorous.
        
        Start by introducing yourself and asking the first question about {request.topic}."""

        # Validation Logic
        VALID_ROLES = {"system", "user", "assistant", "developer", "tool"}
        
        def validate_and_map_role(role_str):
            if role_str == "model":
                return "assistant"
            if role_str not in VALID_ROLES:
                raise ValueError(f"Invalid role '{role_str}'. Allowed roles: {VALID_ROLES}")
            return role_str

        api_messages = [{"role": "system", "content": system_prompt}]
        
        if not request.messages:
             # Trigger initial greeting
             api_messages.append({"role": "user", "content": f"Start the interview for a {request.role} focused on {request.topic}."})
        else:
             for i, m in enumerate(request.messages):
                 raw_role = m.get("role")
                 try:
                     mapped_role = validate_and_map_role(raw_role)
                 except ValueError as ve:
                     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
                 
                 content = m.get("text") or m.get("content")
                 if content:
                     api_messages.append({"role": mapped_role, "content": content})

        completion = client.chat.completions.create(
          model="openai/gpt-oss-120b",
          messages=api_messages,
          temperature=1,
          top_p=1,
          max_tokens=4096,
          stream=True
        )

        full_content = ""
        full_reasoning = ""

        for chunk in completion:
            if not getattr(chunk, "choices", None):
                continue
            
            delta = chunk.choices[0].delta
            
            reasoning = getattr(delta, "reasoning_content", None)
            if reasoning:
                full_reasoning += reasoning
                # print(reasoning, end="", flush=True)

            if delta.content is not None:
                content = delta.content
                full_content += content
                # print(content, end="", flush=True)
        
        if full_reasoning:
            logger.info(f"Model Reasoning:\n{full_reasoning}")

        return {"content": full_content}

    except Exception as e:
        logger.error(f"Error in interview-prep: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Interview prep failed: {str(e)}"
        )

# ----------------- Mock Test Endpoint -----------------

class MockTestRequest(BaseModel):
    role: str
    seniority: str = "mid-level"
    missingSkills: list = []

@app.post("/mock-test", status_code=status.HTTP_200_OK)
async def mock_test_endpoint(request: MockTestRequest):
    """
    Endpoint for AI Mock Test Generation using Nvidia API.
    """
    try:
        from openai import OpenAI
        import json
        
        # Use valid key
        API_KEY = "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"
        BASE_URL = "https://integrate.api.nvidia.com/v1"
        
        client = OpenAI(
            base_url=BASE_URL,
            api_key=API_KEY
        )
        
        skills_focus = f"concepts related to {', '.join(request.missingSkills)}" if request.missingSkills else "core concepts"
        
        system_prompt = f"""You are a technical interview question generator. Generate a comprehensive mock test for a {request.seniority} {request.role}.
        
        CRITICAL: YOU MUST RETURN ONLY A VALID JSON OBJECT. NO MARKDOWN, NO EXPLANATIONS.
        
        The JSON structure must exactly match this schema:
        {{
          "mcqs": [
            {{
              "id": "mcq-1",
              "question": "Question text",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": 0,
              "difficulty": "easy/medium/hard",
              "skillTag": "Skill Name",
              "explanation": "Why this is correct"
            }}
          ],
          "codingQuestions": [
            {{
              "id": "coding-1",
              "question": "Problem statement",
              "difficulty": "medium",
              "skillTag": "Algorithm",
              "expectedApproach": "How to solve it",
              "sampleSolution": "Code snippet"
            }}
          ],
          "scenarioQuestions": [
            {{
              "id": "scenario-1",
              "question": "Scenario description",
              "difficulty": "hard",
              "skillTag": "System Design",
              "expectedAnswer": "Key points to cover",
              "evaluationCriteria": ["Point 1", "Point 2"]
            }}
          ]
        }}
    
        Generate:
        - 5 MCQ questions (mix of easy, medium, hard)
        - 2 coding/practical questions
        - 1 scenario/system design questions
    
        Focus on {skills_focus}. Make questions realistic and relevant.
        """
        
        # Using deepseek-ai/deepseek-v3.2 as in frontend, or qwen if that fails. 
        # Using qwen here as we know it works with this key.
        MODEL = "qwen/qwen2.5-coder-32b-instruct"
        
        messages = [
            {"role": "user", "content": system_prompt}
        ]
        
        completion = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.2,
            top_p=0.7,
            max_tokens=4096,
            stream=False
        )
        
        content = completion.choices[0].message.content
        cleaned_content = content.strip()
        
        # Cleanup markdown
        if cleaned_content.startswith("```json"):
            cleaned_content = cleaned_content[7:]
        if cleaned_content.startswith("```"):
            cleaned_content = cleaned_content[3:]
        if cleaned_content.endswith("```"):
            cleaned_content = cleaned_content[:-3]
            
        cleaned_content = cleaned_content.strip()
        
        try:
            parsed_data = json.loads(cleaned_content)
        except json.JSONDecodeError:
            logger.error(f"JSON Parse Error. Content: {cleaned_content[:500]}")
            # Try extensive cleanup if simple parse fails
            import re
            json_match = re.search(r'\{.*\}', cleaned_content, re.DOTALL)
            if json_match:
                 parsed_data = json.loads(json_match.group(0))
            else:
                 raise ValueError("Could not extract JSON from response")

        return {
            "data": {
                **parsed_data,
                "role": request.role,
                "seniority": request.seniority
            }
        }

    except Exception as e:
        logger.error(f"Error in mock-test: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Mock test generation failed: {str(e)}"
        )
