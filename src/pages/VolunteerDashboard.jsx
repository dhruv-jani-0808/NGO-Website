import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'

export default function VolunteerDashboard() {
    const { user } = useAuth()
    const { events, hoursLog, registerForEvent, unregisterFromEvent, logHours, loadProtectedData } = useAppData()

    const [activeTab, setActiveTab] = useState('events')
    const [logForm, setLogForm] = useState({ eventId: '', hours: '', note: '' })
    const [logSuccess, setLogSuccess] = useState(false)
    const [confirmCancel, setConfirmCancel] = useState(null)

    useEffect(() => { loadProtectedData() }, [])

    const today = new Date().toISOString().slice(0, 10)
    const upcomingEvents = events.filter(ev => ev.date >= today)
    const myRegistrations = upcomingEvents.filter(ev => ev.registrations.includes(user?.email))
    const myHours = hoursLog.filter(h => h.email === user?.email)
    const totalHours = myHours.reduce((s, h) => s + Number(h.hours), 0)

    async function handleLogHours(e) {
        e.preventDefault()
        if (!logForm.eventId || !logForm.hours || Number(logForm.hours) <= 0) return
        const ev = events.find(e => e._id === logForm.eventId)
        await logHours({
            name: user.name,
            eventId: logForm.eventId,
            eventTitle: ev?.title || 'Unknown Event',
            hours: Number(logForm.hours),
            note: logForm.note,
        })
        setLogForm({ eventId: '', hours: '', note: '' })
        setLogSuccess(true)
        setTimeout(() => setLogSuccess(false), 3000)
    }

    const tabs = [
        { id: 'events', label: '📅 Upcoming Events' },
        { id: 'myevents', label: '✅ My Registrations' },
        { id: 'loghours', label: '⏱️ Log Hours' },
        { id: 'history', label: '📊 Hours History' },
    ]

    return (
        <div className="page-wrapper">
            <div className="page-hero vol-hero">
                <h1>Volunteer Dashboard</h1>
                <p>Welcome back, {user?.name}! You're making a difference. 🌟</p>
            </div>

            <div className="vol-stats">
                <div className="vol-stat-card">
                    <span className="vol-stat-icon">⏱️</span>
                    <div><h3>{totalHours}</h3><p>Total Hours Logged</p></div>
                </div>
                <div className="vol-stat-card">
                    <span className="vol-stat-icon">📅</span>
                    <div><h3>{myRegistrations.length}</h3><p>Events Registered</p></div>
                </div>
                <div className="vol-stat-card">
                    <span className="vol-stat-icon">👤</span>
                    <div><h3>{user?.name}</h3><p>{user?.email}</p></div>
                </div>
            </div>

            <div className="dash-tabs">
                {tabs.map(t => (
                    <button key={t.id} className={`dash-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {confirmCancel && (
                <div className="modal-overlay">
                    <div className="modal-card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>❌</div>
                        <h3>Cancel Registration?</h3>
                        <p style={{ color: '#475569', margin: '0.8rem 0 1.2rem' }}>
                            Are you sure you want to cancel your registration for<br />
                            <strong>{confirmCancel.eventTitle}</strong>?
                        </p>
                        <div className="modal-actions" style={{ justifyContent: 'center' }}>
                            <button className="back-btn" onClick={() => setConfirmCancel(null)}>Keep Registration</button>
                            <button
                                className="auth-submit"
                                style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}
                                onClick={() => { unregisterFromEvent(confirmCancel.eventId, user.email); setConfirmCancel(null) }}
                            >Yes, Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="dash-content">
                {activeTab === 'events' && (
                    <div>
                        <h2 className="dash-section-title">Upcoming Events</h2>
                        <div className="event-cards-grid">
                            {upcomingEvents.map(ev => {
                                const isReg = ev.registrations.includes(user?.email)
                                const isFull = ev.registrations.length >= ev.slots
                                return (
                                    <div className="event-card" key={ev._id}>
                                        <div className={`event-badge ${ev.type}`}>{ev.type === 'drive' ? '🚗 Drive' : '🏕️ Camp'}</div>
                                        <h3>{ev.title}</h3>
                                        <p className="event-meta">📅 {ev.date} &nbsp;|&nbsp; 🕐 {ev.time}</p>
                                        <p className="event-meta">📍 {ev.location}</p>
                                        <p className="event-desc">{ev.description}</p>
                                        <div className="event-footer">
                                            <span className="event-slots">{ev.registrations.length}/{ev.slots} volunteers</span>
                                            {isReg ? (
                                                <button className="ev-btn ev-unreg" onClick={() => setConfirmCancel({ eventId: ev._id, eventTitle: ev.title })}>
                                                    ✅ Registered — Cancel
                                                </button>
                                            ) : (
                                                <button className={`ev-btn ev-reg ${isFull ? 'disabled' : ''}`} disabled={isFull} onClick={() => registerForEvent(ev._id, user.email)}>
                                                    {isFull ? 'Full' : 'Register →'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'myevents' && (
                    <div>
                        <h2 className="dash-section-title">My Registered Events</h2>
                        {myRegistrations.length === 0 ? (
                            <div className="empty-state">
                                <span>📅</span>
                                <p>You haven't registered for any events yet.</p>
                                <button className="ev-btn ev-reg" onClick={() => setActiveTab('events')}>Browse Events →</button>
                            </div>
                        ) : (
                            <div className="event-cards-grid">
                                {myRegistrations.map(ev => (
                                    <div className="event-card reg-card" key={ev._id}>
                                        <div className={`event-badge ${ev.type}`}>{ev.type === 'drive' ? '🚗 Drive' : '🏕️ Camp'}</div>
                                        <h3>{ev.title}</h3>
                                        <p className="event-meta">📅 {ev.date} &nbsp;|&nbsp; 🕐 {ev.time}</p>
                                        <p className="event-meta">📍 {ev.location}</p>
                                        <button className="ev-btn ev-unreg" style={{ marginTop: '0.8rem' }} onClick={() => setConfirmCancel({ eventId: ev._id, eventTitle: ev.title })}>
                                            Cancel Registration
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'loghours' && (
                    <div style={{ maxWidth: 520 }}>
                        <h2 className="dash-section-title">Log Your Hours</h2>
                        {logSuccess && <div className="success-toast">✅ Hours logged successfully!</div>}
                        <form className="log-hours-form" onSubmit={handleLogHours}>
                            <label>Select Event</label>
                            <select value={logForm.eventId} onChange={e => setLogForm({ ...logForm, eventId: e.target.value })} required>
                                <option value="">-- Choose an event --</option>
                                {events.map(ev => (
                                    <option key={ev._id} value={ev._id}>{ev.title} ({ev.date})</option>
                                ))}
                            </select>

                            <label>Hours Worked</label>
                            <input type="number" min="0.5" step="0.5" placeholder="e.g. 3.5" value={logForm.hours} onChange={e => setLogForm({ ...logForm, hours: e.target.value })} required />

                            <label>Note (optional)</label>
                            <textarea rows="3" placeholder="What did you do during this session?" value={logForm.note} onChange={e => setLogForm({ ...logForm, note: e.target.value })} />

                            <button type="submit" className="auth-submit">Submit Hours</button>
                        </form>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div>
                        <h2 className="dash-section-title">Hours History <span className="total-badge">Total: {totalHours} hrs</span></h2>
                        {myHours.length === 0 ? (
                            <div className="empty-state"><span>⏱️</span><p>No hours logged yet. Start contributing!</p></div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="dash-table">
                                    <thead><tr><th>#</th><th>Event</th><th>Hours</th><th>Date</th><th>Note</th></tr></thead>
                                    <tbody>
                                        {myHours.map((h, i) => (
                                            <tr key={h._id}><td>{i + 1}</td><td>{h.eventTitle}</td><td><strong>{h.hours} hrs</strong></td><td>{h.date}</td><td>{h.note || '—'}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
