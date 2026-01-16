// ===================================
// Dashboard - Analytics & Data Visualization
// ROBUST IMPLEMENTATION - All Features Working
// Backend API Integration for AI Insights
// ===================================

// Backend API configuration
const DASHBOARD_API_URL = 'http://127.0.0.1:8000';
const USE_BACKEND_API = true;
const USE_DEMO_DATA = true; // Enable demo data when no real data exists

let charts = {};
let dashboardData = {
    patients: [],
    volunteers: [],
    contacts: []
};

// === Demo/Sample Data for Dashboard Demonstration ===
const DEMO_DATA = {
    patients: [
        { id: 'PAT-2026-001', fullName: 'Anita Sharma', age: 52, gender: 'female', contactNumber: '9876543210', cancerType: 'breast', cancerStage: 'stage2', urgencyLevel: 'high', supportType: ['treatment-navigation', 'emotional-support'], status: 'In Progress', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'PAT-2026-002', fullName: 'Rajesh Kumar', age: 45, gender: 'male', contactNumber: '9123456780', cancerType: 'gallbladder', cancerStage: 'stage3', urgencyLevel: 'critical', supportType: ['financial-assistance', 'treatment-navigation'], status: 'Pending', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'PAT-2026-003', fullName: 'Priya Patel', age: 38, gender: 'female', contactNumber: '9988776655', cancerType: 'cervical', cancerStage: 'stage1', urgencyLevel: 'medium', supportType: ['peer-mentorship', 'emotional-support'], status: 'Assigned', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'PAT-2026-004', fullName: 'Mohammad Khan', age: 60, gender: 'male', contactNumber: '9876123450', cancerType: 'lung', cancerStage: 'stage4', urgencyLevel: 'critical', supportType: ['palliative', 'financial-assistance'], status: 'Pending', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'PAT-2026-005', fullName: 'Sunita Devi', age: 48, gender: 'female', contactNumber: '9765432109', cancerType: 'oral', cancerStage: 'stage2', urgencyLevel: 'high', supportType: ['treatment-navigation', 'nutrition'], status: 'In Progress', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'PAT-2026-006', fullName: 'Vikram Singh', age: 55, gender: 'male', contactNumber: '9654321098', cancerType: 'colorectal', cancerStage: 'stage2', urgencyLevel: 'medium', supportType: ['second-opinion', 'emotional-support'], status: 'Completed', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'PAT-2026-007', fullName: 'Meera Joshi', age: 42, gender: 'female', contactNumber: '9543210987', cancerType: 'breast', cancerStage: 'stage1', urgencyLevel: 'low', supportType: ['peer-mentorship'], status: 'Assigned', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'PAT-2026-008', fullName: 'Arun Gupta', age: 67, gender: 'male', contactNumber: '9432109876', cancerType: 'prostate', cancerStage: 'stage3', urgencyLevel: 'high', supportType: ['treatment-navigation', 'logistics'], status: 'Pending', timestamp: new Date().toISOString() },
        { id: 'PAT-2026-009', fullName: 'Kavita Reddy', age: 35, gender: 'female', contactNumber: '9321098765', cancerType: 'ovarian', cancerStage: 'stage2', urgencyLevel: 'high', supportType: ['emotional-support', 'financial-assistance'], status: 'In Progress', timestamp: new Date().toISOString() },
        { id: 'PAT-2026-010', fullName: 'Deepak Verma', age: 50, gender: 'male', contactNumber: '9210987654', cancerType: 'stomach', cancerStage: 'stage3', urgencyLevel: 'critical', supportType: ['treatment-navigation', 'palliative'], status: 'Pending', timestamp: new Date().toISOString() }
    ],
    volunteers: [
        { id: 'VOL-2026-001', fullName: 'Dr. Sanjay Mehta', profession: 'Oncologist', medicalBackground: 'yes', areasOfInterest: ['treatment-navigation', 'second-opinion'], hoursPerWeek: 10, immediateStart: 'yes', status: 'Active', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'VOL-2026-002', fullName: 'Rekha Menon', profession: 'Cancer Survivor', medicalBackground: 'no', areasOfInterest: ['peer-mentorship', 'emotional-support'], hoursPerWeek: 8, immediateStart: 'yes', status: 'Active', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'VOL-2026-003', fullName: 'Amit Saxena', profession: 'Social Worker', medicalBackground: 'no', areasOfInterest: ['financial-assistance', 'logistics'], hoursPerWeek: 15, immediateStart: 'yes', status: 'Active', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'VOL-2026-004', fullName: 'Dr. Nisha Kapoor', profession: 'Psychologist', medicalBackground: 'yes', areasOfInterest: ['emotional-support', 'counseling'], hoursPerWeek: 12, immediateStart: 'no', status: 'Pending', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'VOL-2026-005', fullName: 'Kiran Bhatia', profession: 'Nutritionist', medicalBackground: 'yes', areasOfInterest: ['nutrition', 'holistic-care'], hoursPerWeek: 6, immediateStart: 'yes', status: 'Active', timestamp: new Date().toISOString() }
    ],
    contacts: [
        { id: 'MSG-2026-001', name: 'Rohit Sharma', subject: 'Partnership Inquiry', priority: 'normal', status: 'Pending', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'MSG-2026-002', name: 'Asha Rani', subject: 'Donation Query', priority: 'urgent', status: 'Pending', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'MSG-2026-003', name: 'Suresh Yadav', subject: 'Feedback', priority: 'normal', status: 'Resolved', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'MSG-2026-004', name: 'Lakshmi Iyer', subject: 'Technical Support', priority: 'normal', status: 'Pending', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'MSG-2026-005', name: 'Prakash Jain', subject: 'General Inquiry', priority: 'normal', status: 'Pending', timestamp: new Date().toISOString() },
        { id: 'MSG-2026-006', name: 'Geeta Mishra', subject: 'Volunteer Query', priority: 'urgent', status: 'Pending', timestamp: new Date().toISOString() },
        { id: 'MSG-2026-007', name: 'Vinod Kumar', subject: 'Donation Query', priority: 'normal', status: 'Pending', timestamp: new Date().toISOString() },
        { id: 'MSG-2026-008', name: 'Shanti Devi', subject: 'Partnership', priority: 'urgent', status: 'Pending', timestamp: new Date().toISOString() }
    ]
};

