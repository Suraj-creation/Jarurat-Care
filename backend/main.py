"""
Jarurat Care Foundation - FastAPI Backend
Cancer Support Platform API with Gemini AI Integration
"""

import os
import json
import uuid
import httpx
from datetime import datetime, timedelta
from typing import List, Optional, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field, field_validator
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ===================================
# Configuration
# ===================================
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

# In-memory storage (simulates database)
storage = {
    "patients": [],
    "volunteers": [],
    "contacts": [],
    "chat_sessions": {}
}

# ===================================
# Pydantic Models
# ===================================

class PatientRequest(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=0, le=120)
    gender: str = Field(..., pattern="^(male|female|other)$")
    contactNumber: str = Field(..., pattern="^[6-9][0-9]{9}$")
    email: Optional[EmailStr] = None
    address: str = Field(..., min_length=10, max_length=500)
    cancerType: Optional[str] = None
    cancerStage: Optional[str] = None
    medicalCondition: str = Field(..., min_length=10, max_length=2000)
    urgencyLevel: str = Field(..., pattern="^(critical|high|medium|low)$")
    currentMedications: Optional[str] = Field(None, max_length=1000)
    allergies: Optional[str] = Field(None, max_length=500)
    preferredHospital: Optional[str] = Field(None, max_length=200)
    supportType: List[str]
    additionalDetails: Optional[str] = Field(None, max_length=2000)
    insuranceInfo: Optional[str] = Field(None, max_length=500)
    consent: bool = True
    
    @field_validator('supportType')
    @classmethod
    def validate_support_type(cls, v):
        valid_types = [
            'emotional-support', 'financial-aid', 'treatment-navigation',
            'peer-mentorship', 'nutrition-counseling', 'medical-consultation',
            'home-care', 'ambulance', 'medicine'
        ]
        for item in v:
            if item not in valid_types:
                raise ValueError(f"Invalid support type: {item}")
        return v


class VolunteerRequest(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    contactNumber: str = Field(..., pattern="^[6-9][0-9]{9}$")
    dateOfBirth: str
    gender: str = Field(..., pattern="^(male|female|other)$")
    address: str = Field(..., min_length=10, max_length=500)
    occupation: str = Field(..., max_length=100)
    qualification: str = Field(..., max_length=100)
    isMedicalProfessional: bool = False
    medicalLicense: Optional[str] = None
    experience: Optional[str] = Field(None, max_length=1000)
    skills: Optional[List[str]] = []
    languages: Optional[List[str]] = []
    daysAvailable: List[str]
    timeSlots: List[str]
    areasOfInterest: List[str]
    emergencyContact: str = Field(..., min_length=2, max_length=100)
    emergencyPhone: str = Field(..., pattern="^[6-9][0-9]{9}$")
    motivation: Optional[str] = Field(None, max_length=2000)
    consent: bool = True


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, pattern="^[6-9][0-9]{9}$")
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    inquiryType: str = Field(..., pattern="^(general|patient|volunteer|partnership|other)$")


class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    sessionId: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    sessionId: str
    quickReplies: List[str] = []


# ===================================
# AI System Prompts
# ===================================

CHATBOT_SYSTEM_PROMPT = """You are Hope, the AI Assistant for Jarurat Care Foundation - an NGO dedicated to supporting cancer patients and their families in India.

ABOUT JARURAT CARE:
- Founded in memory of Rekha Joshi who battled Cholangiocarcinoma (bile duct cancer)
- Tagline: "Jaisi Jarurat, Vaisi Care" (As the need, so the care)
- Co-founded by Priyanka Joshi and Ayush Anand
- Mission: Support and empower cancer patients and their families

SERVICES WE PROVIDE:
1. Patient Advocacy - Insurance assistance, legal support, healthcare navigation
2. Emotional Support - Individual counseling, support groups, 24/7 helpline
3. Holistic Care - Nutrition counseling, stress management, wellness programs
4. Educational Resources - Workshops, patient guides, online learning
5. Community Connection - Peer mentorship, online forums
6. Treatment Navigation - Connecting with oncologists and hospitals

IMPACT:
- 54+ Mentors, 28+ Doctors, 150+ Patients Assisted, 2000+ People Reached

RESPONSE GUIDELINES:
- Be compassionate and empathetic - cancer is an emotional journey
- Keep responses concise but helpful (under 150 words)
- Never diagnose - always encourage consulting healthcare professionals
- Direct to appropriate resources (patient form, volunteer registration, donate)
- For emergencies, direct to nearest hospital or call 108

KEY CONTACTS:
- Email: Priyanka.joshi@jarurat.care
- Website: www.jarurat.care

CANCER TYPES WE SUPPORT:
- Gallbladder/Bile Duct Cancer (Cholangiocarcinoma) - Special focus
- Breast, Lung, Oral, Cervical Cancer and all others

Do NOT provide medical diagnoses or prescribe medications."""


