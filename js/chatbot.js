// ===================================
// Hope AI Chatbot - Jarurat Care Foundation
// Cancer Support Platform - Gemini AI Integration
// ===================================

// API Configuration
const CHAT_API_URL = 'http://127.0.0.1:8000/api/chat';
const USE_BACKEND = true;

// Conversation state management
const chatState = {
    conversationHistory: [],
    isTyping: false,
    currentContext: 'general',
    sessionId: null,
    fallbackMode: false,
    isOpen: false,
    isMinimized: false
};

// FAQ database for fallback responses - Cancer Support Focused
const faqDatabase = {
    greeting: {
        patterns: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'namaste'],
        response: "Hello! Welcome to Jarurat Care Foundation. 🙏 I'm Hope, your AI assistant.\n\n**\"Jaisi Jarurat, Vaisi Care\"** - As the need, so the care.\n\nWe're here to support cancer patients and their families. How can I help you today?",
        quickReplies: ['Seek Cancer Support', 'Become a Volunteer', 'Locate Hospitals', 'Donate']
    },
    services: {
        patterns: ['services', 'what do you offer', 'help available', 'what can you do', 'features', 'support', 'options'],
        response: "We offer comprehensive cancer support:\n\n• 🏥 **Patient Advocacy** - Insurance, legal & healthcare navigation\n• 💚 **Emotional Support** - Counseling, support groups, 24/7 helpline\n• 🍎 **Holistic Care** - Nutrition, stress management, wellness\n• 📚 **Educational Resources** - Workshops & patient guides\n• 🤝 **Community Connection** - Peer mentorship & forums\n• 💰 **Financial Assistance** - Treatment cost support\n\nHow would you like us to help?",
        quickReplies: ['Seek Support', 'Find a Mentor', 'Locate Hospitals']
    },
    cancer: {
        patterns: ['cancer', 'tumor', 'oncology', 'chemotherapy', 'chemo', 'radiation', 'treatment', 'diagnosis', 'diagnosed'],
        response: "We understand a cancer diagnosis can be overwhelming. 💙 You're not alone.\n\nJarurat Care Foundation provides:\n• Emotional support & counseling\n• Treatment navigation guidance\n• Connection with experienced caregivers\n• Access to our expert advisory board\n• Financial assistance programs\n\nPlease fill out our Patient Support Form, and our team will reach out within 24-48 hours.",
        quickReplies: ['Patient Form', 'Talk to Counselor', 'Find Hospitals']
    },
    patient: {
        patterns: ['patient', 'need help', 'sick', 'hospital', 'illness', 'disease', 'suffering', 'fighting'],
        response: "We're here to support you or your loved one through this journey. 💙\n\nTo get personalized support:\n1. Fill our Patient Support Form\n2. Our team reviews within 24 hours\n3. Get matched with a mentor/caregiver\n4. Access our support programs\n\n**Remember:** You're not fighting alone. Our community of cancer warriors, caregivers, and doctors is with you.",
        quickReplies: ['Fill Patient Form', 'Emergency Help', 'Call Helpline']
    },
    volunteer: {
        patterns: ['volunteer', 'help others', 'join', 'contribute', 'caregiver', 'mentor'],
        response: "Thank you for wanting to make a difference! 🌟\n\nVolunteer opportunities at Jarurat Care:\n• **Cancer Mentor** - Guide patients through their journey\n• **Caregiver** - Provide practical support\n• **Medical Professional** - Join our advisory network\n• **Community Volunteer** - Awareness & outreach\n\nYour experience, even without medical background, can bring hope to someone fighting cancer.",
        quickReplies: ['Register as Volunteer', 'Become a Mentor', 'Learn More']
    },
    emergency: {
        patterns: ['emergency', 'urgent', 'critical', 'immediate', 'dying', 'serious', 'pain'],
        response: "🚨 **For Medical Emergencies:**\n\n**Call 108 immediately** or visit the nearest hospital.\n\nFor cancer-related urgent support:\n• Email: Priyanka.joshi@jarurat.care\n• Fill urgent request form\n\nWe prioritize critical cases. Our Treatment Care Think Tank of oncologists can provide guidance within hours.",
        quickReplies: ['Call 108', 'Urgent Form', 'Locate Hospitals']
    },
    hospitals: {
        patterns: ['hospital', 'where', 'location', 'find', 'locate', 'near me', 'cancer center'],
        response: "🏥 **Find Cancer Hospitals Near You**\n\nWe maintain a directory of cancer treatment centers across India including:\n• AIIMS Delhi\n• Tata Memorial Hospital, Mumbai\n• Apollo Hospitals\n• Max Super Speciality Hospitals\n• Fortis Hospitals\n• And many more...\n\nVisit our website to use the hospital locator feature.",
        quickReplies: ['View Hospitals', 'Delhi Hospitals', 'Patient Form']
    },
    donate: {
        patterns: ['donate', 'contribution', 'give', 'help financially', 'money', 'fund'],
        response: "💝 **\"One Life at a Time\"**\n\nYour donation directly supports:\n• Treatment costs for underprivileged patients\n• Counseling and emotional support programs\n• Patient education initiatives\n• Community outreach\n\nEvery contribution, big or small, brings hope to a cancer patient.\n\n**Donate at:** www.jarurat.care/donate",
        quickReplies: ['Donate Now', 'Other Ways to Help', 'Learn More']
    },
    about: {
        patterns: ['about', 'who are you', 'jarurat care', 'organization', 'foundation', 'history'],
        response: "🏥 **About Jarurat Care Foundation**\n\nFounded in memory of **Rekha Joshi**, who bravely battled Cholangiocarcinoma (bile duct cancer).\n\n**Our Mission:** Support and empower cancer patients and families through comprehensive programs.\n\n**Our Impact:**\n• 150+ Patients Assisted\n• 54 Mentors • 28 Doctors\n• 2000+ People Reached\n\n**Founders:** Priyanka Joshi & Ayush Anand",
        quickReplies: ['Our Services', 'Join Us', 'Donate']
    },
    gallbladder: {
        patterns: ['gallbladder', 'bile duct', 'cholangiocarcinoma', 'liver'],
        response: "💙 Gallbladder and bile duct cancers (Cholangiocarcinoma) hold special significance to us - our foundation was born from this experience.\n\n**Common symptoms:**\n• Abdominal pain (upper right)\n• Jaundice (yellowing of skin/eyes)\n• Unexplained weight loss\n• Nausea and fatigue\n\n**Important:** If you notice these symptoms, consult a gastroenterologist or oncologist promptly. Early detection saves lives.",
        quickReplies: ['Seek Support', 'Find Specialist', 'Locate Hospitals']
    },
    thanks: {
        patterns: ['thank', 'thanks', 'appreciate', 'helpful', 'great', 'dhanyavaad', 'shukriya'],
        response: "You're welcome! 🙏 It's our privilege to support you.\n\n**\"Jaisi Jarurat, Vaisi Care\"**\n\nRemember, you're never alone in this journey. Our community of cancer warriors, caregivers, and medical experts is always here.\n\nIs there anything else I can help with?",
        quickReplies: ['More Questions', 'Patient Form', 'Goodbye']
    },
    goodbye: {
        patterns: ['bye', 'goodbye', 'see you', 'take care', 'exit', 'close', 'alvida'],
        response: "Take care! 🙏 Stay strong, stay hopeful.\n\n**\"You're not alone in this fight.\"**\n\n📧 Priyanka.joshi@jarurat.care\n🌐 www.jarurat.care\n\nWishing you strength and healing. 💙",
        quickReplies: ['Start New Chat', 'Patient Form', 'Volunteer Form']
    },
    default: {
        response: "I want to make sure I help you properly. 💙\n\nYou can ask me about:\n• Cancer patient support services\n• Volunteer & mentor opportunities\n• Hospital locations\n• Treatment guidance\n• Donation options\n\nOr email us directly at **Priyanka.joshi@jarurat.care**",
        quickReplies: ['Cancer Support', 'Volunteer', 'Locate Hospitals', 'Donate']
    }
};

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeChatbot();
        console.log('💬 Hope AI Chatbot initialized');
    }, 100);
});