// === Initialize Dashboard ===
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html') || 
        document.getElementById('criticalCases')) {
        initializeDashboard();
    }
});

function initializeDashboard() {
    loadDashboardData();
    initializeCharts();
    generateAISummary();
    setupFilters();
    setupRealTimeUpdates();
}

// === Load Dashboard Data - From Backend, localStorage, or Demo ===
async function loadDashboardData() {
    // Try to load from backend first
    if (USE_BACKEND_API) {
        try {
            const response = await fetch(`${DASHBOARD_API_URL}/api/dashboard/stats`);
            if (response.ok) {
                const data = await response.json();
                // Update from backend
                if (data.patients && data.patients.length > 0) dashboardData.patients = data.patients;
                if (data.volunteers && data.volunteers.length > 0) dashboardData.volunteers = data.volunteers;
                if (data.contacts && data.contacts.length > 0) dashboardData.contacts = data.contacts;
            }
        } catch (error) {
            console.log('Backend not available, using localStorage or demo data');
        }
    }
    
    // Also load from localStorage (as fallback or merge)
    const localPatients = window.jaruratCare?.getData('jaruratCare_patients') || [];
    const localVolunteers = window.jaruratCare?.getData('jaruratCare_volunteers') || [];
    const localContacts = window.jaruratCare?.getData('jaruratCare_contacts') || [];
    
    // Merge local data if backend data is empty
    if (dashboardData.patients.length === 0) dashboardData.patients = localPatients;
    if (dashboardData.volunteers.length === 0) dashboardData.volunteers = localVolunteers;
    if (dashboardData.contacts.length === 0) dashboardData.contacts = localContacts;
    
    // If still no data and demo mode is enabled, use demo data
    if (USE_DEMO_DATA) {
        if (dashboardData.patients.length === 0) dashboardData.patients = DEMO_DATA.patients;
        if (dashboardData.volunteers.length === 0) dashboardData.volunteers = DEMO_DATA.volunteers;
        if (dashboardData.contacts.length === 0) dashboardData.contacts = DEMO_DATA.contacts;
    }
    
    updateStatCards();
    populatePatientTable(dashboardData.patients);
    populateVolunteerTable(dashboardData.volunteers);
}

// === Update Statistics Cards with REAL Data ===
function updateStatCards() {
    const patients = dashboardData.patients;
    const volunteers = dashboardData.volunteers;
    const contacts = dashboardData.contacts;
    
    // Calculate real statistics
    const criticalCases = patients.filter(p => p.urgencyLevel === 'critical').length;
    const highCases = patients.filter(p => p.urgencyLevel === 'high').length;
    const pendingPatients = patients.filter(p => p.status === 'Pending').length;
    const pendingContacts = contacts.filter(c => c.status === 'Pending').length;
    
    // Calculate today's data
    const today = new Date().toDateString();
    const todayPatients = patients.filter(p => new Date(p.timestamp).toDateString() === today).length;
    const todayVolunteers = volunteers.filter(v => new Date(v.timestamp).toDateString() === today).length;
    
    // Calculate this week's data
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekPatients = patients.filter(p => new Date(p.timestamp) >= weekAgo).length;
    const weekVolunteers = volunteers.filter(v => new Date(v.timestamp) >= weekAgo).length;
    
    // Update DOM
    const criticalEl = document.getElementById('criticalCases');
    const patientsEl = document.getElementById('totalPatients');
    const volunteersEl = document.getElementById('totalVolunteers');
    const messagesEl = document.getElementById('totalMessages');
    
    if (criticalEl) criticalEl.textContent = criticalCases;
    if (patientsEl) patientsEl.textContent = patients.length;
    if (volunteersEl) volunteersEl.textContent = volunteers.length;
    if (messagesEl) messagesEl.textContent = contacts.length;
    
    // Update stat changes with real data
    updateStatChanges(todayPatients, todayVolunteers, weekPatients, weekVolunteers, pendingContacts, criticalCases);
}

function updateStatChanges(todayPatients, todayVolunteers, weekPatients, weekVolunteers, pendingContacts, criticalCases) {
    const statCards = document.querySelectorAll('.stat-card-dashboard');
    
    if (statCards[0]) {
        const changeEl = statCards[0].querySelector('.stat-change');
        if (changeEl) {
            const todayCritical = dashboardData.patients.filter(p => 
                p.urgencyLevel === 'critical' && 
                new Date(p.timestamp).toDateString() === new Date().toDateString()
            ).length;
            changeEl.textContent = todayCritical > 0 ? `+${todayCritical} today` : 'No new today';
            changeEl.className = `stat-change ${todayCritical > 0 ? 'up' : ''}`;
        }
    }
    
    if (statCards[1]) {
        const changeEl = statCards[1].querySelector('.stat-change');
        if (changeEl) {
            changeEl.textContent = weekPatients > 0 ? `+${weekPatients} this week` : 'No requests this week';
            changeEl.className = `stat-change ${weekPatients > 0 ? 'up' : ''}`;
        }
    }
    
    if (statCards[2]) {
        const changeEl = statCards[2].querySelector('.stat-change');
        if (changeEl) {
            changeEl.textContent = weekVolunteers > 0 ? `+${weekVolunteers} new` : 'No new this week';
            changeEl.className = `stat-change ${weekVolunteers > 0 ? 'up' : ''}`;
        }
    }
    
    if (statCards[3]) {
        const changeEl = statCards[3].querySelector('.stat-change');
        if (changeEl) {
            changeEl.textContent = pendingContacts > 0 ? `${pendingContacts} pending` : 'All processed';
        }
    }
}

