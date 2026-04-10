import { createContext, useContext, useState, useCallback } from 'react'

const AppDataContext = createContext(null)

// ── Helpers ──────────────────────────────────────────────────────────────────
function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        return fallback
    }
}
function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

// ── Seed Data ─────────────────────────────────────────────────────────────────
const SEED_EVENTS = [
    {
        id: 'ev1',
        title: 'Food Distribution Drive',
        type: 'drive',
        date: '2026-04-20',
        time: '9:00 AM – 1:00 PM',
        location: 'Station Road, Anand',
        description: 'Monthly food distribution for underprivileged families.',
        slots: 20,
        registrations: ['arjun.m@email.com'],
    },
    {
        id: 'ev2',
        title: 'Free Health Camp',
        type: 'camp',
        date: '2026-04-27',
        time: '10:00 AM – 4:00 PM',
        location: 'Community Hall, Vallabh Vidyanagar',
        description: 'Free general health check-up, BP, sugar screening.',
        slots: 15,
        registrations: [],
    },
    {
        id: 'ev3',
        title: 'Back-to-School Supply Drive',
        type: 'drive',
        date: '2026-05-05',
        time: '8:00 AM – 12:00 PM',
        location: 'Anand Primary School',
        description: 'Distribute books, bags, and stationery to 200+ students.',
        slots: 25,
        registrations: ['sunita.d@email.com'],
    },
    {
        id: 'ev4',
        title: 'Women Empowerment Workshop',
        type: 'camp',
        date: '2026-05-15',
        time: '2:00 PM – 5:00 PM',
        location: 'NGO Anand Office',
        description: 'Skill development and awareness session for women.',
        slots: 10,
        registrations: [],
    },
    { id: 'pe1', title: 'Winter Blanket Drive', type: 'drive', date: '2025-12-20', time: '8:00 PM – 11:00 PM', location: 'Railway Station', description: 'Distributed 200 blankets.', slots: 15, registrations: ['sunita.d@email.com'] },
    { id: 'pe2', title: 'Free Eye Checkup Camp', type: 'camp', date: '2025-11-15', time: '10:00 AM – 3:00 PM', location: 'Civil Hospital', description: 'Screened 150+ elderly patients.', slots: 20, registrations: ['arjun.m@email.com', 'rahul.s@email.com'] },
    { id: 'pe3', title: 'Diwali Sweets Sharing', type: 'drive', date: '2025-10-22', time: '4:00 PM – 7:00 PM', location: 'Slum Areas, Anand', description: 'Sweets for children.', slots: 12, registrations: [] },
    { id: 'pe4', title: 'Blood Donation Camp', type: 'camp', date: '2025-08-10', time: '9:00 AM – 2:00 PM', location: 'Red Cross Society', description: 'Collected 75 units.', slots: 10, registrations: ['arjun.m@email.com'] },
    { id: 'pe5', title: 'Monsoon Umbrella Drive', type: 'drive', date: '2025-07-05', time: '11:00 AM – 1:00 PM', location: 'Bus Stand', description: 'Gave umbrellas and raincoats to street vendors.', slots: 15, registrations: ['rahul.s@email.com'] },
    { id: 'pe6', title: 'Mental Health Workshop', type: 'camp', date: '2025-06-18', time: '3:00 PM – 5:00 PM', location: 'Town Hall', description: 'Stress management and counseling.', slots: 8, registrations: [] },
    { id: 'pe7', title: 'Summer Hydration Camp', type: 'camp', date: '2025-05-12', time: '12:00 PM – 4:00 PM', location: 'Amul Dairy Road', description: 'Distributed buttermilk and ORS.', slots: 20, registrations: ['sunita.d@email.com', 'arjun.m@email.com'] },
    { id: 'pe8', title: 'Old Clothes Collection', type: 'drive', date: '2025-04-02', time: '9:00 AM – 5:00 PM', location: 'NGO Office', description: 'Collected 500+ items of clothing.', slots: 10, registrations: [] },
    { id: 'pe9', title: 'Dental Screening Camp', type: 'camp', date: '2025-03-20', time: '9:00 AM – 1:00 PM', location: 'Primary School', description: 'Free checkups for kids.', slots: 12, registrations: ['rahul.s@email.com'] },
    { id: 'pe10', title: 'Grocery Distribution', type: 'drive', date: '2025-01-26', time: '10:00 AM – 12:00 PM', location: 'Station Road', description: 'Monthly ration kits distributed.', slots: 15, registrations: ['arjun.m@email.com'] },
    { id: 'pe11', title: 'Orphanage Visit', type: 'camp', date: '2024-12-25', time: '4:00 PM – 7:00 PM', location: 'Anand Orphanage', description: 'Games and dinner with kids.', slots: 25, registrations: ['sunita.d@email.com', 'rahul.s@email.com'] },
]

