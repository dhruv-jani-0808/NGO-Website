import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLES = ['Donor', 'Volunteer', 'Trustee', 'Staff']
const RESTRICTED_ROLES = ['Volunteer', 'Trustee', 'Staff']
const SECRET_KEY = 'samaj seva e j prabhu seva'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Where to go after login — if came from a protected page, go back there; else home
    const from = location.state?.from || '/'

    const [tab, setTab] = useState('login')

    // Login form state
    const [loginData, setLoginData] = useState({ email: '', password: '', role: 'Donor' })
    const [loginError, setLoginError] = useState('')

    // Signup form state
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirm: '', role: 'Donor', secretKey: '' })
    const [signupError, setSignupError] = useState('')
    const [requestSent, setRequestSent] = useState(false)

    const needsSecretKey = RESTRICTED_ROLES.includes(signupData.role)

    // --- Login ---
    function handleLogin(e) {
        e.preventDefault()
        setLoginError('')
        if (!loginData.email || !loginData.password) {
            setLoginError('Please fill in all fields.')
            return
        }
        // Simulate login (replace with real API call later)
        login({ name: loginData.email.split('@')[0], email: loginData.email, role: loginData.role })
        navigate(from, { replace: true })
    }

    // --- Signup ---
    function handleSignup(e) {
        e.preventDefault()
        setSignupError('')
        if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirm) {
            setSignupError('Please fill in all fields.')
            return
        }
        if (signupData.password !== signupData.confirm) {
            setSignupError('Passwords do not match.')
            return
        }
        if (signupData.password.length < 6) {
            setSignupError('Password must be at least 6 characters.')
            return
        }
        // Restricted roles need a secret key — send request instead of auto-login
        if (needsSecretKey) {
            if (!signupData.secretKey.trim()) {
                setSignupError('Please enter the secret key for this role.')
                return
            }
            if (signupData.secretKey.trim().toLowerCase() !== SECRET_KEY) {
                setSignupError('❌ Incorrect secret key. Please contact the founders.')
                return
            }
            setRequestSent(true)
            return
        }
        // Donor / Staff — auto-login directly
        login({ name: signupData.name, email: signupData.email, role: signupData.role })
        navigate(from, { replace: true })
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🏡</div>
                <h2>NGO Anand</h2>
                <p className="auth-sub">Welcome! Please sign in or create an account.</p>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => { setTab('login'); setLoginError('') }}
                    >
                        Login
                    </button>
                    <button
                        className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
                        onClick={() => { setTab('signup'); setSignupError('') }}
                    >
                        Sign Up
                    </button>
                </div>

                {/* LOGIN FORM */}
                {tab === 'login' && (
                    <form className="auth-form" onSubmit={handleLogin}>
                        <label>Role</label>
                        <select
                            value={loginData.role}
                            onChange={e => setLoginData({ ...loginData, role: e.target.value })}
                        >
                            {ROLES.map(r => <option key={r}>{r}</option>)}
                        </select>

                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={loginData.email}
                            onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                        />

                        {loginError && <p className="auth-error">{loginError}</p>}

                        <button type="submit" className="auth-submit">Login</button>

                        <p className="auth-switch">
                            Don't have an account?{' '}
                            <button type="button" className="auth-link" onClick={() => setTab('signup')}>Sign Up</button>
                        </p>
                    </form>
                )}

                {/* SIGNUP FORM */}
                {tab === 'signup' && !requestSent && (
                    <form className="auth-form" onSubmit={handleSignup}>
                        <label>I am a</label>
                        <select
                            value={signupData.role}
                            onChange={e => setSignupData({ ...signupData, role: e.target.value, secretKey: '' })}
                        >
                            {ROLES.map(r => <option key={r}>{r}</option>)}
                        </select>

                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={signupData.name}
                            onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={signupData.email}
                            onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Min. 6 characters"
                            value={signupData.password}
                            onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                        />

                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Repeat password"
                            value={signupData.confirm}
                            onChange={e => setSignupData({ ...signupData, confirm: e.target.value })}
                        />

                        {/* Secret key — only for Trustee, Volunteer, Partner */}
                        {needsSecretKey && (
                            <>
                                <div className="secret-key-notice">
                                    🔐 <strong>{signupData.role}</strong> role requires a secret key.
                                    Contact our founders to receive it.
                                </div>
                                <label>Secret Key</label>
                                <input
                                    type="password"
                                    placeholder="Enter secret key"
                                    value={signupData.secretKey}
                                    onChange={e => setSignupData({ ...signupData, secretKey: e.target.value })}
                                />
                            </>
                        )}

                        {signupError && <p className="auth-error">{signupError}</p>}

                        <button type="submit" className="auth-submit">Create Account</button>

                        <p className="auth-switch">
                            Already have an account?{' '}
                            <button type="button" className="auth-link" onClick={() => setTab('login')}>Login</button>
                        </p>
                    </form>
                )}

                {/* REQUEST SENT SCREEN */}
                {tab === 'signup' && requestSent && (
                    <div className="request-sent">
                        <div className="request-icon">📨</div>
                        <h3>Request Submitted!</h3>
                        <p>
                            Your request to join as a <strong>{signupData.role}</strong> has been sent to our founder,
                            <strong> Dhruvil Gandhi & Dhruv Jani</strong>.
                        </p>
                        <p className="request-eta">⏳ They will review your request within a few hours and get back to you at <strong>{signupData.email}</strong>.</p>
                        <button
                            className="auth-submit"
                            style={{ marginTop: '1rem' }}
                            onClick={() => { setRequestSent(false); setSignupData({ name: '', email: '', password: '', confirm: '', role: 'Donor', secretKey: '' }) }}
                        >
                            Back to Sign Up
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