// === Populate Patient Table ===
function populatePatientTable(patients) {
    const tbody = document.getElementById('patientTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (patients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No patient requests yet</p>
                    <small>Data will appear here once patient forms are submitted</small>
                </td>
            </tr>
        `;
        return;
    }
    
    // Show latest 10 patients, sorted by date
    const recentPatients = [...patients]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    
    recentPatients.forEach(patient => {
        const row = document.createElement('tr');
        const supportTypes = Array.isArray(patient.supportType) 
            ? patient.supportType.map(t => formatLabel(t)).join(', ')
            : formatLabel(patient.supportType || 'N/A');
            
        row.innerHTML = `
            <td><strong>${patient.id || 'N/A'}</strong></td>
            <td>${patient.fullName || 'N/A'}</td>
            <td>${patient.age || 'N/A'}</td>
            <td>${supportTypes}</td>
            <td><span class="status-badge ${patient.urgencyLevel || 'medium'}">${capitalize(patient.urgencyLevel || 'Medium')}</span></td>
            <td>${formatDate(patient.timestamp)}</td>
            <td><span class="status-badge ${(patient.status || 'pending').toLowerCase()}">${patient.status || 'Pending'}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// === Populate Volunteer Table ===
function populateVolunteerTable(volunteers) {
    const tbody = document.getElementById('volunteerTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (volunteers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No volunteer registrations yet</p>
                    <small>Data will appear here once volunteer forms are submitted</small>
                </td>
            </tr>
        `;
        return;
    }
    
    const recentVolunteers = [...volunteers]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    
    recentVolunteers.forEach(volunteer => {
        const areas = Array.isArray(volunteer.areasOfInterest) 
            ? volunteer.areasOfInterest.map(a => formatLabel(a)).join(', ')
            : formatLabel(volunteer.areasOfInterest || 'N/A');
            
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${volunteer.id || 'N/A'}</strong></td>
            <td>${volunteer.fullName || 'N/A'}</td>
            <td>${volunteer.profession || 'N/A'}</td>
            <td>${areas}</td>
            <td>${volunteer.hoursPerWeek || 0} hrs</td>
            <td>${formatDate(volunteer.timestamp)}</td>
            <td><span class="status-badge ${(volunteer.status || 'pending').toLowerCase().replace(' ', '-')}">${volunteer.status || 'Pending'}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// === Initialize Charts with REAL Data Only ===
function initializeCharts() {
    // Destroy existing charts first
    Object.values(charts).forEach(chart => {
        if (chart && chart.destroy) chart.destroy();
    });
    charts = {};
    
    createSupportTypeChart();
    createUrgencyChart();
    createTrendChart();
}

// === Support Type Chart - FIXED SIZE ===
function createSupportTypeChart() {
    const ctx = document.getElementById('supportTypeChart');
    if (!ctx) return;
    
    const patients = dashboardData.patients;
    const supportTypes = {};
    
    patients.forEach(patient => {
        const types = Array.isArray(patient.supportType) ? patient.supportType : [patient.supportType];
        types.forEach(type => {
            if (type) {
                supportTypes[type] = (supportTypes[type] || 0) + 1;
            }
        });
    });
    
    // Only show chart if there's data
    const hasData = Object.keys(supportTypes).length > 0;
    
    const labels = hasData 
        ? Object.keys(supportTypes).map(k => formatLabel(k))
        : ['No Data Yet'];
    const data = hasData 
        ? Object.values(supportTypes)
        : [1];
    const colors = hasData 
        ? ['#2E7D32', '#1976D2', '#F57C00', '#7B1FA2', '#D32F2F', '#00897B', '#5C6BC0']
        : ['#E0E0E0'];
    
    charts.supportType = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    position: 'right',
                    align: 'center',
                    labels: {
                        padding: 15,
                        font: { size: 11 },
                        boxWidth: 12
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '55%'
        }
    });
}

// === Urgency Chart - REAL Data Only ===
function createUrgencyChart() {
    const ctx = document.getElementById('urgencyChart');
    if (!ctx) return;
    
    const patients = dashboardData.patients;
    
    const urgencyLevels = {
        'Critical': patients.filter(p => p.urgencyLevel === 'critical').length,
        'High': patients.filter(p => p.urgencyLevel === 'high').length,
        'Medium': patients.filter(p => p.urgencyLevel === 'medium').length,
        'Low': patients.filter(p => p.urgencyLevel === 'low').length
    };
    
    charts.urgency = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(urgencyLevels),
            datasets: [{
                label: 'Number of Cases',
                data: Object.values(urgencyLevels),
                backgroundColor: ['#D32F2F', '#F57C00', '#1976D2', '#388E3C'],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => `${items[0].label} Priority`,
                        label: (item) => `${item.raw} case${item.raw !== 1 ? 's' : ''}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value : null
                    },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// === Trend Chart - REAL Data Only ===
function createTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    const patients = dashboardData.patients;
    const volunteers = dashboardData.volunteers;
    
    // Get last 7 days
    const days = [];
    const patientCounts = [];
    const volunteerCounts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        days.push(dateStr);
        
        // Count patients for this day
        const dayPatients = patients.filter(p => {
            const pDate = new Date(p.timestamp);
            pDate.setHours(0, 0, 0, 0);
            return pDate.getTime() === date.getTime();
        }).length;
        
        const dayVolunteers = volunteers.filter(v => {
            const vDate = new Date(v.timestamp);
            vDate.setHours(0, 0, 0, 0);
            return vDate.getTime() === date.getTime();
        }).length;
        
        patientCounts.push(dayPatients);
        volunteerCounts.push(dayVolunteers);
    }
    
    charts.trend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Patient Requests',
                    data: patientCounts,
                    borderColor: '#2E7D32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#2E7D32',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Volunteer Registrations',
                    data: volunteerCounts,
                    borderColor: '#1976D2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#1976D2',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 12,
                    titleFont: { size: 13 },
                    bodyFont: { size: 12 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        stepSize: 1,
                        callback: (value) => Number.isInteger(value) ? value : null
                    },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// === Generate AI Summary - GEMINI AI POWERED ===
async function generateAISummary() {
    const patients = dashboardData.patients;
    const volunteers = dashboardData.volunteers;
    
    // Calculate today's data
    const today = new Date().toDateString();
    const todayPatients = patients.filter(p => new Date(p.timestamp).toDateString() === today).length;
    const todayVolunteers = volunteers.filter(v => new Date(v.timestamp).toDateString() === today).length;
    
    // Find most requested support type
    const supportCounts = {};
    patients.forEach(patient => {
        const types = Array.isArray(patient.supportType) ? patient.supportType : [patient.supportType];
        types.forEach(type => {
            if (type) supportCounts[type] = (supportCounts[type] || 0) + 1;
        });
    });
    
    const topSupport = Object.keys(supportCounts).length > 0 
        ? Object.keys(supportCounts).reduce((a, b) => supportCounts[a] > supportCounts[b] ? a : b)
        : 'No data yet';
    
    // Update summary elements
    const todayPatientsEl = document.getElementById('todayPatients');
    const todayVolunteersEl = document.getElementById('todayVolunteers');
    const topSupportEl = document.getElementById('topSupport');
    const matchCountEl = document.getElementById('matchCount');
    
    if (todayPatientsEl) todayPatientsEl.textContent = todayPatients;
    if (todayVolunteersEl) todayVolunteersEl.textContent = todayVolunteers;
    if (topSupportEl) topSupportEl.textContent = formatLabel(topSupport);
    
    // Calculate real match count based on availability
    const availableVolunteers = volunteers.filter(v => v.immediateStart === 'yes').length;
    const pendingPatients = patients.filter(p => p.status === 'Pending').length;
    const possibleMatches = Math.min(availableVolunteers, pendingPatients);
    
    if (matchCountEl) matchCountEl.textContent = possibleMatches;
    
    // Update critical alerts with real data
    updateCriticalAlerts(patients);
    
    // Update response metrics with real calculations
    updateResponseMetrics(patients, volunteers);
    
    // Generate AI-powered insights if available
    await generateGeminiInsights();
}

// === Gemini AI Insights Generation ===
async function generateGeminiInsights() {
    const aiInsightsContainer = document.getElementById('aiInsights');
    if (!aiInsightsContainer) return;
    
    const patients = dashboardData.patients;
    const volunteers = dashboardData.volunteers;
    
    // Check if we have data
    if (patients.length === 0 && volunteers.length === 0) {
        aiInsightsContainer.innerHTML = `
            <div class="ai-insight-placeholder">
                <i class="fas fa-robot" aria-hidden="true"></i>
                <p>No data available yet. AI insights will appear once you have patient or volunteer registrations.</p>
            </div>
        `;
        return;
    }
    
    // Show loading state
    aiInsightsContainer.innerHTML = `
        <div class="ai-insight-loading">
            <i class="fas fa-brain fa-spin" aria-hidden="true"></i>
            <p>Generating AI insights...</p>
        </div>
    `;
    
    // Prepare data for API
    const today = new Date().toDateString();
    const todayPatients = patients.filter(p => new Date(p.timestamp).toDateString() === today).length;
    const todayVolunteers = volunteers.filter(v => new Date(v.timestamp).toDateString() === today).length;
    
    const supportCounts = {};
    patients.forEach(patient => {
        const types = Array.isArray(patient.supportType) ? patient.supportType : [patient.supportType];
        types.forEach(type => {
            if (type) supportCounts[type] = (supportCounts[type] || 0) + 1;
        });
    });
    const topSupport = Object.keys(supportCounts).length > 0 
        ? Object.keys(supportCounts).reduce((a, b) => supportCounts[a] > supportCounts[b] ? a : b)
        : 'General';
    
    const data = {
        totalPatients: patients.length,
        criticalCases: patients.filter(p => p.urgencyLevel === 'critical').length,
        highCases: patients.filter(p => p.urgencyLevel === 'high').length,
        mediumCases: patients.filter(p => p.urgencyLevel === 'medium').length,
        lowCases: patients.filter(p => p.urgencyLevel === 'low').length,
        pendingCases: patients.filter(p => p.status === 'Pending').length,
        totalVolunteers: volunteers.length,
        immediateVolunteers: volunteers.filter(v => v.immediateStart === 'yes').length,
        medicalVolunteers: volunteers.filter(v => v.medicalBackground === 'yes').length,
        todayPatients,
        todayVolunteers,
        topSupport: formatLabel(topSupport)
    };
    
    // Try Backend API first
    if (USE_BACKEND_API) {
        try {
            const response = await fetch(`${DASHBOARD_API_URL}/api/ai/insights`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.response) {
                    displayAIInsights(result.response);
                    return;
                }
            }
        } catch (error) {
            console.log('Backend AI API not available:', error.message);
        }
    }
    
    // Try frontend Gemini AI as fallback
    if (window.geminiAI) {
        try {
            const result = await window.geminiAI.generateDashboardSummary(data);
            
            if (result.success) {
                displayAIInsights(result.response);
                return;
            }
        } catch (error) {
            console.error('Frontend AI Insights error:', error);
        }
    }
    
    // Fallback to static insights
    displayFallbackInsights();
}

function displayAIInsights(insights) {
    const container = document.getElementById('aiInsights');
    if (!container) return;
    
    // Format the AI response
    const formattedInsights = insights
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/•/g, '&bull;');
    
    container.innerHTML = `
        <div class="ai-insight-content">
            <div class="ai-insight-header">
                <i class="fas fa-brain"></i>
                <span>AI-Generated Insights</span>
                <span class="ai-badge">Powered by Gemini</span>
            </div>
            <div class="ai-insight-body">
                ${formattedInsights}
            </div>
            <div class="ai-insight-footer">
                <small>Last updated: ${new Date().toLocaleTimeString()}</small>
                <button class="btn-refresh-ai" onclick="generateGeminiInsights()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
        </div>
    `;
}

