import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL
const AppDataContext = createContext(null)

function getToken() {
    return localStorage.getItem('ngo_token')
}

function authHeaders() {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
}

async function apiFetch(path, options = {}) {
    const res = await fetch(`${API}${path}`, options)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Request failed')
    return data
}

export function AppDataProvider({ children }) {
    const [events, setEvents] = useState([])
    const [volunteers, setVolunteers] = useState([])
    const [staff, setStaff] = useState([])
    const [donations, setDonations] = useState([])
    const [expenses, setExpenses] = useState([])
    const [contactMessages, setContactMessages] = useState([])
    const [hoursLog, setHoursLog] = useState([])
    const [signupRequests, setSignupRequests] = useState([])
    const [pendingDonations, setPendingDonations] = useState([])

    // ── Load public data on mount ──────────────────────────────────────────
    useEffect(() => {
        apiFetch('/events').then(setEvents).catch(console.error)
    }, [])

    // ── Load protected data when token is available ────────────────────────
    const loadProtectedData = useCallback(async () => {
        const token = getToken()
        if (!token) return
        try {
            const [don, hrs] = await Promise.all([
                apiFetch('/donations', { headers: authHeaders() }),
                apiFetch('/hours', { headers: authHeaders() }),
            ])
            setDonations(don)
            setHoursLog(hrs)
        } catch (err) {
            console.error('Failed to load protected data:', err)
        }
    }, [])

    const loadTrusteeData = useCallback(async () => {
        const token = getToken()
        if (!token) return
        try {
            const [vols, stf, exp, msgs, sigReqs, pendDons] = await Promise.all([
                apiFetch('/users/volunteers', { headers: authHeaders() }),
                apiFetch('/users/staff', { headers: authHeaders() }),
                apiFetch('/expenses', { headers: authHeaders() }),
                apiFetch('/contact/messages', { headers: authHeaders() }),
                apiFetch('/auth/signup-requests', { headers: authHeaders() }),
                apiFetch('/donations/pending', { headers: authHeaders() }),
            ])
            setVolunteers(vols)
            setStaff(stf)
            setExpenses(exp)
            setContactMessages(msgs)
            setSignupRequests(sigReqs)
            setPendingDonations(pendDons)
        } catch (err) {
            console.error('Failed to load trustee data:', err)
        }
    }, [])

    // ── Donations ──────────────────────────────────────────────────────────
    const addDonation = useCallback(async (donation) => {
        const newDon = await apiFetch('/donations', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(donation),
        })
        setDonations(prev => [newDon, ...prev])
        return newDon
    }, [])

    // ── Events ─────────────────────────────────────────────────────────────
    const registerForEvent = useCallback(async (eventId, _userEmail) => {
        const updated = await apiFetch(`/events/${eventId}/register`, {
            method: 'POST',
            headers: authHeaders(),
        })
        setEvents(prev => prev.map(ev => ev._id === eventId ? updated : ev))
    }, [])

    const unregisterFromEvent = useCallback(async (eventId, _userEmail) => {
        const updated = await apiFetch(`/events/${eventId}/register`, {
            method: 'DELETE',
            headers: authHeaders(),
        })
        setEvents(prev => prev.map(ev => ev._id === eventId ? updated : ev))
    }, [])

    const addEvent = useCallback(async (event) => {
        const newEvent = await apiFetch('/events', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(event),
        })
        setEvents(prev => [...prev, newEvent])
    }, [])

    const updateEvent = useCallback(async (id, changes) => {
        const updated = await apiFetch(`/events/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(changes),
        })
        setEvents(prev => prev.map(ev => ev._id === id ? updated : ev))
    }, [])

    const removeEvent = useCallback(async (id) => {
        await apiFetch(`/events/${id}`, { method: 'DELETE', headers: authHeaders() })
        setEvents(prev => prev.filter(ev => ev._id !== id))
    }, [])

    // ── Hours Log ──────────────────────────────────────────────────────────
    const logHours = useCallback(async (entry) => {
        const newEntry = await apiFetch('/hours', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(entry),
        })
        setHoursLog(prev => [newEntry, ...prev])
        // Update volunteer hours locally
        setVolunteers(prev =>
            prev.map(v => v.email === entry.email ? { ...v, totalHours: (v.totalHours || 0) + Number(entry.hours) } : v)
        )
    }, [])

    // ── Volunteers ─────────────────────────────────────────────────────────
    const removeVolunteer = useCallback(async (id) => {
        await apiFetch(`/users/${id}`, { method: 'DELETE', headers: authHeaders() })
        setVolunteers(prev => prev.filter(v => v._id !== id))
    }, [])

    const updateVolunteer = useCallback(async (id, changes) => {
        const updated = await apiFetch(`/users/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(changes),
        })
        setVolunteers(prev => prev.map(v => v._id === id ? updated : v))
    }, [])

    // ── Staff ──────────────────────────────────────────────────────────────
    const removeStaff = useCallback(async (id) => {
        await apiFetch(`/users/${id}`, { method: 'DELETE', headers: authHeaders() })
        setStaff(prev => prev.filter(s => s._id !== id))
    }, [])

    const updateStaff = useCallback(async (id, changes) => {
        const updated = await apiFetch(`/users/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(changes),
        })
        setStaff(prev => prev.map(s => s._id === id ? updated : s))
    }, [])

    // ── Contact Messages ───────────────────────────────────────────────────
    const addContactMessage = useCallback(async (msg) => {
        await apiFetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg),
        })
    }, [])

    // ── Expenses ───────────────────────────────────────────────────────────
    const addExpense = useCallback(async (expense) => {
        const newExp = await apiFetch('/expenses', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(expense),
        })
        setExpenses(prev => [newExp, ...prev])
    }, [])

    // ── Signup Requests ────────────────────────────────────────────────────
    const approveSignupRequest = useCallback(async (id) => {
        const updated = await apiFetch(`/auth/signup-requests/${id}/approve`, { method: 'PATCH', headers: authHeaders() })
        setSignupRequests(prev => prev.filter(r => r._id !== id))
        // Add to volunteers or staff list
        if (updated.role === 'Volunteer') setVolunteers(prev => [...prev, updated])
        if (updated.role === 'Staff') setStaff(prev => [...prev, updated])
        return updated
    }, [])

    const rejectSignupRequest = useCallback(async (id) => {
        await apiFetch(`/auth/signup-requests/${id}/reject`, { method: 'PATCH', headers: authHeaders() })
        setSignupRequests(prev => prev.filter(r => r._id !== id))
    }, [])

    // ── Pending Donations ──────────────────────────────────────────────────
    const approveDonation = useCallback(async (id) => {
        const approved = await apiFetch(`/donations/${id}/approve`, { method: 'PATCH', headers: authHeaders() })
        setPendingDonations(prev => prev.filter(d => d._id !== id))
        setDonations(prev => [approved, ...prev])
        return approved
    }, [])

    const rejectDonation = useCallback(async (id) => {
        await apiFetch(`/donations/${id}/reject`, { method: 'PATCH', headers: authHeaders() })
        setPendingDonations(prev => prev.filter(d => d._id !== id))
    }, [])

    const totalDonations = donations.reduce((s, d) => s + Number(d.amount), 0)
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0)

    return (
        <AppDataContext.Provider value={{
            events, volunteers, staff, donations, expenses, contactMessages, hoursLog,
            signupRequests, pendingDonations,
            addDonation, registerForEvent, unregisterFromEvent, addEvent, updateEvent, removeEvent,
            logHours, removeVolunteer, updateVolunteer, removeStaff, updateStaff,
            addContactMessage, addExpense,
            approveSignupRequest, rejectSignupRequest,
            approveDonation, rejectDonation,
            totalDonations, totalExpenses,
            loadProtectedData, loadTrusteeData,
        }}>
            {children}
        </AppDataContext.Provider>
    )
}

export function useAppData() {
    return useContext(AppDataContext)
}
