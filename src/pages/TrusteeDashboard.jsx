import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'

export default function TrusteeDashboard() {
    const { user } = useAuth()
    const {
        volunteers, staff, events, donations, expenses, contactMessages,
        signupRequests, pendingDonations,
        addEvent, updateEvent, removeVolunteer, updateVolunteer, addExpense,
        removeStaff, updateStaff,
        approveSignupRequest, rejectSignupRequest, approveDonation, rejectDonation,
        totalDonations, totalExpenses, loadTrusteeData, loadProtectedData,
    } = useAppData()

    const [activeTab, setActiveTab] = useState('overview')
    const [editTarget, setEditTarget] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [editStaffTarget, setEditStaffTarget] = useState(null)
    const [editStaffForm, setEditStaffForm] = useState({})
    const [editEventTarget, setEditEventTarget] = useState(null)
    const [editEventForm, setEditEventForm] = useState({})
    const [newEventForm, setNewEventForm] = useState({ title: '', type: 'drive', date: '', time: '', location: '', description: '', slots: 10 })
    const [showAddEvent, setShowAddEvent] = useState(false)
    const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', category: 'Food' })
    const [showAddExpense, setShowAddExpense] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        loadProtectedData()
        loadTrusteeData()
    }, [])

    const donationsByCause = donations.reduce((acc, d) => {
        acc[d.cause] = (acc[d.cause] || 0) + Number(d.amount)
        return acc
    }, {})

    const today = new Date().toISOString().slice(0, 10)
    const upcomingEvents = events.filter(ev => ev.date >= today).sort((a, b) => new Date(a.date) - new Date(b.date))
    const pastEvents = events.filter(ev => ev.date < today).sort((a, b) => new Date(b.date) - new Date(a.date))

    function flash(msg) {
        setSuccessMsg(msg)
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    async function handleEdit(e) {
        e.preventDefault()
        await updateVolunteer(editTarget._id, editForm)
        setEditTarget(null)
        flash('✅ Volunteer updated successfully.')
    }

    async function handleEditStaff(e) {
        e.preventDefault()
        await updateStaff(editStaffTarget._id, editStaffForm)
        setEditStaffTarget(null)
        flash('✅ Staff member updated successfully.')
    }

    async function handleEditEvent(e) {
        e.preventDefault()
        await updateEvent(editEventTarget._id, editEventForm)
        setEditEventTarget(null)
        flash('✅ Event updated successfully.')
    }

    async function handleAddEvent(e) {
        e.preventDefault()
        await addEvent(newEventForm)
        setNewEventForm({ title: '', type: 'drive', date: '', time: '', location: '', description: '', slots: 10 })
        setShowAddEvent(false)
        flash('✅ Event added successfully.')
    }

    async function handleAddExpense(e) {
        e.preventDefault()
        await addExpense(expenseForm)
        setExpenseForm({ description: '', amount: '', category: 'Food' })
        setShowAddExpense(false)
        flash('✅ Expense recorded.')
    }

    const tabs = [
        { id: 'overview', label: '📊 Overview' },
        { id: 'volunteers', label: '🤝 Volunteers' },
        { id: 'staff', label: '👔 Staff' },
        { id: 'events', label: '📅 Events' },
        { id: 'donations', label: '💰 Donations' },
        { id: 'expenses', label: '🧾 Expenses' },
        { id: 'messages', label: '✉️ Messages' },
        { id: 'signup-requests', label: `🙋 Signup Requests${signupRequests.length ? ` (${signupRequests.length})` : ''}` },
        { id: 'payment-requests', label: `💳 Payment Requests${pendingDonations.length ? ` (${pendingDonations.length})` : ''}` },
    ]

    return (
        <div className="page-wrapper">
            <div className="page-hero trustee-hero">
                <h1>Trustee Panel</h1>
                <p>Welcome, {user?.name}. Manage NGO Anand operations from here.</p>
            </div>

            {successMsg && <div className="success-toast dash-toast">{successMsg}</div>}

            {/* Edit Volunteer Modal */}
            {editTarget && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>✏️ Edit Volunteer</h3>
                        <form onSubmit={handleEdit}>
                            <label>Name</label>
                            <input value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                            <label>Email</label>
                            <input type="email" value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required />
                            <label>Status</label>
                            <select value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>On Leave</option>
                            </select>
                            <div className="modal-actions">
                                <button type="button" className="back-btn" onClick={() => setEditTarget(null)}>Cancel</button>
                                <button type="submit" className="auth-submit">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Staff Modal */}
            {editStaffTarget && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>✏️ Edit Staff</h3>
                        <form onSubmit={handleEditStaff}>
                            <label>Name</label>
                            <input value={editStaffForm.name || ''} onChange={e => setEditStaffForm({ ...editStaffForm, name: e.target.value })} required />
                            <label>Email</label>
                            <input type="email" value={editStaffForm.email || ''} onChange={e => setEditStaffForm({ ...editStaffForm, email: e.target.value })} required />
                            <label>Status</label>
                            <select value={editStaffForm.status || ''} onChange={e => setEditStaffForm({ ...editStaffForm, status: e.target.value })}>
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>On Leave</option>
                            </select>
                            <div className="modal-actions">
                                <button type="button" className="back-btn" onClick={() => setEditStaffTarget(null)}>Cancel</button>
                                <button type="submit" className="auth-submit">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Event Modal */}            {editEventTarget && (
                <div className="modal-overlay">
                    <div className="modal-card" style={{ maxWidth: 560 }}>
                        <h3>✏️ Edit Event</h3>
                        <form onSubmit={handleEditEvent}>
                            <div className="add-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label>Event Title</label>
                                    <input value={editEventForm.title || ''} onChange={e => setEditEventForm({ ...editEventForm, title: e.target.value })} required />
                                </div>
                                <div>
                                    <label>Type</label>
                                    <select value={editEventForm.type || 'drive'} onChange={e => setEditEventForm({ ...editEventForm, type: e.target.value })}>
                                        <option value="drive">Drive</option>
                                        <option value="camp">Camp</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Date</label>
                                    <input type="date" value={editEventForm.date || ''} onChange={e => setEditEventForm({ ...editEventForm, date: e.target.value })} required />
                                </div>
                                <div>
                                    <label>Time</label>
                                    <input placeholder="e.g. 9:00 AM – 1:00 PM" value={editEventForm.time || ''} onChange={e => setEditEventForm({ ...editEventForm, time: e.target.value })} required />
                                </div>
                                <div>
                                    <label>Max Volunteers</label>
                                    <input type="number" min="1" value={editEventForm.slots || 10} onChange={e => setEditEventForm({ ...editEventForm, slots: Number(e.target.value) })} />
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label>Location</label>
                                    <input placeholder="Venue, City" value={editEventForm.location || ''} onChange={e => setEditEventForm({ ...editEventForm, location: e.target.value })} required />
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label>Description</label>
                                    <textarea rows="2" value={editEventForm.description || ''} onChange={e => setEditEventForm({ ...editEventForm, description: e.target.value })} required />
                                </div>
                            </div>
                            <div className="modal-actions" style={{ marginTop: '1rem' }}>
                                <button type="button" className="back-btn" onClick={() => setEditEventTarget(null)}>Cancel</button>
                                <button type="submit" className="auth-submit">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="dash-tabs">
                {tabs.map(t => (
                    <button key={t.id} className={`dash-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="dash-content">

                {/* ── Overview ── */}
                {activeTab === 'overview' && (
                    <div>
                        <h2 className="dash-section-title">NGO At a Glance</h2>
                        <div className="trustee-stats">
                            <div className="tstat green"><span className="tstat-icon">💰</span><h3>₹{totalDonations.toLocaleString('en-IN')}</h3><p>Total Donations</p></div>
                            <div className="tstat red"><span className="tstat-icon">🧾</span><h3>₹{totalExpenses.toLocaleString('en-IN')}</h3><p>Total Expenses</p></div>
                            <div className="tstat blue"><span className="tstat-icon">💹</span><h3>₹{(totalDonations - totalExpenses).toLocaleString('en-IN')}</h3><p>Net Balance</p></div>
                            <div className="tstat purple"><span className="tstat-icon">🤝</span><h3>{volunteers.length}</h3><p>Volunteers</p></div>
                            <div className="tstat orange"><span className="tstat-icon">👔</span><h3>{staff?.length ?? 0}</h3><p>Staff Members</p></div>
                            <div className="tstat teal"><span className="tstat-icon">📅</span><h3>{events.length}</h3><p>Total Events</p></div>
                        </div>
                        <h2 className="dash-section-title" style={{ marginTop: '2rem' }}>Donations by Cause</h2>
                        <div className="table-wrapper">
                            <table className="dash-table">
                                <thead><tr><th>Cause</th><th>Total Raised (₹)</th></tr></thead>
                                <tbody>
                                    {Object.entries(donationsByCause).map(([cause, amt]) => (
                                        <tr key={cause}><td>{cause}</td><td><strong>₹{amt.toLocaleString('en-IN')}</strong></td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Volunteers ── */}
                {activeTab === 'volunteers' && (
                    <div>
                        <div className="dash-header-row">
                            <h2 className="dash-section-title">Volunteer Management</h2>
                        </div>
                        <div className="table-wrapper">
                            <table className="dash-table">
                                <thead>
                                    <tr><th>#</th><th>Name</th><th>Email</th><th>Hours</th><th>Events</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                                </thead>
                                <tbody>
                                    {volunteers.map((v, i) => {
                                        const evCount = events.filter(ev => ev.registrations.includes(v.email)).length
                                        return (
                                            <tr key={v._id}>
                                                <td>{i + 1}</td>
                                                <td><strong>{v.name}</strong></td>
                                                <td>{v.email}</td>
                                                <td>{v.totalHours} hrs</td>
                                                <td>{evCount}</td>
                                                <td><span className={`status-badge ${v.status === 'Active' ? 'active' : 'inactive'}`}>{v.status}</span></td>
                                                <td>{v.joined}</td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="action-btn edit" onClick={() => { setEditTarget(v); setEditForm({ name: v.name, email: v.email, status: v.status }) }}>✏️ Edit</button>
                                                        <button className="action-btn remove" onClick={() => { if (window.confirm(`Remove ${v.name} from volunteers?`)) removeVolunteer(v._id) }}>🗑️ Remove</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Staff ── */}
                {activeTab === 'staff' && (
                    <div>
                        <h2 className="dash-section-title">Staff Details</h2>
                        {(!staff || staff.length === 0) ? (
                            <div className="empty-state"><span>👔</span><p>No staff members found.</p></div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="dash-table">
                                    <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {staff.map((s, i) => (
                                            <tr key={s._id}>
                                                <td>{i + 1}</td>
                                                <td><strong>{s.name}</strong></td>
                                                <td>{s.email}</td>
                                                <td><span className={`status-badge ${s.status === 'Active' ? 'active' : 'inactive'}`}>{s.status}</span></td>
                                                <td>{s.joined}</td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="action-btn edit" onClick={() => { setEditStaffTarget(s); setEditStaffForm({ name: s.name, email: s.email, status: s.status }) }}>✏️ Edit</button>
                                                        <button className="action-btn remove" onClick={() => { if (window.confirm(`Remove ${s.name} from staff?`)) removeStaff(s._id) }}>🗑️ Remove</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Events ── */}
                {activeTab === 'events' && (
                    <div>
                        <div className="dash-header-row">
                            <h2 className="dash-section-title">Event Management</h2>
                            <button className="auth-submit add-btn" onClick={() => setShowAddEvent(!showAddEvent)}>
                                {showAddEvent ? '✕ Cancel' : '+ Add Event'}
                            </button>
                        </div>

                        {showAddEvent && (
                            <form className="add-form" onSubmit={handleAddEvent}>
                                <div className="add-form-grid">
                                    <div><label>Event Title</label><input placeholder="e.g. Blood Donation Camp" value={newEventForm.title} onChange={e => setNewEventForm({ ...newEventForm, title: e.target.value })} required /></div>
                                    <div><label>Type</label><select value={newEventForm.type} onChange={e => setNewEventForm({ ...newEventForm, type: e.target.value })}><option value="drive">Drive</option><option value="camp">Camp</option></select></div>
                                    <div><label>Date</label><input type="date" value={newEventForm.date} onChange={e => setNewEventForm({ ...newEventForm, date: e.target.value })} required /></div>
                                    <div><label>Time</label><input placeholder="e.g. 9:00 AM – 1:00 PM" value={newEventForm.time} onChange={e => setNewEventForm({ ...newEventForm, time: e.target.value })} required /></div>
                                    <div><label>Location</label><input placeholder="Venue, City" value={newEventForm.location} onChange={e => setNewEventForm({ ...newEventForm, location: e.target.value })} required /></div>
                                    <div><label>Max Volunteers</label><input type="number" min="1" value={newEventForm.slots} onChange={e => setNewEventForm({ ...newEventForm, slots: Number(e.target.value) })} /></div>
                                    <div style={{ gridColumn: '1/-1' }}><label>Description</label><textarea rows="2" value={newEventForm.description} onChange={e => setNewEventForm({ ...newEventForm, description: e.target.value })} required /></div>
                                </div>
                                <button type="submit" className="auth-submit" style={{ maxWidth: 200, marginTop: '0.5rem' }}>Create Event</button>
                            </form>
                        )}

                        <h3 style={{ margin: '2rem 0 1rem', color: '#1e40af' }}>Upcoming Events</h3>
                        {upcomingEvents.length === 0 ? <p className="empty-state">No upcoming events scheduled.</p> : (
                            upcomingEvents.map(ev => (
                                <div className="trustee-event-row" key={ev._id}>
                                    <div className="te-info">
                                        <div className="te-title">
                                            <span className={`event-badge ${ev.type}`}>{ev.type === 'drive' ? '🚗 Drive' : '🏕️ Camp'}</span>
                                            <strong>{ev.title}</strong>
                                            <button className="action-btn edit" style={{ marginLeft: 'auto' }} onClick={() => { setEditEventTarget(ev); setEditEventForm({ title: ev.title, type: ev.type, date: ev.date, time: ev.time, location: ev.location, description: ev.description, slots: ev.slots }) }}>✏️ Edit</button>
                                        </div>
                                        <p className="event-meta">📅 {ev.date} &nbsp;|&nbsp; 📍 {ev.location} &nbsp;|&nbsp; {ev.registrations.length}/{ev.slots} registered</p>
                                    </div>
                                    <div className="te-registrations">
                                        <p className="te-reg-label">Registered Volunteers:</p>
                                        {ev.registrations.length === 0 ? <span className="te-none">None yet</span> : (
                                            <div className="te-reg-list">
                                                {ev.registrations.map((email, i) => {
                                                    const vol = volunteers.find(v => v.email === email)
                                                    return <span key={i} className="reg-chip">{vol ? vol.name : email}</span>
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        <h3 style={{ margin: '3rem 0 1rem', color: '#64748b' }}>Past Events</h3>
                        {pastEvents.length === 0 ? <p className="empty-state">No past events found.</p> : (
                            pastEvents.map(ev => (
                                <div className="trustee-event-row" key={ev._id} style={{ opacity: 0.85 }}>
                                    <div className="te-info">
                                        <div className="te-title">
                                            <span className={`event-badge ${ev.type}`}>{ev.type === 'drive' ? '🚗 Drive' : '🏕️ Camp'}</span>
                                            <strong>{ev.title}</strong>
                                            <button className="action-btn edit" style={{ marginLeft: 'auto' }} onClick={() => { setEditEventTarget(ev); setEditEventForm({ title: ev.title, type: ev.type, date: ev.date, time: ev.time, location: ev.location, description: ev.description, slots: ev.slots }) }}>✏️ Edit</button>
                                        </div>
                                        <p className="event-meta">📅 {ev.date} &nbsp;|&nbsp; 📍 {ev.location} &nbsp;|&nbsp; {ev.registrations.length}/{ev.slots} registered</p>
                                    </div>
                                    <div className="te-registrations">
                                        <p className="te-reg-label">Registered Volunteers:</p>
                                        {ev.registrations.length === 0 ? <span className="te-none">None</span> : (
                                            <div className="te-reg-list">
                                                {ev.registrations.map((email, i) => {
                                                    const vol = volunteers.find(v => v.email === email)
                                                    return <span key={i} className="reg-chip">{vol ? vol.name : email}</span>
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ── Donations ── */}
                {activeTab === 'donations' && (
                    <div>
                        <h2 className="dash-section-title">All Donations</h2>
                        <div className="table-wrapper">
                            <table className="dash-table">
                                <thead><tr><th>Receipt</th><th>Donor</th><th>Email</th><th>Cause</th><th>Amount</th><th>Date</th></tr></thead>
                                <tbody>
                                    {donations.map(d => (
                                        <tr key={d._id}>
                                            <td><code>{d.receiptNo}</code></td>
                                            <td>{d.donor}</td>
                                            <td>{d.email}</td>
                                            <td>{d.cause}</td>
                                            <td><strong>₹{Number(d.amount).toLocaleString('en-IN')}</strong></td>
                                            <td>{d.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr><td colSpan="4"><strong>Total</strong></td><td colSpan="2"><strong>₹{totalDonations.toLocaleString('en-IN')}</strong></td></tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Expenses ── */}
                {activeTab === 'expenses' && (
                    <div>
                        <div className="dash-header-row">
                            <h2 className="dash-section-title">Expense Tracker</h2>
                            <button className="auth-submit add-btn" onClick={() => setShowAddExpense(!showAddExpense)}>
                                {showAddExpense ? '✕ Cancel' : '+ Add Expense'}
                            </button>
                        </div>

                        {showAddExpense && (
                            <form className="add-form" onSubmit={handleAddExpense}>
                                <div className="add-form-grid">
                                    <div><label>Description</label><input placeholder="e.g. Food supplies – April Drive" value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} required /></div>
                                    <div><label>Amount (₹)</label><input type="number" min="1" placeholder="e.g. 15000" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} required /></div>
                                    <div>
                                        <label>Category</label>
                                        <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}>
                                            <option>Food</option><option>Healthcare</option><option>Education</option><option>Operations</option><option>Transport</option><option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="auth-submit" style={{ maxWidth: 200, marginTop: '0.5rem' }}>Add Expense</button>
                            </form>
                        )}

                        <div className="table-wrapper">
                            <table className="dash-table">
                                <thead><tr><th>#</th><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead>
                                <tbody>
                                    {expenses.map((ex, i) => (
                                        <tr key={ex._id}>
                                            <td>{i + 1}</td>
                                            <td>{ex.description}</td>
                                            <td><span className="category-chip">{ex.category}</span></td>
                                            <td><strong>₹{Number(ex.amount).toLocaleString('en-IN')}</strong></td>
                                            <td>{ex.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr><td colSpan="3"><strong>Total Expenses</strong></td><td colSpan="2"><strong>₹{totalExpenses.toLocaleString('en-IN')}</strong></td></tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Messages ── */}
                {activeTab === 'messages' && (
                    <div>
                        <h2 className="dash-section-title">Contact Messages</h2>
                        {contactMessages.length === 0 ? (
                            <div className="empty-state"><span>✉️</span><p>No messages yet.</p></div>
                        ) : (
                            <div className="messages-list">
                                {contactMessages.map(msg => (
                                    <div className="message-card" key={msg._id}>
                                        <div className="msg-header">
                                            <div><strong>{msg.name}</strong><span className="msg-email">{msg.email}</span></div>
                                            <div><span className="msg-subject">{msg.subject}</span><span className="msg-date">{msg.date}</span></div>
                                        </div>
                                        <p className="msg-body">{msg.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Signup Requests ── */}
                {activeTab === 'signup-requests' && (
                    <div>
                        <h2 className="dash-section-title">Signup Requests</h2>
                        {signupRequests.length === 0 ? (
                            <div className="empty-state"><span>🙋</span><p>No pending signup requests.</p></div>
                        ) : (
                            <div className="messages-list">
                                {signupRequests.map(req => (
                                    <div className="message-card" key={req._id}>
                                        <div className="msg-header">
                                            <div>
                                                <strong>{req.name}</strong>
                                                <span className="msg-email">{req.email}</span>
                                            </div>
                                            <div>
                                                <span className="category-chip">{req.role}</span>
                                                <span className="msg-date">{req.joined}</span>
                                            </div>
                                        </div>
                                        <div className="request-actions">
                                            <button
                                                className="action-btn edit"
                                                style={{ background: '#059669', color: '#fff', border: 'none' }}
                                                onClick={async () => {
                                                    await approveSignupRequest(req._id)
                                                    flash(`✅ ${req.name} approved as ${req.role}.`)
                                                }}
                                            >✅ Approve</button>
                                            <button
                                                className="action-btn remove"
                                                onClick={async () => {
                                                    if (window.confirm(`Reject ${req.name}'s request?`)) {
                                                        await rejectSignupRequest(req._id)
                                                        flash(`❌ ${req.name}'s request rejected.`)
                                                    }
                                                }}
                                            >❌ Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Payment Requests ── */}
                {activeTab === 'payment-requests' && (
                    <div>
                        <h2 className="dash-section-title">Pending Payment Requests</h2>
                        {pendingDonations.length === 0 ? (
                            <div className="empty-state"><span>💳</span><p>No pending payment requests.</p></div>
                        ) : (
                            <div className="messages-list">
                                {pendingDonations.map(don => (
                                    <div className="message-card" key={don._id}>
                                        <div className="msg-header">
                                            <div>
                                                <strong>{don.donor}</strong>
                                                <span className="msg-email">{don.email}</span>
                                            </div>
                                            <div>
                                                <span className="category-chip">{don.cause}</span>
                                                <span className="msg-date">{don.date}</span>
                                            </div>
                                        </div>
                                        <div style={{ padding: '0.5rem 0', color: '#475569', fontSize: '0.9rem' }}>
                                            <span>Amount: <strong>₹{Number(don.amount).toLocaleString('en-IN')}</strong></span>
                                            {don.upiId && <span style={{ marginLeft: '1.5rem' }}>UPI ID: <code>{don.upiId}</code></span>}
                                        </div>
                                        <div className="request-actions">
                                            <button
                                                className="action-btn edit"
                                                style={{ background: '#059669', color: '#fff', border: 'none' }}
                                                onClick={async () => {
                                                    await approveDonation(don._id)
                                                    flash(`✅ Donation of ₹${don.amount} by ${don.donor} approved.`)
                                                }}
                                            >✅ Approve</button>
                                            <button
                                                className="action-btn remove"
                                                onClick={async () => {
                                                    if (window.confirm(`Reject donation from ${don.donor}?`)) {
                                                        await rejectDonation(don._id)
                                                        flash(`❌ Donation rejected.`)
                                                    }
                                                }}
                                            >❌ Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