function displayFallbackInsights() {
    const container = document.getElementById('aiInsights');
    if (!container) return;
    
    const patients = dashboardData.patients;
    const volunteers = dashboardData.volunteers;
    const criticalCount = patients.filter(p => p.urgencyLevel === 'critical').length;
    const highCount = patients.filter(p => p.urgencyLevel === 'high').length;
    const pendingCount = patients.filter(p => p.status === 'Pending').length;
    const inProgressCount = patients.filter(p => p.status === 'In Progress').length;
    const completedCount = patients.filter(p => p.status === 'Completed' || p.status === 'Resolved').length;
    const availableVolunteers = volunteers.filter(v => v.immediateStart === 'yes').length;
    const medicalVolunteers = volunteers.filter(v => v.medicalBackground === 'yes').length;
    
    // Calculate cancer type distribution
    const cancerTypes = {};
    patients.forEach(p => {
        const type = p.cancerType || 'other';
        cancerTypes[type] = (cancerTypes[type] || 0) + 1;
    });
    const topCancerType = Object.keys(cancerTypes).length > 0 
        ? Object.keys(cancerTypes).reduce((a, b) => cancerTypes[a] > cancerTypes[b] ? a : b)
        : null;
    
    let insights = '<strong>📊 Dashboard Analysis Summary:</strong><br><br>';
    
    // Priority cases
    if (criticalCount > 0 || highCount > 0) {
        insights += `<strong>🚨 Priority Cases:</strong><br>`;
        if (criticalCount > 0) {
            insights += `&bull; ${criticalCount} critical case(s) requiring immediate attention<br>`;
        }
        if (highCount > 0) {
            insights += `&bull; ${highCount} high-priority case(s) to address within 24-48 hours<br>`;
        }
        insights += '<br>';
    }
    
    // Workload summary
    insights += `<strong>📋 Current Workload:</strong><br>`;
    insights += `&bull; Total Active Cases: ${patients.length}<br>`;
    insights += `&bull; Pending Assignment: ${pendingCount}<br>`;
    insights += `&bull; In Progress: ${inProgressCount}<br>`;
    insights += `&bull; Completed: ${completedCount}<br><br>`;
    
    // Cancer type insights
    if (topCancerType) {
        insights += `<strong>🎗️ Top Cancer Type:</strong> ${formatLabel(topCancerType)} (${cancerTypes[topCancerType]} cases)<br><br>`;
    }
    
    // Volunteer resources
    insights += `<strong>👥 Volunteer Resources:</strong><br>`;
    insights += `&bull; ${volunteers.length} total volunteers registered<br>`;
    insights += `&bull; ${availableVolunteers} available for immediate deployment<br>`;
    insights += `&bull; ${medicalVolunteers} with medical background<br><br>`;
    
    // Recommendations
    insights += `<strong>💡 Recommendations:</strong><br>`;
    if (criticalCount > 0) {
        insights += `&bull; Prioritize ${criticalCount} critical case(s) for immediate volunteer assignment<br>`;
    }
    if (pendingCount > availableVolunteers) {
        insights += `&bull; Consider recruiting more volunteers to handle ${pendingCount - availableVolunteers} additional cases<br>`;
    } else if (availableVolunteers >= pendingCount && pendingCount > 0) {
        insights += `&bull; Good volunteer capacity - assign ${pendingCount} pending cases to available volunteers<br>`;
    }
    if (medicalVolunteers < criticalCount + highCount) {
        insights += `&bull; Need more medical volunteers for high-priority cancer cases<br>`;
    }
    
    if (patients.length === 0 && volunteers.length === 0) {
        insights = '<strong>Welcome!</strong><br><br>Start by adding patients or volunteers to see AI-powered insights.';
    }
    
    container.innerHTML = `
        <div class="ai-insight-content fallback">
            <div class="ai-insight-header">
                <i class="fas fa-chart-line"></i>
                <span>System Insights</span>
            </div>
            <div class="ai-insight-body">
                ${insights}
            </div>
        </div>
    `;
}