const SEED_VOLUNTEERS = [
    { id: 'v1', name: 'Arjun Mehta', email: 'arjun.m@email.com', role: 'Volunteer', hours: 42, status: 'Active', joined: '2024-05-10' },
    { id: 'v2', name: 'Sunita Desai', email: 'sunita.d@email.com', role: 'Volunteer', hours: 36, status: 'Active', joined: '2024-08-14' },
    { id: 'v3', name: 'Rahul Shah', email: 'rahul.s@email.com', role: 'Volunteer', hours: 18, status: 'Active', joined: '2025-01-02' },
    { id: 'v4', name: 'Riya Patel', email: 'riya.p@email.com', role: 'Volunteer', hours: 55, status: 'Active', joined: '2023-11-20' },
    { id: 'v5', name: 'Vikram Singh', email: 'vikram.s@email.com', role: 'Volunteer', hours: 12, status: 'Active', joined: '2025-02-15' },
    { id: 'v6', name: 'Neha Gupta', email: 'neha.g@email.com', role: 'Volunteer', hours: 25, status: 'Active', joined: '2024-12-05' },
    { id: 'v7', name: 'Kunal Joshi', email: 'kunal.j@email.com', role: 'Volunteer', hours: 8, status: 'Active', joined: '2025-03-10' },
    { id: 'v8', name: 'Pooja Trivedi', email: 'pooja.t@email.com', role: 'Volunteer', hours: 60, status: 'Active', joined: '2023-09-01' },
    { id: 'v9', name: 'Amit Chawla', email: 'amit.c@email.com', role: 'Volunteer', hours: 14, status: 'Active', joined: '2024-10-18' },
    { id: 'v10', name: 'Sneha Rao', email: 'sneha.r@email.com', role: 'Volunteer', hours: 30, status: 'Active', joined: '2024-07-22' },
    { id: 'v11', name: 'Manoj Tiwari', email: 'manoj.t@email.com', role: 'Volunteer', hours: 45, status: 'Active', joined: '2024-03-30' },
    { id: 'v12', name: 'Kavita Verma', email: 'kavita.v@email.com', role: 'Volunteer', hours: 22, status: 'Active', joined: '2024-09-09' },
    { id: 'v13', name: 'Rakesh Yadav', email: 'rakesh.y@email.com', role: 'Volunteer', hours: 5, status: 'Active', joined: '2025-04-01' },
    { id: 'v14', name: 'Anjali Nair', email: 'anjali.n@email.com', role: 'Volunteer', hours: 50, status: 'Active', joined: '2024-01-15' },
    { id: 'v15', name: 'Sanjay Dutt', email: 'sanjay.d@email.com', role: 'Volunteer', hours: 10, status: 'Active', joined: '2025-03-20' },
]

const SEED_EXPENSES = [
    { id: 'ex1', description: 'Food supplies – April Drive', amount: 18000, date: '2026-04-05', category: 'Food' },
    { id: 'ex2', description: 'Medical kits – Health Camp', amount: 22000, date: '2026-03-28', category: 'Healthcare' },
    { id: 'ex3', description: 'School supplies – March Drive', amount: 15500, date: '2026-03-15', category: 'Education' },
    { id: 'ex4', description: 'Office rent – Q1', amount: 12000, date: '2026-03-01', category: 'Operations' },
]

const SEED_CONTACT_MSGS = [
    { id: 'cm1', name: 'Priya Patel', email: 'priya@example.com', subject: 'Volunteer Opportunities', message: 'I would love to volunteer during weekends. Please let me know how to join.', date: '2026-04-07' },
    { id: 'cm2', name: 'Karan Joshi', email: 'karan@biz.com', subject: 'Partnership Proposal', message: 'Our company would like to sponsor the upcoming health camp.', date: '2026-04-06' },
]

const SEED_DONATIONS = [
    { id: 'd0', amount: 500, cause: 'Food Distribution', donor: 'Arjun Mehta', email: 'arjun.m@email.com', date: '2026-03-10', receiptNo: 'RCP-0001' },
    { id: 'd1', amount: 1000, cause: 'Education Fund', donor: 'Priya Patel', email: 'priya@example.com', date: '2026-03-22', receiptNo: 'RCP-0002' },
    { id: 'd2', amount: 2500, cause: 'Healthcare Drive', donor: 'Karan Joshi', email: 'karan@biz.com', date: '2026-04-01', receiptNo: 'RCP-0003' },
]

