// ===================================
// Gemini AI Configuration & Service
// SECURITY NOTE: For production, use a backend proxy
// ===================================

/**
 * IMPORTANT SECURITY NOTICE:
 * -------------------------
 * This API key is exposed in client-side code which is NOT recommended for production.
 * For production deployment:
 * 1. Create a backend server (Node.js, Python, etc.)
 * 2. Store the API key as an environment variable
 * 3. Make API calls from the backend
 * 4. Add API key restrictions in Google Cloud Console
 * 
 * See: https://ai.google.dev/gemini-api/docs/api-key#security
 */

const AI_CONFIG = {
    apiKey: 'AIzaSyAYDyFvsnBecUIcokWIrY9MIhbo54sCv7g',
    model: 'gemini-2.0-flash',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    maxTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    topK: 40
};

// System prompts for different contexts
const AI_PROMPTS = {
    chatbot: `You are Hope, the AI Assistant for Jarurat Care Foundation - an NGO dedicated to supporting cancer patients and their families in India.

ABOUT JARURAT CARE:
- Founded in memory of Rekha Joshi who battled Cholangiocarcinoma (bile duct cancer)
- Tagline: "Jaisi Jarurat, Vaisi Care" (As the need, so the care)
- Co-founded by Priyanka Joshi and Ayush Anand
- Mission: Support and empower cancer patients and their families through comprehensive programs

SERVICES WE PROVIDE:
1. Patient Advocacy - Insurance assistance, legal support, healthcare navigation
2. Access to Treatment - Individual counseling, support groups, 24/7 helpline
3. Holistic Care - Nutrition counseling, stress management, wellness programs
4. Educational Resources - Workshops, patient guides, online learning
5. Community Connection - Peer mentorship, online forums
6. Cancer Connect - Connecting patients with caregivers and healthcare professionals
7. Treatment Care Think Tank - Expert team for tailored patient care
8. Hospital Locator - Finding cancer hospitals across India

IMPACT (as of 2024):
- 54 Mentors
- 28 Doctors
- 150+ Patients Assisted
- 2000+ People Reached
- 95+ Early Treatments Initiated

RESPONSE GUIDELINES:
- Be compassionate and empathetic - cancer is an emotional journey
- Provide accurate information about cancer types, symptoms, and treatments
- Never diagnose - always encourage consulting healthcare professionals
- Offer emotional support while maintaining professional boundaries
- Direct to appropriate resources (volunteer registration, seek support, donate)
- For emergencies, direct to nearest hospital or emergency services
- Be culturally sensitive to Indian context

KEY CONTACTS:
- Email: Priyanka.joshi@jarurat.care
- Website: www.jarurat.care
- Social: @jarurat.care (Instagram), @jarurat_care (Twitter)

COMMON CANCER TYPES WE SUPPORT:
- Gallbladder/Bile Duct Cancer (Cholangiocarcinoma)
- Breast Cancer
- Lung Cancer
- Oral Cancer
- Cervical Cancer
- All other cancer types

Do NOT:
- Provide medical diagnoses or prescribe medications
- Replace professional medical advice
- Make promises about treatment outcomes
- Share unverified medical information`,

    dashboardSummary: `You are an AI analytics assistant for Jarurat Care Foundation, a cancer support NGO in India. Generate concise, actionable daily summaries based on the provided data.

Focus on:
1. Patient support metrics (new requests, urgency levels)
2. Volunteer availability and matching opportunities
3. Critical cases needing immediate attention
4. Resource optimization recommendations

Keep the response empathetic yet professional, data-driven, and under 150 words. Remember this is cancer patient support - every case represents a person fighting for their life.`,

    patientAnalysis: `Analyze this cancer patient support request for Jarurat Care Foundation. Consider:
- Cancer type and stage if mentioned
- Urgency of support needed (emotional, financial, medical navigation)
- Family caregiver support needs
- Recommended support services from our offerings
- Priority level for volunteer assignment
Keep response concise and actionable, with empathy for the patient's situation.`,

    volunteerMatching: `Based on cancer patient needs and volunteer skills, suggest optimal matches for Jarurat Care Foundation. Consider:
- Medical background for treatment navigation support
- Counseling skills for emotional support
- Language/regional compatibility
- Time availability vs patient needs
- Experience with specific cancer types
Provide top 3 recommendations with reasoning focused on cancer care needs.`
};

// === Gemini AI Service Class ===
class GeminiAIService {
    constructor() {
        this.apiKey = AI_CONFIG.apiKey;
        this.model = AI_CONFIG.model;
        this.endpoint = `${AI_CONFIG.apiEndpoint}/${this.model}:generateContent`;
        this.isAvailable = true;
        this.requestCount = 0;
        this.lastRequestTime = 0;
        this.rateLimitDelay = 1000; // 1 second between requests
    }