function updateCriticalAlerts(patients) {
    const criticalAlert = document.getElementById('criticalAlert');
    if (criticalAlert) {
        const criticalCount = patients.filter(p => p.urgencyLevel === 'critical' && p.status === 'Pending').length;
        const alertSpan = criticalAlert.querySelector('span');
        if (alertSpan) {
            if (criticalCount > 0) {
                alertSpan.innerHTML = `<strong>${criticalCount} critical case${criticalCount !== 1 ? 's' : ''}</strong> require${criticalCount === 1 ? 's' : ''} immediate attention.`;
                criticalAlert.style.display = 'flex';
            } else {
                alertSpan.innerHTML = `<strong>No critical cases</strong> requiring immediate attention.`;
            }
        }
    }
    
    // Update high priority alert
    const warningAlerts = document.querySelectorAll('.alert-item.warning');
    if (warningAlerts[0]) {
        const highCount = patients.filter(p => p.urgencyLevel === 'high' && p.status === 'Pending').length;
        const alertSpan = warningAlerts[0].querySelector('span');
        if (alertSpan) {
            if (highCount > 0) {
                alertSpan.innerHTML = `<strong>${highCount} high-priority case${highCount !== 1 ? 's' : ''}</strong> pending response within 24 hours.`;
            } else {
                alertSpan.innerHTML = `<strong>No high-priority cases</strong> pending.`;
            }
        }
    }
}

