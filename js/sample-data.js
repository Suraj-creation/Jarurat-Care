// ===================================
// Sample Data Generator for Testing
// Jarurat Care - Cancer Support NGO
// Run this in browser console to populate data
// ===================================

const SampleDataGenerator = {
    // Sample cancer patient data
    patients: [
        {
            fullName: "Rajesh Kumar",
            age: 58,
            gender: "male",
            phone: "+91 9876543210",
            email: "rajesh.kumar@email.com",
            address: "45 Green Park, New Delhi",
            medicalCondition: "Stage III Gallbladder Cancer (Cholangiocarcinoma) - undergoing chemotherapy",
            cancerType: "gallbladder",
            supportType: ["emotional-support", "financial-aid", "treatment-navigation"],
            urgencyLevel: "high",
            additionalDetails: "Needs help navigating insurance claims and emotional counseling for family",
            consent: true,
            status: "Pending"
        },
        {
            fullName: "Sunita Devi",
            age: 52,
            gender: "female",
            phone: "+91 8765432109",
            email: "sunita.devi@email.com",
            address: "23 Saket Colony, Mumbai",
            medicalCondition: "Breast Cancer Stage II - Post mastectomy, starting radiation therapy",
            cancerType: "breast",
            supportType: ["peer-mentorship", "nutrition-counseling", "emotional-support"],
            urgencyLevel: "medium",
            additionalDetails: "Looking for breast cancer survivor mentor for guidance",
            consent: true,
            status: "In Progress"
        },
        {
            fullName: "Mohammed Ali",
            age: 65,
            gender: "male",
            phone: "+91 7654321098",
            email: "mohammed.ali@email.com",
            address: "78 Civil Lines, Lucknow",
            medicalCondition: "Lung Cancer Stage IV - Palliative care phase",
            cancerType: "lung",
            supportType: ["palliative-care", "emotional-support", "caregiver-support"],
            urgencyLevel: "critical",
            additionalDetails: "Family needs palliative care guidance and emotional support",
            consent: true,
            status: "Pending"
        },
        {
            fullName: "Priya Sharma",
            age: 34,
            gender: "female",
            phone: "+91 6543210987",
            email: "priya.sharma@email.com",
            address: "12 Sector 15, Gurgaon",
            medicalCondition: "Cervical Cancer Stage I - Recently diagnosed, exploring treatment options",
            cancerType: "cervical",
            supportType: ["treatment-navigation", "second-opinion", "emotional-support"],
            urgencyLevel: "high",
            additionalDetails: "Young mother seeking expert second opinion and treatment guidance",
            consent: true,
            status: "Pending"
        },
        {
            fullName: "Arun Patel",
            age: 48,
            gender: "male",
            phone: "+91 5432109876",
            email: "arun.patel@email.com",
            address: "56 MG Road, Bangalore",
            medicalCondition: "Oral Cancer Stage II - Post surgery, undergoing radiation",
            cancerType: "oral",
            supportType: ["nutrition-counseling", "peer-mentorship", "speech-therapy"],
            urgencyLevel: "medium",
            additionalDetails: "Needs nutritional guidance post oral surgery",
            consent: true,
            status: "In Progress"
        },
        {
            fullName: "Lakshmi Nair",
            age: 62,
            gender: "female",
            phone: "+91 4321098765",
            email: "lakshmi.nair@email.com",
            address: "34 Marina Beach Road, Chennai",
            medicalCondition: "Ovarian Cancer Stage III - Completed chemotherapy, in remission",
            cancerType: "ovarian",
            supportType: ["follow-up-support", "wellness-programs"],
            urgencyLevel: "low",
            additionalDetails: "In remission, seeking ongoing wellness support",
            consent: true,
            status: "Resolved"
        },
        {
            fullName: "Vikram Singh",
            age: 55,
            gender: "male",
            phone: "+91 3210987654",
            email: "vikram.singh@email.com",
            address: "89 Jaipur Gate, Jaipur",
            medicalCondition: "Prostate Cancer - Newly diagnosed, needs treatment guidance",
            cancerType: "prostate",
            supportType: ["treatment-navigation", "doctor-consultation", "emotional-support"],
            urgencyLevel: "high",
            additionalDetails: "Needs connection with oncologist and treatment options discussion",
            consent: true,
            status: "Pending"
        },
        {
            fullName: "Anita Kumari",
            age: 45,
            gender: "female",
            phone: "+91 2109876543",
            email: "anita.kumari@email.com",
            address: "67 Patna Junction, Patna",
            medicalCondition: "Thyroid Cancer Stage I - Post surgery, on medication",
            cancerType: "thyroid",
            supportType: ["medication-guidance", "follow-up-support"],
            urgencyLevel: "low",
            additionalDetails: "Needs guidance on long-term medication management",
            consent: true,
            status: "Resolved"
        }
    ],

    // Sample volunteer/mentor data
    volunteers: [
        {
            fullName: "Dr. Amit Verma",
            age: 42,
            gender: "male",
            phone: "+91 9988776655",
            email: "dr.amit.verma@email.com",
            address: "Medical Colony, New Delhi",
            profession: "Oncologist",
            medicalBackground: "yes",
            areasOfInterest: ["treatment-guidance", "second-opinion", "medical-consultation"],
            hoursPerWeek: "10-15",
            immediateStart: "yes",
            motivation: "Want to help cancer patients navigate their treatment journey with expert guidance",
            specialization: "Gastrointestinal Oncology",
            status: "Active"
        },
        {
            fullName: "Neha Gupta",
            age: 38,
            gender: "female",
            phone: "+91 8877665544",
            email: "neha.gupta@email.com",
            address: "Sector 22, Noida",
            profession: "Cancer Survivor & Counselor",
            medicalBackground: "no",
            areasOfInterest: ["peer-mentorship", "emotional-support", "survivor-stories"],
            hoursPerWeek: "15-20",
            immediateStart: "yes",
            motivation: "As a breast cancer survivor, I want to guide others through this journey with hope",
            cancerExperience: "Breast Cancer Survivor - 5 years",
            status: "Active"
        },
        {
            fullName: "Dr. Fatima Khan",
            age: 45,
            gender: "female",
            phone: "+91 5544332211",
            email: "dr.fatima.khan@email.com",
            address: "Civil Lines, Lucknow",
            profession: "Clinical Psychologist",
            medicalBackground: "yes",
            areasOfInterest: ["emotional-support", "counseling", "caregiver-support"],
            hoursPerWeek: "5-10",
            immediateStart: "yes",
            motivation: "Mental health support is crucial for cancer patients and their families",
            specialization: "Oncology Psychology",
            status: "Active"
        },
        {
            fullName: "Suresh Menon",
            age: 55,
            gender: "male",
            phone: "+91 7766554433",
            email: "suresh.menon@email.com",
            address: "Koramangala, Bangalore",
            profession: "Retired Corporate Executive",
            medicalBackground: "no",
            areasOfInterest: ["financial-guidance", "insurance-help", "administrative"],
            hoursPerWeek: "15-20",
            immediateStart: "yes",
            motivation: "Lost my wife to cancer, want to help others navigate the financial challenges",
            status: "Active"
        },
        {
            fullName: "Kavitha Rao",
            age: 32,
            gender: "female",
            phone: "+91 6655443322",
            email: "kavitha.rao@email.com",
            address: "Banjara Hills, Hyderabad",
            profession: "Dietitian/Nutritionist",
            medicalBackground: "yes",
            areasOfInterest: ["nutrition-counseling", "wellness-programs", "holistic-care"],
            hoursPerWeek: "10-15",
            immediateStart: "yes",
            motivation: "Proper nutrition can significantly improve cancer treatment outcomes",
            specialization: "Oncology Nutrition",
            status: "Active"
        },
        {
            fullName: "Rahul Sharma",
            age: 28,
            gender: "male",
            phone: "+91 4433221100",
            email: "rahul.sharma@email.com",
            address: "Connaught Place, Delhi",
            profession: "Social Worker",
            medicalBackground: "no",
            areasOfInterest: ["patient-advocacy", "hospital-navigation", "community-outreach"],
            hoursPerWeek: "20+",
            immediateStart: "yes",
            motivation: "Helping cancer patients access the care they deserve",
            status: "Active"
        }
    ],

    // Sample contact/support requests
    contacts: [
        {
            name: "Sanjay Mehta",
            email: "sanjay.mehta@email.com",
            phone: "+91 9876543210",
            subject: "Corporate Partnership for Cancer Awareness",
            message: "Our company wants to partner with Jarurat Care for a cancer awareness campaign. We can provide funding and employee volunteers.",
            status: "Pending"
        },
        {
            name: "Dr. Pooja Agarwal",
            email: "dr.pooja.agarwal@email.com",
            phone: "+91 8765432109",
            subject: "Medical Camp Collaboration",
            message: "I'm an oncologist and would like to organize a free cancer screening camp with Jarurat Care.",
            status: "Responded"
        },
        {
            name: "Ramesh Iyer",
            email: "ramesh.iyer@email.com",
            phone: "+91 7654321098",
            subject: "Seeking Support for Mother's Cancer Treatment",
            message: "My mother was recently diagnosed with gallbladder cancer. We need guidance on treatment options and financial assistance.",
            status: "Pending"
        }
    ],

    // Generate data with timestamps
    generateData: function() {
        const now = Date.now();
        const dayMs = 24 * 60 * 60 * 1000;

        // Add timestamps to patients
        const patientsWithTimestamps = this.patients.map((patient, index) => ({
            ...patient,
            id: `PAT${String(1001 + index).padStart(4, '0')}`,
            timestamp: new Date(now - (index * dayMs * 0.5)).toISOString() // Spread over last few days
        }));

        // Add timestamps to volunteers
        const volunteersWithTimestamps = this.volunteers.map((volunteer, index) => ({
            ...volunteer,
            id: `VOL${String(1001 + index).padStart(4, '0')}`,
            timestamp: new Date(now - (index * dayMs * 0.7)).toISOString()
        }));

        // Add timestamps to contacts
        const contactsWithTimestamps = this.contacts.map((contact, index) => ({
            ...contact,
            id: `MSG${String(1001 + index).padStart(4, '0')}`,
            timestamp: new Date(now - (index * dayMs * 0.3)).toISOString()
        }));

        return {
            patients: patientsWithTimestamps,
            volunteers: volunteersWithTimestamps,
            contacts: contactsWithTimestamps
        };
    },

    // Save to localStorage
    seedData: function() {
        const data = this.generateData();
        
        localStorage.setItem('jaruratCare_patients', JSON.stringify(data.patients));
        localStorage.setItem('jaruratCare_volunteers', JSON.stringify(data.volunteers));
        localStorage.setItem('jaruratCare_contacts', JSON.stringify(data.contacts));

        console.log('✅ Sample data seeded successfully!');
        console.log(`   - ${data.patients.length} patients`);
        console.log(`   - ${data.volunteers.length} volunteers`);
        console.log(`   - ${data.contacts.length} contacts`);
        
        return data;
    },

    // Clear all data
    clearData: function() {
        localStorage.removeItem('jaruratCare_patients');
        localStorage.removeItem('jaruratCare_volunteers');
        localStorage.removeItem('jaruratCare_contacts');
        console.log('🗑️ All data cleared!');
    },

    // View current data
    viewData: function() {
        const patients = JSON.parse(localStorage.getItem('jaruratCare_patients') || '[]');
        const volunteers = JSON.parse(localStorage.getItem('jaruratCare_volunteers') || '[]');
        const contacts = JSON.parse(localStorage.getItem('jaruratCare_contacts') || '[]');

        console.log('📊 Current Data Summary:');
        console.log(`   Patients: ${patients.length}`);
        console.log(`   Volunteers: ${volunteers.length}`);
        console.log(`   Contacts: ${contacts.length}`);

        return { patients, volunteers, contacts };
    }
};

// Make available globally
window.SampleDataGenerator = SampleDataGenerator;

// Auto-seed if no data exists
document.addEventListener('DOMContentLoaded', function() {
    const existingPatients = localStorage.getItem('jaruratCare_patients');
    const existingVolunteers = localStorage.getItem('jaruratCare_volunteers');
    
    if (!existingPatients && !existingVolunteers) {
        console.log('📝 No existing data found. Auto-seeding sample data...');
        SampleDataGenerator.seedData();
    } else {
        console.log('📊 Existing data found. Use SampleDataGenerator.seedData() to refresh.');
    }
});

console.log('💾 Sample Data Generator loaded. Commands:');
console.log('   SampleDataGenerator.seedData()  - Add sample data');
console.log('   SampleDataGenerator.clearData() - Clear all data');
console.log('   SampleDataGenerator.viewData()  - View current data');