const SEED_STAFF = [
    { id: 's1', name: 'Dhruvil Gandhi', email: 'dhruvil@ngoanand.org', department: 'Management', status: 'Active', joined: '2010-06-01' },
    { id: 's2', name: 'Dhruv Jani', email: 'dhruv@ngoanand.org', department: 'Operations', status: 'Active', joined: '2010-06-01' },
    { id: 's3', name: 'Meera Patel', email: 'meera@ngoanand.org', department: 'Field Coordination', status: 'Active', joined: '2022-03-15' },
    { id: 's4', name: 'Rajan Solanki', email: 'rajan@ngoanand.org', department: 'Finance', status: 'Active', joined: '2023-07-10' },
]

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppDataProvider({ children }) {
    const [events, setEvents] = useState(() => load('ngo_events', SEED_EVENTS))
    const [volunteers, setVolunteers] = useState(() => load('ngo_volunteers', SEED_VOLUNTEERS))
    const [staff, setStaff] = useState(() => load('ngo_staff', SEED_STAFF))
    const [donations, setDonations] = useState(() => load('ngo_donations', SEED_DONATIONS))
    const [expenses, setExpenses] = useState(() => load('ngo_expenses', SEED_EXPENSES))
    const [contactMessages, setContactMessages] = useState(() => load('ngo_contact_msgs', SEED_CONTACT_MSGS))
    const [hoursLog, setHoursLog] = useState(() => load('ngo_hours_log', []))

    // ── Donations ──────────────────────────────────────────────────────────
    const addDonation = useCallback((donation) => {
        setDonations(prev => {
            const receiptNo = `RCP-${String(prev.length + 1).padStart(4, '0')}`
            const newDonation = { ...donation, id: `d${Date.now()}`, receiptNo, date: new Date().toISOString().slice(0, 10) }
            const updated = [newDonation, ...prev]
            save('ngo_donations', updated)
            return updated
        })
    }, [])

    // ── Events ─────────────────────────────────────────────────────────────
    const registerForEvent = useCallback((eventId, userEmail) => {
        setEvents(prev => {
            const updated = prev.map(ev =>
                ev.id === eventId && !ev.registrations.includes(userEmail)
                    ? { ...ev, registrations: [...ev.registrations, userEmail] }
                    : ev
            )
            save('ngo_events', updated)
            return updated
        })
    }, [])

    const unregisterFromEvent = useCallback((eventId, userEmail) => {
        setEvents(prev => {
            const updated = prev.map(ev =>
                ev.id === eventId
                    ? { ...ev, registrations: ev.registrations.filter(e => e !== userEmail) }
                    : ev
            )
            save('ngo_events', updated)
            return updated
        })
    }, [])

    const addEvent = useCallback((event) => {
        setEvents(prev => {
            const newEvent = { ...event, id: `ev${Date.now()}`, registrations: [] }
            const updated = [...prev, newEvent]
            save('ngo_events', updated)
            return updated
        })
    }, [])

    const updateEvent = useCallback((id, changes) => {
        setEvents(prev => {
            const updated = prev.map(ev => ev.id === id ? { ...ev, ...changes } : ev)
            save('ngo_events', updated)
            return updated
        })
    }, [])

    // ── Hours Log ──────────────────────────────────────────────────────────
    const logHours = useCallback((entry) => {
        setHoursLog(prev => {
            const newEntry = { ...entry, id: `h${Date.now()}`, date: new Date().toISOString().slice(0, 10) }
            const updated = [newEntry, ...prev]
            save('ngo_hours_log', updated)
            return updated
        })
        // Also update volunteer hours total
        setVolunteers(prev => {
            const updated = prev.map(v =>
                v.email === entry.email
                    ? { ...v, hours: v.hours + Number(entry.hours) }
                    : v
            )
            save('ngo_volunteers', updated)
            return updated
        })
    }, [])

    // ── Volunteers ─────────────────────────────────────────────────────────
    const addVolunteer = useCallback((vol) => {
        setVolunteers(prev => {
            const newVol = { ...vol, id: `v${Date.now()}`, hours: 0, status: 'Active', joined: new Date().toISOString().slice(0, 10) }
            const updated = [...prev, newVol]
            save('ngo_volunteers', updated)
            return updated
        })
    }, [])

    const removeVolunteer = useCallback((id) => {
        setVolunteers(prev => {
            const updated = prev.filter(v => v.id !== id)
            save('ngo_volunteers', updated)
            return updated
        })
    }, [])

    const updateVolunteer = useCallback((id, changes) => {
        setVolunteers(prev => {
            const updated = prev.map(v => v.id === id ? { ...v, ...changes } : v)
            save('ngo_volunteers', updated)
            return updated
        })
    }, [])

    // ── Contact Messages ───────────────────────────────────────────────────
    const addContactMessage = useCallback((msg) => {
        setContactMessages(prev => {
            const newMsg = { ...msg, id: `cm${Date.now()}`, date: new Date().toISOString().slice(0, 10) }
            const updated = [newMsg, ...prev]
            save('ngo_contact_msgs', updated)
            return updated
        })
    }, [])

    // ── Expenses ───────────────────────────────────────────────────────────
    const addExpense = useCallback((expense) => {
        setExpenses(prev => {
            const newExp = { ...expense, id: `ex${Date.now()}`, date: new Date().toISOString().slice(0, 10) }
            const updated = [newExp, ...prev]
            save('ngo_expenses', updated)
            return updated
        })
    }, [])

    const totalDonations = donations.reduce((s, d) => s + Number(d.amount), 0)
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0)

    return (
        <AppDataContext.Provider value={{
            events, volunteers, staff, donations, expenses, contactMessages, hoursLog,
            addDonation, registerForEvent, unregisterFromEvent, addEvent, updateEvent,
            logHours, addVolunteer, removeVolunteer, updateVolunteer,
            addContactMessage, addExpense,
            totalDonations, totalExpenses,
        }}>
            {children}
        </AppDataContext.Provider>
    )
}

export function useAppData() {
    return useContext(AppDataContext)
}