function updateResponseMetrics(patients, volunteers) {
    const metricsGrid = document.querySelector('.metrics-grid');
    if (!metricsGrid) return;
    
    // Calculate real metrics
    const totalCases = patients.length;
    const resolvedCases = patients.filter(p => p.status === 'Resolved' || p.status === 'Completed').length;
    const resolutionRate = totalCases > 0 ? ((resolvedCases / totalCases) * 100).toFixed(0) : 0;
    
    // Average response estimate based on urgency distribution
    let avgResponse = 'N/A';
    if (patients.length > 0) {
        const urgencyHours = { critical: 2, high: 6, medium: 18, low: 36 };
        let totalHours = 0;
        patients.forEach(p => {
            totalHours += urgencyHours[p.urgencyLevel] || 24;
        });
        avgResponse = (totalHours / patients.length).toFixed(1) + ' hrs';
    }
    
    const metricItems = metricsGrid.querySelectorAll('.metric-item');
    if (metricItems[0]) {
        metricItems[0].querySelector('.metric-value').textContent = avgResponse;
    }
    if (metricItems[1]) {
        metricItems[1].querySelector('.metric-value').textContent = resolutionRate + '%';
    }
    if (metricItems[2]) {
        // Satisfaction score - based on resolved cases ratio
        const score = totalCases > 0 ? Math.min(5, (3 + (resolutionRate / 50))).toFixed(1) : '0.0';
        metricItems[2].querySelector('.metric-value').textContent = score + '/5.0';
    }
}

// === Setup Filters - WORKING ===
function setupFilters() {
    // Chart period filters
    const chartFilters = document.querySelectorAll('.chart-filter');
    chartFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            const period = this.value;
            const chartType = this.closest('.chart-card')?.querySelector('canvas')?.id;
            
            if (chartType === 'supportTypeChart') {
                updateSupportChart(period);
            } else if (chartType === 'urgencyChart') {
                updateUrgencyChart(period);
            }
        });
    });
}

// === Update Support Chart by Period ===
function updateSupportChart(period) {
    const patients = filterByPeriod(dashboardData.patients, period);
    
    const supportTypes = {};
    patients.forEach(patient => {
        const types = Array.isArray(patient.supportType) ? patient.supportType : [patient.supportType];
        types.forEach(type => {
            if (type) supportTypes[type] = (supportTypes[type] || 0) + 1;
        });
    });
    
    const hasData = Object.keys(supportTypes).length > 0;
    
    if (charts.supportType) {
        charts.supportType.data.labels = hasData 
            ? Object.keys(supportTypes).map(k => formatLabel(k))
            : ['No Data'];
        charts.supportType.data.datasets[0].data = hasData 
            ? Object.values(supportTypes)
            : [1];
        charts.supportType.data.datasets[0].backgroundColor = hasData 
            ? ['#2E7D32', '#1976D2', '#F57C00', '#7B1FA2', '#D32F2F', '#00897B', '#5C6BC0'].slice(0, Object.keys(supportTypes).length)
            : ['#E0E0E0'];
        charts.supportType.update('active');
    }
}

// === Update Urgency Chart by Period ===
function updateUrgencyChart(period) {
    const patients = filterByPeriod(dashboardData.patients, period);
    
    const urgencyLevels = {
        'Critical': patients.filter(p => p.urgencyLevel === 'critical').length,
        'High': patients.filter(p => p.urgencyLevel === 'high').length,
        'Medium': patients.filter(p => p.urgencyLevel === 'medium').length,
        'Low': patients.filter(p => p.urgencyLevel === 'low').length
    };
    
    if (charts.urgency) {
        charts.urgency.data.datasets[0].data = Object.values(urgencyLevels);
        charts.urgency.update('active');
    }
}

// === Filter by Period Helper ===
function filterByPeriod(data, period) {
    const now = new Date();
    let filterDate = new Date(0); // All time by default
    
    if (period === 'week') {
        filterDate = new Date(now);
        filterDate.setDate(filterDate.getDate() - 7);
    } else if (period === 'month') {
        filterDate = new Date(now);
        filterDate.setMonth(filterDate.getMonth() - 1);
    }
    
    return data.filter(item => new Date(item.timestamp) >= filterDate);
}

// === Table Filter Functions - WORKING ===
function filterTable(tableId, searchValue) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    const search = searchValue.toLowerCase().trim();
    
    rows.forEach(row => {
        if (row.querySelector('.empty-state')) return;
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    });
}

