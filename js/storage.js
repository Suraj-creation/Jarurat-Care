// ===================================
// LocalStorage Management - Jarurat Care
// ===================================

const StorageManager = {
    // Storage keys
    KEYS: {
        PATIENTS: 'jaruratCare_patients',
        VOLUNTEERS: 'jaruratCare_volunteers',
        CONTACTS: 'jaruratCare_contacts',
        AUTO_RESPONSES: 'jaruratCare_autoResponses',
        CHAT_HISTORY: 'chatbot_history',
        INITIALIZED: 'jaruratCare_initialized',
        PATIENT_FORM_DRAFT: 'patientFormData',
        VOLUNTEER_FORM_DRAFT: 'volunteerFormData'
    },

    // Initialize storage
    init() {
        if (!this.isSupported()) {
            console.error('LocalStorage is not supported in this browser');
            return false;
        }

        if (!localStorage.getItem(this.KEYS.INITIALIZED)) {
            this.setupInitialData();
        }
        return true;
    },

    // Check if localStorage is supported
    isSupported() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Setup initial data structure
    setupInitialData() {
        const initialData = {
            [this.KEYS.PATIENTS]: [],
            [this.KEYS.VOLUNTEERS]: [],
            [this.KEYS.CONTACTS]: [],
            [this.KEYS.AUTO_RESPONSES]: [],
            [this.KEYS.CHAT_HISTORY]: []
        };

        Object.entries(initialData).forEach(([key, value]) => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(value));
            }
        });

        localStorage.setItem(this.KEYS.INITIALIZED, 'true');
    },

    // Get data from storage
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting data for key ${key}:`, error);
            return null;
        }
    },

    // Set data in storage
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting data for key ${key}:`, error);
            return false;
        }
    },

    // Add item to array
    add(key, item) {
        const data = this.get(key) || [];
        data.push(item);
        return this.set(key, data);
    },

    // Remove item from storage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing key ${key}:`, error);
            return false;
        }
    },

    // Clear all data
    clearAll() {
        try {
            Object.values(this.KEYS).forEach(key => {
                if (key !== this.KEYS.INITIALIZED) {
                    this.remove(key);
                }
            });
            this.setupInitialData();
            return true;
        } catch (error) {
            console.error('Error clearing all data:', error);
            return false;
        }
    },

    // Get storage info
    getInfo() {
        const info = {
            isSupported: this.isSupported(),
            keys: Object.keys(localStorage),
            totalSize: 0
        };

        Object.keys(localStorage).forEach(key => {
            info.totalSize += localStorage.getItem(key).length;
        });

        info.totalSize = (info.totalSize / 1024).toFixed(2) + ' KB';
        return info;
    },

    // Export all data
    exportAll() {
        const exportData = {
            patients: this.get(this.KEYS.PATIENTS) || [],
            volunteers: this.get(this.KEYS.VOLUNTEERS) || [],
            contacts: this.get(this.KEYS.CONTACTS) || [],
            autoResponses: this.get(this.KEYS.AUTO_RESPONSES) || [],
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        return exportData;
    },

    // Import data
    importData(data) {
        try {
            if (data.patients) this.set(this.KEYS.PATIENTS, data.patients);
            if (data.volunteers) this.set(this.KEYS.VOLUNTEERS, data.volunteers);
            if (data.contacts) this.set(this.KEYS.CONTACTS, data.contacts);
            if (data.autoResponses) this.set(this.KEYS.AUTO_RESPONSES, data.autoResponses);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    // Search functionality
    search(key, searchTerm, fields = []) {
        const data = this.get(key) || [];
        const lowerSearch = searchTerm.toLowerCase();

        return data.filter(item => {
            if (fields.length === 0) {
                // Search all fields
                return JSON.stringify(item).toLowerCase().includes(lowerSearch);
            } else {
                // Search specific fields
                return fields.some(field => {
                    const value = item[field];
                    return value && value.toString().toLowerCase().includes(lowerSearch);
                });
            }
        });
    },

    // Filter by date range
    filterByDateRange(key, startDate, endDate) {
        const data = this.get(key) || [];
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        return data.filter(item => {
            const itemDate = new Date(item.timestamp).getTime();
            return itemDate >= start && itemDate <= end;
        });
    },

    // Get statistics
    getStatistics() {
        return {
            patients: {
                total: (this.get(this.KEYS.PATIENTS) || []).length,
                critical: (this.get(this.KEYS.PATIENTS) || []).filter(p => p.urgencyLevel === 'critical').length,
                pending: (this.get(this.KEYS.PATIENTS) || []).filter(p => p.status === 'Pending').length
            },
            volunteers: {
                total: (this.get(this.KEYS.VOLUNTEERS) || []).length,
                immediate: (this.get(this.KEYS.VOLUNTEERS) || []).filter(v => v.immediateStart === 'yes').length,
                medical: (this.get(this.KEYS.VOLUNTEERS) || []).filter(v => v.medicalBackground === 'yes').length
            },
            contacts: {
                total: (this.get(this.KEYS.CONTACTS) || []).length,
                urgent: (this.get(this.KEYS.CONTACTS) || []).filter(c => c.priority === 'urgent').length,
                open: (this.get(this.KEYS.CONTACTS) || []).filter(c => c.status === 'Open').length
            }
        };
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    window.StorageManager = StorageManager;
    StorageManager.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