function initializeChatbot() {
    // Check if chatbot already exists in HTML, if not inject it
    let chatContainer = document.querySelector('.chatbot-container');
    let chatToggle = document.querySelector('.chatbot-toggle');
    
    if (!chatContainer || !chatToggle) {
        injectChatbotHTML();
        chatContainer = document.querySelector('.chatbot-container');
        chatToggle = document.querySelector('.chatbot-toggle');
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Generate session ID
    chatState.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function injectChatbotHTML() {
    // Remove any existing chatbot elements
    const existing = document.querySelectorAll('.chatbot-wrapper, .chatbot-container, .chatbot-toggle');
    existing.forEach(el => el.remove());
    
    const chatbotHTML = `
        <div class="chatbot-wrapper">
            <button class="chatbot-toggle" id="chatbotToggle" aria-label="Open Hope AI Assistant" tabindex="0">
                <i class="fas fa-comments"></i>
                <span class="chatbot-badge" style="display: none;">1</span>
            </button>
            
            <div class="chatbot-container" id="chatbotContainer" role="dialog" aria-label="Hope AI Chat Assistant">
                <div class="chatbot-header" id="chatbotHeader">
                    <div class="chatbot-avatar">
                        <i class="fas fa-ribbon"></i>
                    </div>
                    <div class="chatbot-info">
                        <h4>Hope - AI Assistant</h4>
                        <span class="chatbot-status">
                            <span class="status-dot"></span>
                            <span id="ai-status">Online • Jarurat Care</span>
                        </span>
                    </div>
                    <div class="chatbot-controls">
                        <button class="chatbot-btn chatbot-minimize" id="chatbotMinimize" aria-label="Minimize chat" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="chatbot-btn chatbot-maximize" id="chatbotMaximize" aria-label="Maximize chat" title="Maximize" style="display: none;">
                            <i class="fas fa-expand"></i>
                        </button>
                        <button class="chatbot-btn chatbot-close" id="chatbotClose" aria-label="Close chat" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite">
                    <!-- Messages will be dynamically added here -->
                </div>
                
                <div class="chatbot-input" id="chatbotInputArea">
                    <input type="text" id="chatInput" placeholder="Type your message..." aria-label="Chat message input" autocomplete="off" />
                    <button class="chatbot-send" id="chatSend" aria-label="Send message" title="Send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
}

function setupEventListeners() {
    // Toggle button - open/close chatbot
    const toggleBtn = document.getElementById('chatbotToggle');
    if (toggleBtn) {
        toggleBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleChatbot();
        };
    }

    // Close button
    const closeBtn = document.getElementById('chatbotClose');
    if (closeBtn) {
        closeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeChatbot();
        };
    }

    // Minimize button
    const minimizeBtn = document.getElementById('chatbotMinimize');
    if (minimizeBtn) {
        minimizeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            minimizeChatbot();
        };
    }

    // Maximize button (shown when minimized)
    const maximizeBtn = document.getElementById('chatbotMaximize');
    if (maximizeBtn) {
        maximizeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            maximizeChatbot();
        };
    }

    // Header click to maximize when minimized
    const header = document.getElementById('chatbotHeader');
    if (header) {
        header.onclick = function(e) {
            // Only maximize if clicking on header area (not buttons)
            if (!e.target.closest('.chatbot-btn') && chatState.isMinimized) {
                e.preventDefault();
                maximizeChatbot();
            }
        };
    }

    // Send button
    const sendBtn = document.getElementById('chatSend');
    if (sendBtn) {
        sendBtn.onclick = function(e) {
            e.preventDefault();
            sendMessage();
        };
    }

    // Input field - Enter to send
    const input = document.getElementById('chatInput');
    if (input) {
        input.onkeypress = function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        };
    }

    // Quick reply delegation - use event delegation for dynamically added buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-reply-btn')) {
            e.preventDefault();
            e.stopPropagation();
            handleQuickReply(e.target.textContent.trim());
        }
    });

    console.log('✅ All chatbot event listeners attached');
}

function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    const toggle = document.getElementById('chatbotToggle');
    const badge = document.querySelector('.chatbot-badge');
    
    if (!container) {
        console.error('Chatbot container not found');
        return;
    }
    
    chatState.isOpen = !chatState.isOpen;
    
    if (chatState.isOpen) {
        container.classList.add('show');
        container.classList.remove('minimized');
        container.style.display = 'flex';
        chatState.isMinimized = false;
        
        if (toggle) toggle.classList.add('active');
        if (badge) badge.style.display = 'none';
        
        // Update button visibility
        updateControlButtons();
        
        // Show welcome message if first time
        if (chatState.conversationHistory.length === 0) {
            setTimeout(showWelcomeMessage, 300);
        }
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 350);
    } else {
        container.classList.remove('show');
        container.classList.remove('minimized');
        chatState.isMinimized = false;
        if (toggle) toggle.classList.remove('active');
    }
    
    console.log('🔄 Chatbot toggled:', chatState.isOpen ? 'open' : 'closed');
}

function closeChatbot() {
    const container = document.getElementById('chatbotContainer');
    const toggle = document.getElementById('chatbotToggle');
    
    chatState.isOpen = false;
    chatState.isMinimized = false;
    
    if (container) {
        container.classList.remove('show');
        container.classList.remove('minimized');
        container.style.display = 'none';
    }
    if (toggle) {
        toggle.classList.remove('active');
    }
    
    console.log('❌ Chatbot closed');
}

function minimizeChatbot() {
    const container = document.getElementById('chatbotContainer');
    
    if (!container) return;
    
    chatState.isMinimized = true;
    container.classList.add('minimized');
    
    // Update button visibility
    updateControlButtons();
    
    console.log('➖ Chatbot minimized');
}

function maximizeChatbot() {
    const container = document.getElementById('chatbotContainer');
    
    if (!container) return;
    
    chatState.isMinimized = false;
    container.classList.remove('minimized');
    
    // Update button visibility
    updateControlButtons();
    
    // Focus input
    setTimeout(() => {
        const input = document.getElementById('chatInput');
        if (input) input.focus();
    }, 100);
    
    console.log('➕ Chatbot maximized');
}

function updateControlButtons() {
    const minimizeBtn = document.getElementById('chatbotMinimize');
    const maximizeBtn = document.getElementById('chatbotMaximize');
    
    if (chatState.isMinimized) {
        if (minimizeBtn) minimizeBtn.style.display = 'none';
        if (maximizeBtn) maximizeBtn.style.display = 'flex';
    } else {
        if (minimizeBtn) minimizeBtn.style.display = 'flex';
        if (maximizeBtn) maximizeBtn.style.display = 'none';
    }
}

function openChatbot() {
    if (!chatState.isOpen) {
        toggleChatbot();
    }
}

function showWelcomeMessage() {
    const welcomeMsg = `## 👋 Welcome to Jarurat Care!

I'm **Hope**, your AI assistant.

**"Jaisi Jarurat, Vaisi Care"** - As the need, so the care.

We support cancer patients and their families through:
- 🏥 Patient Advocacy & Treatment Navigation
- 💚 Emotional Support & Counseling
- 🤝 Community Connection & Mentorship
- 💰 Financial Assistance Programs

**How can I help you today?**`;
    
    addMessage(welcomeMsg, 'bot', ['Seek Cancer Support', 'Become a Volunteer', 'Locate Hospitals', 'Donate']);
}

function addMessage(text, sender = 'user', quickReplies = []) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) {
        console.error('Messages container not found');
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    // Parse markdown-like formatting
    const formattedText = formatMessage(text);
    
    const avatarIcon = sender === 'bot' ? 'fa-ribbon' : 'fa-user';
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${avatarIcon}"></i>
        </div>
        <div class="message-bubble">
            <div class="message-content">${formattedText}</div>
            <div class="message-time">${timestamp}</div>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);

    // Add quick replies if provided
    if (quickReplies.length > 0 && sender === 'bot') {
        addQuickReplies(quickReplies);
    }

    // Scroll to bottom smoothly
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
    });

    // Store in conversation history
    chatState.conversationHistory.push({
        sender: sender,
        message: text,
        timestamp: Date.now()
    });
}

function formatMessage(text) {
    let formatted = text
        // Headers
        .replace(/^## (.*?)$/gm, '<h4 class="msg-header">$1</h4>')
        .replace(/^### (.*?)$/gm, '<h5 class="msg-subheader">$1</h5>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n/g, '<br>')
        // Bullet points
        .replace(/• /g, '<span class="bullet">•</span> ')
        .replace(/- /g, '<span class="bullet">•</span> ')
        // Numbered lists (1. 2. 3.)
        .replace(/^(\d+)\. /gm, '<span class="number">$1.</span> ');
    
    return formatted;
}

function addQuickReplies(replies) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer || replies.length === 0) return;

    // Remove existing quick replies
    const existing = messagesContainer.querySelectorAll('.quick-replies');
    existing.forEach(el => el.remove());

    const quickRepliesDiv = document.createElement('div');
    quickRepliesDiv.className = 'quick-replies';
    
    replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = reply;
        btn.type = 'button';
        quickRepliesDiv.appendChild(btn);
    });

    messagesContainer.appendChild(quickRepliesDiv);
    
    // Scroll to show quick replies
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
    });
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer || chatState.isTyping) return;

    chatState.isTyping = true;

    // Remove existing quick replies while typing
    const quickReplies = messagesContainer.querySelectorAll('.quick-replies');
    quickReplies.forEach(el => el.remove());

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-ribbon"></i>
        </div>
        <div class="message-bubble">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
    });
}

function hideTypingIndicator() {
    chatState.isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    // Clear input immediately
    input.value = '';

    // Remove existing quick replies
    const existingQuickReplies = document.querySelectorAll('.quick-replies');
    existingQuickReplies.forEach(el => el.remove());

    // Add user message
    addMessage(message, 'user');

    // Show typing indicator
    showTypingIndicator();

    // Update status
    updateStatus('Thinking...');

    // Process message
    await processMessage(message);
}

function updateStatus(status) {
    const statusEl = document.getElementById('ai-status');
    if (statusEl) {
        statusEl.textContent = status;
    }
}

async function processMessage(message) {
    let response;
    let quickReplies = [];

    try {
        // Try backend API first if enabled
        if (USE_BACKEND) {
            try {
                console.log('📡 Sending to backend API...');
                const apiResponse = await fetch(CHAT_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        sessionId: chatState.sessionId
                    })
                });

                if (apiResponse.ok) {
                    const data = await apiResponse.json();
                    hideTypingIndicator();
                    updateStatus('Online • Jarurat Care');
                    chatState.sessionId = data.sessionId;
                    
                    // Format the response for better structure
                    const formattedResponse = formatAIResponse(data.response);
                    addMessage(formattedResponse, 'bot', data.quickReplies || getContextualQuickReplies(message));
                    console.log('✅ Backend response received');
                    return;
                } else {
                    console.warn('Backend returned error:', apiResponse.status);
                }
            } catch (apiError) {
                console.warn('⚠️ Backend API unavailable:', apiError.message);
                updateStatus('Connecting...');
            }
        }

        // Try direct Gemini AI if available (via ai-service.js)
        if (window.geminiAI && !chatState.fallbackMode) {
            try {
                console.log('🤖 Trying direct Gemini AI...');
                const aiResult = await window.geminiAI.chat(
                    message, 
                    chatState.conversationHistory.slice(-6),
                    'chatbot'
                );

                if (aiResult.success) {
                    hideTypingIndicator();
                    updateStatus('Online • AI');
                    const formattedResponse = formatAIResponse(aiResult.response);
                    addMessage(formattedResponse, 'bot', getContextualQuickReplies(message));
                    console.log('✅ Direct Gemini response received');
                    return;
                } else {
                    console.warn('Gemini AI failed, using FAQ fallback');
                    chatState.fallbackMode = true;
                    setTimeout(() => { chatState.fallbackMode = false; }, 60000);
                }
            } catch (aiError) {
                console.warn('Direct Gemini error:', aiError.message);
            }
        }

        // Final fallback to pattern matching
        console.log('📚 Using FAQ fallback...');
        const fallbackResponse = getFallbackResponse(message);
        hideTypingIndicator();
        updateStatus('Online • Offline Mode');
        addMessage(fallbackResponse.response, 'bot', fallbackResponse.quickReplies);

    } catch (error) {
        console.error('❌ Chat error:', error);
        hideTypingIndicator();
        updateStatus('Error');
        addMessage("I apologize, but I'm having trouble processing your request. Please try again or contact us at **Priyanka.joshi@jarurat.care**", 'bot', ['Try Again', 'Contact Us']);
    }
}

function formatAIResponse(response) {
    // Check if response already has formatting
    if (response.includes('**') || response.includes('##') || response.includes('•')) {
        return response;
    }
    
    // Add structure to plain text responses
    let formatted = response;
    
    // Convert sentences ending with : to bold headers
    formatted = formatted.replace(/^([^:\n]{10,50}):(\s)/gm, '**$1:**$2');
    
    // Convert numbered items to proper format
    formatted = formatted.replace(/(\d)\)/g, '$1.');
    
    // Add bullet points where appropriate
    formatted = formatted.replace(/^[-•]\s*/gm, '• ');
    
    return formatted;
}

function getContextualQuickReplies(message) {
    const lower = message.toLowerCase();
    
    if (lower.includes('patient') || lower.includes('help') || lower.includes('support') || lower.includes('cancer')) {
        return ['Fill Patient Form', 'Our Services', 'Emergency Help'];
    }
    if (lower.includes('volunteer') || lower.includes('join') || lower.includes('contribute')) {
        return ['Register Now', 'Learn More', 'Contact Team'];
    }
    if (lower.includes('emergency') || lower.includes('urgent') || lower.includes('critical')) {
        return ['Call 108', 'Urgent Form', 'Locate Hospitals'];
    }
    if (lower.includes('thank') || lower.includes('great') || lower.includes('helpful')) {
        return ['More Questions', 'Patient Form', 'Goodbye'];
    }
    if (lower.includes('donate') || lower.includes('give') || lower.includes('contribution')) {
        return ['Donate Now', 'Other Ways to Help', 'Our Impact'];
    }
    if (lower.includes('hospital') || lower.includes('doctor') || lower.includes('treatment')) {
        return ['Locate Hospitals', 'Find Specialist', 'Patient Form'];
    }
    
    return ['Cancer Support', 'Volunteer', 'Contact Us'];
}

function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    for (const [category, data] of Object.entries(faqDatabase)) {
        if (category === 'default') continue;
        
        if (data.patterns && data.patterns.some(pattern => lowerMessage.includes(pattern))) {
            return {
                response: data.response,
                quickReplies: data.quickReplies || []
            };
        }
    }

    return {
        response: faqDatabase.default.response,
        quickReplies: faqDatabase.default.quickReplies
    };
}

function handleQuickReply(text) {
    const navigationMap = {
        'Patient Form': 'patient-form.html',
        'Fill Patient Form': 'patient-form.html',
        'Seek Cancer Support': 'patient-form.html',
        'Urgent Form': 'patient-form.html',
        'Register as Volunteer': 'volunteer-form.html',
        'Become a Volunteer': 'volunteer-form.html',
        'Register Now': 'volunteer-form.html',
        'Volunteer Form': 'volunteer-form.html',
        'Contact Us': 'contact.html',
        'Contact Team': 'contact.html',
        'View Dashboard': 'dashboard.html',
        'Call 108': 'tel:108',
        'Call Helpline': 'tel:+919876543210',
        'Donate Now': 'https://www.jarurat.care/donate',
        'Donate': 'https://www.jarurat.care/donate',
        'Locate Hospitals': 'https://www.jarurat.care/hospitals',
        'View Hospitals': 'https://www.jarurat.care/hospitals',
        'Start New Chat': 'clear_chat',
        'Goodbye': 'close_chat',
        'Try Again': 'retry'
    };

    const destination = navigationMap[text];
    
    if (destination === 'clear_chat') {
        clearChat();
        return;
    }
    
    if (destination === 'close_chat') {
        addMessage('Goodbye! Take care and stay strong! 🙏💙', 'bot');
        setTimeout(closeChatbot, 2000);
        return;
    }
    
    if (destination === 'retry') {
        const input = document.getElementById('chatInput');
        if (input) input.focus();
        return;
    }
    
    if (destination && (destination.startsWith('http') || destination.startsWith('tel:'))) {
        window.open(destination, '_blank');
        return;
    }
    
    if (destination && destination.endsWith('.html')) {
        window.location.href = destination;
        return;
    }

    // If no navigation, treat as a message to send
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = text;
        sendMessage();
    }
}

function clearChat() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
    }
    chatState.conversationHistory = [];
    chatState.fallbackMode = false;
    chatState.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    showWelcomeMessage();
}

// Export for global use
window.toggleChatbot = toggleChatbot;
window.closeChatbot = closeChatbot;
window.openChatbot = openChatbot;
window.minimizeChatbot = minimizeChatbot;
window.maximizeChatbot = maximizeChatbot;
window.sendChatMessage = sendMessage;
window.clearChat = clearChat;
window.handleChatKeyPress = function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
};
window.sendQuickReply = function(text) {
    handleQuickReply(text);
};

console.log('🎯 Hope AI Chatbot script loaded');