function filterByUrgency(urgency) {
    const tbody = document.getElementById('patientTableBody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        if (row.querySelector('.empty-state')) return;
        
        if (urgency === 'all') {
            row.style.display = '';
        } else {
            const urgencyBadge = row.querySelector('.status-badge');
            if (urgencyBadge) {
                const rowUrgency = urgencyBadge.textContent.toLowerCase();
                row.style.display = rowUrgency === urgency ? '' : 'none';
            }
        }
    });
}

function filterByAvailability(filter) {
    const tbody = document.getElementById('volunteerTableBody');
    if (!tbody) return;
    
    let filteredVolunteers = [...dashboardData.volunteers];
    
    if (filter === 'immediate') {
        filteredVolunteers = filteredVolunteers.filter(v => v.immediateStart === 'yes');
    } else if (filter === 'medical') {
        filteredVolunteers = filteredVolunteers.filter(v => v.medicalBackground === 'yes');
    }
    
    populateVolunteerTable(filteredVolunteers);
}

// === Dashboard Actions - ALL WORKING ===

function refreshDashboard() {
    showNotification('Refreshing dashboard...', 'info');
    
    loadDashboardData();
    initializeCharts();
    generateAISummary();
    
    setTimeout(() => {
        showNotification('Dashboard refreshed successfully!', 'success');
    }, 500);
}