    // Rate limiting to prevent API abuse
    async waitForRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.rateLimitDelay) {
            await new Promise(resolve => 
                setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
            );
        }
        this.lastRequestTime = Date.now();
    }

    // Main API call method
    async generateContent(prompt, systemPrompt = '', options = {}) {
        if (!this.isAvailable) {
            return { success: false, error: 'AI service temporarily unavailable' };
        }

        await this.waitForRateLimit();
        this.requestCount++;

        const requestBody = {
            contents: [{
                parts: [{
                    text: systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt
                }]
            }],
            generationConfig: {
                temperature: options.temperature || AI_CONFIG.temperature,
                topP: options.topP || AI_CONFIG.topP,
                topK: options.topK || AI_CONFIG.topK,
                maxOutputTokens: options.maxTokens || AI_CONFIG.maxTokens
            },
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
            ]
        };

        try {
            const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API Error:', errorData);
                
                if (response.status === 429) {
                    this.isAvailable = false;
                    setTimeout(() => { this.isAvailable = true; }, 60000);
                    return { success: false, error: 'Rate limit exceeded. Please try again later.' };
                }
                
                return { success: false, error: errorData.error?.message || 'API request failed' };
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                return {
                    success: true,
                    response: data.candidates[0].content.parts[0].text,
                    usage: data.usageMetadata
                };
            }

            return { success: false, error: 'No response generated' };

        } catch (error) {
            console.error('Gemini API Error:', error);
            return { success: false, error: error.message || 'Network error' };
        }
    }

    // Chat-specific method with conversation history
    async chat(message, conversationHistory = [], context = 'chatbot') {
        const systemPrompt = AI_PROMPTS[context] || AI_PROMPTS.chatbot;
        
        // Build conversation context
        let fullPrompt = message;
        if (conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-6); // Last 3 exchanges
            const historyText = recentHistory
                .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.message}`)
                .join('\n');
            fullPrompt = `Previous conversation:\n${historyText}\n\nUser: ${message}`;
        }

        return await this.generateContent(fullPrompt, systemPrompt, { temperature: 0.7 });
    }

    // Generate dashboard summary
    async generateDashboardSummary(data) {
        const prompt = `Generate a daily summary for the following healthcare platform data:

Patient Statistics:
- Total Requests: ${data.totalPatients}
- Critical Cases: ${data.criticalCases}
- High Priority: ${data.highCases}
- Medium Priority: ${data.mediumCases}
- Low Priority: ${data.lowCases}
- Pending Cases: ${data.pendingCases}

Volunteer Statistics:
- Total Volunteers: ${data.totalVolunteers}
- Available for Immediate Start: ${data.immediateVolunteers}
- Medical Background: ${data.medicalVolunteers}

Today's Activity:
- New Patient Requests: ${data.todayPatients}
- New Volunteer Registrations: ${data.todayVolunteers}

Most Requested Support: ${data.topSupport}

Provide a concise, actionable summary.`;

        return await this.generateContent(prompt, AI_PROMPTS.dashboardSummary, { temperature: 0.5 });
    }

    // Analyze patient request for prioritization
    async analyzePatientRequest(patientData) {
        const prompt = `Analyze this patient support request:

Name: ${patientData.fullName}
Age: ${patientData.age}
Medical Condition: ${patientData.medicalCondition}
Urgency Level (self-reported): ${patientData.urgencyLevel}
Support Types Requested: ${patientData.supportType?.join(', ') || 'Not specified'}
Additional Details: ${patientData.additionalDetails || 'None'}

Provide:
1. Urgency assessment (agree/escalate/de-escalate with reason)
2. Recommended priority actions
3. Suggested volunteer skill requirements`;

        return await this.generateContent(prompt, AI_PROMPTS.patientAnalysis, { temperature: 0.3 });
    }

    // Generate volunteer-patient matching suggestions
    async suggestVolunteerMatches(patients, volunteers) {
        const patientSummary = patients.slice(0, 5).map(p => 
            `- ${p.fullName} (${p.urgencyLevel}): ${p.supportType?.join(', ')}`
        ).join('\n');

        const volunteerSummary = volunteers.filter(v => v.immediateStart === 'yes').slice(0, 10).map(v =>
            `- ${v.fullName}: ${v.areasOfInterest?.join(', ')} | ${v.hoursPerWeek}hrs/week`
        ).join('\n');

        const prompt = `Match volunteers to patient needs:

PENDING PATIENTS:
${patientSummary || 'No pending patients'}

AVAILABLE VOLUNTEERS:
${volunteerSummary || 'No available volunteers'}

Suggest optimal matches with brief reasoning.`;

        return await this.generateContent(prompt, AI_PROMPTS.volunteerMatching, { temperature: 0.4 });
    }

    // Health check
    async checkAvailability() {
        try {
            const result = await this.generateContent('Hello', '', { maxTokens: 10 });
            this.isAvailable = result.success;
            return this.isAvailable;
        } catch {
            this.isAvailable = false;
            return false;
        }
    }

    // Get usage statistics
    getStats() {
        return {
            requestCount: this.requestCount,
            isAvailable: this.isAvailable,
            model: this.model
        };
    }
}

// Create singleton instance
const geminiAI = new GeminiAIService();

// Export for global use
window.geminiAI = geminiAI;
window.AI_PROMPTS = AI_PROMPTS;
window.AI_CONFIG = AI_CONFIG;

console.log('🤖 Gemini AI Service initialized');