DASHBOARD_SYSTEM_PROMPT = """You are an AI analytics assistant for Jarurat Care Foundation, a cancer support NGO. 
Generate concise, actionable insights based on patient and volunteer data.
Focus on: urgent cases, resource gaps, volunteer matching opportunities.
Keep response under 100 words. Be empathetic yet professional."""


# ===================================
# Helper Functions
# ===================================

def generate_id(prefix: str = "JC") -> str:
    """Generate unique ID with prefix"""
    timestamp = datetime.now().strftime("%Y%m%d")
    unique = uuid.uuid4().hex[:6].upper()
    return f"{prefix}-{timestamp}-{unique}"


def calculate_response_time(urgency: str) -> str:
    """Calculate estimated response time based on urgency"""
    response_times = {
        "critical": "2-4 hours",
        "high": "12-24 hours", 
        "medium": "24-48 hours",
        "low": "3-5 business days"
    }
    return response_times.get(urgency, "24-48 hours")


async def call_gemini_api(prompt: str, system_prompt: str) -> str:
    """Call Gemini AI API"""
    if not GEMINI_API_KEY:
        return "AI service temporarily unavailable. Please try again later."
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{GEMINI_ENDPOINT}?key={GEMINI_API_KEY}",
                json={
                    "contents": [{
                        "parts": [{
                            "text": f"{system_prompt}\n\nUser: {prompt}"
                        }]
                    }],
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 500,
                        "topP": 0.9,
                        "topK": 40
                    }
                },
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and len(data["candidates"]) > 0:
                    return data["candidates"][0]["content"]["parts"][0]["text"]
            
            return "I apologize, but I'm having trouble responding right now. Please try again or contact us at Priyanka.joshi@jarurat.care"
            
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "I'm experiencing technical difficulties. For immediate assistance, please email Priyanka.joshi@jarurat.care or call our helpline."