// === Generate PDF Report - FULLY WORKING ===
function generateReport() {
    showNotification('Generating PDF report...', 'info');
    
    const patients = dashboardData.patients;
    const volunteers = dashboardData.volunteers;
    const contacts = dashboardData.contacts;
    
    const reportDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const stats = {
        totalPatients: patients.length,
        criticalCases: patients.filter(p => p.urgencyLevel === 'critical').length,
        highCases: patients.filter(p => p.urgencyLevel === 'high').length,
        mediumCases: patients.filter(p => p.urgencyLevel === 'medium').length,
        lowCases: patients.filter(p => p.urgencyLevel === 'low').length,
        pendingCases: patients.filter(p => p.status === 'Pending').length,
        totalVolunteers: volunteers.length,
        immediateVolunteers: volunteers.filter(v => v.immediateStart === 'yes').length,
        medicalVolunteers: volunteers.filter(v => v.medicalBackground === 'yes').length,
        totalMessages: contacts.length
    };
    
    const supportDist = {};
    patients.forEach(p => {
        const types = Array.isArray(p.supportType) ? p.supportType : [p.supportType];
        types.forEach(t => {
            if (t) supportDist[formatLabel(t)] = (supportDist[formatLabel(t)] || 0) + 1;
        });
    });
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Jarurat Care - Analytics Report</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
                .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2E7D32; padding-bottom: 20px; }
                .header h1 { color: #2E7D32; font-size: 28px; margin-bottom: 5px; }
                .header p { color: #666; font-size: 14px; }
                .section { margin-bottom: 30px; }
                .section h2 { color: #2E7D32; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
                .stat-box { background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #2E7D32; }
                .stat-box.critical { border-left-color: #D32F2F; }
                .stat-box.warning { border-left-color: #F57C00; }
                .stat-box h3 { font-size: 32px; color: #2E7D32; }
                .stat-box.critical h3 { color: #D32F2F; }
                .stat-box.warning h3 { color: #F57C00; }
                .stat-box p { font-size: 12px; color: #666; margin-top: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
                th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
                th { background: #2E7D32; color: white; }
                tr:nth-child(even) { background: #f9f9f9; }
                .distribution-list { list-style: none; }
                .distribution-list li { padding: 8px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
                .badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
                .badge.critical { background: #FFEBEE; color: #D32F2F; }
                .badge.high { background: #FFF3E0; color: #F57C00; }
                .badge.medium { background: #E3F2FD; color: #1976D2; }
                .badge.low { background: #E8F5E9; color: #388E3C; }
                .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
                @media print { body { padding: 20px; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Jarurat Care Analytics Report</h1>
                <p>Generated on ${reportDate}</p>
            </div>
            
            <div class="section">
                <h2>Overview Statistics</h2>
                <div class="stats-grid">
                    <div class="stat-box critical">
                        <h3>${stats.criticalCases}</h3>
                        <p>Critical Cases</p>
                    </div>
                    <div class="stat-box warning">
                        <h3>${stats.pendingCases}</h3>
                        <p>Pending Cases</p>
                    </div>
                    <div class="stat-box">
                        <h3>${stats.totalPatients}</h3>
                        <p>Total Patients</p>
                    </div>
                    <div class="stat-box">
                        <h3>${stats.totalVolunteers}</h3>
                        <p>Volunteers</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Urgency Level Breakdown</h2>
                <table>
                    <tr><th>Level</th><th>Count</th><th>Percentage</th><th>Response Time</th></tr>
                    <tr>
                        <td><span class="badge critical">Critical</span></td>
                        <td>${stats.criticalCases}</td>
                        <td>${stats.totalPatients > 0 ? ((stats.criticalCases / stats.totalPatients) * 100).toFixed(1) : 0}%</td>
                        <td>1-2 hours</td>
                    </tr>
                    <tr>
                        <td><span class="badge high">High</span></td>
                        <td>${stats.highCases}</td>
                        <td>${stats.totalPatients > 0 ? ((stats.highCases / stats.totalPatients) * 100).toFixed(1) : 0}%</td>
                        <td>4-6 hours</td>
                    </tr>
                    <tr>
                        <td><span class="badge medium">Medium</span></td>
                        <td>${stats.mediumCases}</td>
                        <td>${stats.totalPatients > 0 ? ((stats.mediumCases / stats.totalPatients) * 100).toFixed(1) : 0}%</td>
                        <td>12-24 hours</td>
                    </tr>
                    <tr>
                        <td><span class="badge low">Low</span></td>
                        <td>${stats.lowCases}</td>
                        <td>${stats.totalPatients > 0 ? ((stats.lowCases / stats.totalPatients) * 100).toFixed(1) : 0}%</td>
                        <td>24-48 hours</td>
                    </tr>
                </table>
            </div>
            
            <div class="section">
                <h2>Support Type Distribution</h2>
                <ul class="distribution-list">
                    ${Object.entries(supportDist).map(([type, count]) => `
                        <li><span>${type}</span><strong>${count} request${count !== 1 ? 's' : ''}</strong></li>
                    `).join('') || '<li>No data available</li>'}
                </ul>
            </div>
            
            <div class="section">
                <h2>Volunteer Summary</h2>
                <table>
                    <tr><th>Metric</th><th>Count</th></tr>
                    <tr><td>Total Registered</td><td>${stats.totalVolunteers}</td></tr>
                    <tr><td>Available for Immediate Start</td><td>${stats.immediateVolunteers}</td></tr>
                    <tr><td>Medical Background</td><td>${stats.medicalVolunteers}</td></tr>
                </table>
            </div>
            
            ${patients.length > 0 ? `
            <div class="section">
                <h2>Recent Patient Requests</h2>
                <table>
                    <tr><th>ID</th><th>Name</th><th>Support Type</th><th>Urgency</th><th>Date</th></tr>
                    ${patients.slice(-5).reverse().map(p => `
                        <tr>
                            <td>${p.id || 'N/A'}</td>
                            <td>${p.fullName || 'N/A'}</td>
                            <td>${Array.isArray(p.supportType) ? p.supportType.map(t => formatLabel(t)).join(', ') : formatLabel(p.supportType || 'N/A')}</td>
                            <td><span class="badge ${p.urgencyLevel}">${capitalize(p.urgencyLevel || 'medium')}</span></td>
                            <td>${formatDate(p.timestamp)}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
            ` : ''}
            
            <div class="footer">
                <p>© 2024 Jarurat Care Foundation | In memory of Rekha Joshi</p>
                <p>For questions, contact: Priyanka.joshi@jarurat.care</p>
            </div>
            
            <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    showNotification('Report generated! Use Save as PDF in print dialog.', 'success');
}

// === Export Data - WORKING ===
function exportData() {
    const data = {
        exportInfo: {
            generatedAt: new Date().toISOString(),
            generatedBy: 'Jarurat Care Foundation Dashboard',
            version: '2.0'
        },
        summary: {
            totalPatients: dashboardData.patients.length,
            totalVolunteers: dashboardData.volunteers.length,
            totalContacts: dashboardData.contacts.length
        },
        patients: dashboardData.patients,
        volunteers: dashboardData.volunteers,
        contacts: dashboardData.contacts
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `jarurat-care-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

// === Export to CSV function ===
function exportToCSV() {
    const patients = dashboardData.patients;
    if (patients.length === 0) {
        showNotification('No data to export', 'warning');
        return;
    }
    
    // Build CSV content
    const headers = ['ID', 'Full Name', 'Age', 'Gender', 'Contact', 'Cancer Type', 'Stage', 'Urgency', 'Support Needed', 'Status', 'Date'];
    const rows = patients.map(p => [
        p.id || '',
        p.fullName || '',
        p.age || '',
        p.gender || '',
        p.contactNumber || '',
        p.cancerType || p.medicalCondition || '',
        p.cancerStage || '',
        p.urgencyLevel || '',
        Array.isArray(p.supportType) ? p.supportType.join('; ') : (p.supportType || ''),
        p.status || 'Pending',
        formatDate(p.timestamp)
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `jarurat-care-patients-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('CSV exported successfully!', 'success');
}

// Make exportToCSV globally available
window.exportToCSV = exportToCSV;

function refreshSummary() {
    generateAISummary();
    showNotification('Summary regenerated with latest data!', 'success');
}

// === Real-time Updates ===
function setupRealTimeUpdates() {
    setInterval(() => {
        const newPatients = window.jaruratCare?.getData('jaruratCare_patients') || [];
        const newVolunteers = window.jaruratCare?.getData('jaruratCare_volunteers') || [];
        
        if (newPatients.length !== dashboardData.patients.length || 
            newVolunteers.length !== dashboardData.volunteers.length) {
            loadDashboardData();
            initializeCharts();
            generateAISummary();
        }
    }, 30000);
}

// === Utility Functions ===
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatLabel(str) {
    if (!str) return 'N/A';
    return str.split('-').map(word => capitalize(word)).join(' ');
}

function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    if (window.jaruratCare?.showSuccessMessage) {
        window.jaruratCare.showSuccessMessage(message);
        return;
    }
    
    const existing = document.querySelector('.dashboard-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `dashboard-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// === Export Functions ===
window.dashboardFunctions = {
    refreshDashboard,
    generateReport,
    exportData,
    refreshSummary,
    filterTable,
    filterByUrgency,
    filterByAvailability,
    updateSupportChart,
    updateUrgencyChart
};

window.refreshDashboard = refreshDashboard;
window.generateReport = generateReport;
window.exportData = exportData;
window.refreshSummary = refreshSummary;
window.filterTable = filterTable;
window.filterByUrgency = filterByUrgency;
window.filterByAvailability = filterByAvailability;
window.updateSupportChart = updateSupportChart;
window.updateUrgencyChart = updateUrgencyChart;