def get_quick_replies(message: str) -> List[str]:
    """Generate contextual quick replies"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'start']):
        return ['Cancer Support', 'Become a Volunteer', 'Locate Hospitals', 'Donate']
    elif any(word in message_lower for word in ['cancer', 'diagnosis', 'treatment']):
        return ['Patient Form', 'Find a Mentor', 'Locate Hospitals']
    elif any(word in message_lower for word in ['volunteer', 'help others', 'join']):
        return ['Register as Volunteer', 'Learn More', 'Contact Us']
    elif any(word in message_lower for word in ['emergency', 'urgent', 'critical']):
        return ['Call 108', 'Urgent Support', 'Locate Hospitals']
    elif any(word in message_lower for word in ['donate', 'contribute', 'fund']):
        return ['Donate Now', 'Other Ways to Help', 'Our Impact']
    else:
        return ['Cancer Support', 'Volunteer', 'Donate', 'Contact Us']


# ===================================
# Application Setup
# ===================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    print("🚀 Starting Jarurat Care API Server...")
    print(f"📡 Gemini AI: {'Connected' if GEMINI_API_KEY else 'Not Configured'}")
    yield
    print("👋 Shutting down Jarurat Care API Server...")


app = FastAPI(
    title="Jarurat Care Foundation API",
    description="Cancer Support Platform - Backend API with Gemini AI",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:8080").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===================================
# API Endpoints
# ===================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Jarurat Care Foundation API",
        "version": "1.0.0",
        "ai_status": "connected" if GEMINI_API_KEY else "not_configured"
    }


@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "storage": {
            "patients": len(storage["patients"]),
            "volunteers": len(storage["volunteers"]),
            "contacts": len(storage["contacts"])
        },
        "ai_available": bool(GEMINI_API_KEY)
    }


# === Patient Endpoints ===

@app.post("/api/patients", status_code=status.HTTP_201_CREATED)
async def submit_patient_request(patient: PatientRequest):
    """Submit a new patient support request"""
    patient_data = patient.model_dump()
    patient_data["id"] = generate_id("PAT")
    patient_data["timestamp"] = datetime.now().isoformat()
    patient_data["status"] = "Pending"
    patient_data["responseTime"] = calculate_response_time(patient.urgencyLevel)
    
    storage["patients"].append(patient_data)
    
    return {
        "success": True,
        "message": "Patient support request submitted successfully",
        "data": {
            "id": patient_data["id"],
            "responseTime": patient_data["responseTime"],
            "status": patient_data["status"]
        }
    }


@app.get("/api/patients")
async def get_patients(
    urgency: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50
):
    """Get all patient requests with optional filtering"""
    patients = storage["patients"]
    
    if urgency:
        patients = [p for p in patients if p.get("urgencyLevel") == urgency]
    if status:
        patients = [p for p in patients if p.get("status") == status]
    
    # Sort by timestamp (newest first)
    patients = sorted(patients, key=lambda x: x.get("timestamp", ""), reverse=True)
    
    return {
        "success": True,
        "count": len(patients[:limit]),
        "data": patients[:limit]
    }


@app.get("/api/patients/{patient_id}")
async def get_patient(patient_id: str):
    """Get a specific patient by ID"""
    patient = next((p for p in storage["patients"] if p["id"] == patient_id), None)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"success": True, "data": patient}


# === Volunteer Endpoints ===

@app.post("/api/volunteers", status_code=status.HTTP_201_CREATED)
async def register_volunteer(volunteer: VolunteerRequest):
    """Register a new volunteer"""
    volunteer_data = volunteer.model_dump()
    volunteer_data["id"] = generate_id("VOL")
    volunteer_data["timestamp"] = datetime.now().isoformat()
    volunteer_data["status"] = "Pending Review"
    
    storage["volunteers"].append(volunteer_data)
    
    return {
        "success": True,
        "message": "Volunteer registration submitted successfully",
        "data": {
            "id": volunteer_data["id"],
            "status": volunteer_data["status"]
        }
    }


@app.get("/api/volunteers")
async def get_volunteers(
    status: Optional[str] = None,
    skill: Optional[str] = None,
    limit: int = 50
):
    """Get all volunteers with optional filtering"""
    volunteers = storage["volunteers"]
    
    if status:
        volunteers = [v for v in volunteers if v.get("status") == status]
    if skill:
        volunteers = [v for v in volunteers if skill in v.get("skills", [])]
    
    volunteers = sorted(volunteers, key=lambda x: x.get("timestamp", ""), reverse=True)
    
    return {
        "success": True,
        "count": len(volunteers[:limit]),
        "data": volunteers[:limit]
    }


# === Contact Endpoints ===

@app.post("/api/contacts", status_code=status.HTTP_201_CREATED)
async def submit_contact(contact: ContactRequest):
    """Submit a contact form"""
    contact_data = contact.model_dump()
    contact_data["id"] = generate_id("MSG")
    contact_data["timestamp"] = datetime.now().isoformat()
    contact_data["status"] = "Pending"
    
    storage["contacts"].append(contact_data)
    
    return {
        "success": True,
        "message": "Message received. We'll respond shortly.",
        "data": {"id": contact_data["id"]}
    }


@app.get("/api/contacts")
async def get_contacts(limit: int = 50):
    """Get all contact messages"""
    contacts = sorted(
        storage["contacts"],
        key=lambda x: x.get("timestamp", ""),
        reverse=True
    )
    return {
        "success": True,
        "count": len(contacts[:limit]),
        "data": contacts[:limit]
    }


# === Chat/AI Endpoints ===

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_hope(chat: ChatMessage):
    """Chat with Hope AI Assistant"""
    session_id = chat.sessionId or str(uuid.uuid4())
    
    # Initialize or get session history
    if session_id not in storage["chat_sessions"]:
        storage["chat_sessions"][session_id] = []
    
    # Add user message to history
    storage["chat_sessions"][session_id].append({
        "role": "user",
        "content": chat.message,
        "timestamp": datetime.now().isoformat()
    })
    
    # Get AI response
    ai_response = await call_gemini_api(chat.message, CHATBOT_SYSTEM_PROMPT)
    
    # Add AI response to history
    storage["chat_sessions"][session_id].append({
        "role": "assistant",
        "content": ai_response,
        "timestamp": datetime.now().isoformat()
    })
    
    # Get contextual quick replies
    quick_replies = get_quick_replies(chat.message)
    
    return ChatResponse(
        response=ai_response,
        sessionId=session_id,
        quickReplies=quick_replies
    )


@app.post("/api/ai/insights")
async def generate_ai_insights():
    """Generate AI insights for dashboard"""
    patients = storage["patients"]
    volunteers = storage["volunteers"]
    
    if not patients and not volunteers:
        return {
            "success": True,
            "insights": "No data available yet. Insights will be generated once patient requests and volunteers are registered."
        }
    
    # Prepare summary for AI
    summary = f"""
    Current Data Summary:
    - Total Patients: {len(patients)}
    - Critical Cases: {len([p for p in patients if p.get('urgencyLevel') == 'critical'])}
    - High Priority: {len([p for p in patients if p.get('urgencyLevel') == 'high'])}
    - Total Volunteers: {len(volunteers)}
    - Pending Patients: {len([p for p in patients if p.get('status') == 'Pending'])}
    
    Generate actionable insights for today.
    """
    
    insights = await call_gemini_api(summary, DASHBOARD_SYSTEM_PROMPT)
    
    return {
        "success": True,
        "insights": insights,
        "generated_at": datetime.now().isoformat()
    }


# === Dashboard/Stats Endpoints ===

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    patients = storage["patients"]
    volunteers = storage["volunteers"]
    contacts = storage["contacts"]
    
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)
    
    # Calculate stats
    critical_cases = len([p for p in patients if p.get("urgencyLevel") == "critical"])
    today_patients = len([p for p in patients if datetime.fromisoformat(p.get("timestamp", "2000-01-01")).date() == today])
    week_patients = len([p for p in patients if datetime.fromisoformat(p.get("timestamp", "2000-01-01")).date() >= week_ago])
    
    # Cancer type distribution
    cancer_types = {}
    for p in patients:
        ct = p.get("cancerType", "Not Specified")
        cancer_types[ct] = cancer_types.get(ct, 0) + 1
    
    # Urgency distribution
    urgency_dist = {"critical": 0, "high": 0, "medium": 0, "low": 0}
    for p in patients:
        urgency = p.get("urgencyLevel", "medium")
        urgency_dist[urgency] = urgency_dist.get(urgency, 0) + 1
    
    # Support type distribution
    support_dist = {}
    for p in patients:
        for st in p.get("supportType", []):
            support_dist[st] = support_dist.get(st, 0) + 1
    
    return {
        "success": True,
        "stats": {
            "totalPatients": len(patients),
            "totalVolunteers": len(volunteers),
            "totalContacts": len(contacts),
            "criticalCases": critical_cases,
            "todayPatients": today_patients,
            "weekPatients": week_patients,
            "pendingPatients": len([p for p in patients if p.get("status") == "Pending"])
        },
        "distributions": {
            "urgency": urgency_dist,
            "cancerTypes": cancer_types,
            "supportTypes": support_dist
        }
    }


@app.get("/api/dashboard/export")
async def export_data(format: str = "json"):
    """Export all data as JSON"""
    return {
        "success": True,
        "exported_at": datetime.now().isoformat(),
        "data": {
            "patients": storage["patients"],
            "volunteers": storage["volunteers"],
            "contacts": storage["contacts"]
        }
    }


# ===================================
# Run Server
# ===================================

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    print(f"🏥 Starting Jarurat Care API at http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=debug)
