import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'

const ROLES = ['Donor', 'Volunteer', 'Trustee', 'Staff']
const RESTRICTED_ROLES = ['Volunteer', 'Trustee', 'Staff']

export default function Login() {
    const { apiLogin, apiRegister } = useAuth()
    const { loadProtectedData, loadTrusteeData } = useAppData()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from || '/'

    const [tab, setTab] = useState('login')
    const [loading, setLoading] = useState(false)
    const [pendingScreen, setPendingScreen] = useState(null) // { role, email }

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [loginError, setLoginError] = useState('')

    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirm: '', role: 'Donor', secretKey: '' })
    const [signupError, setSignupError] = useState('')

    const needsSecretKey = RESTRICTED_ROLES.includes(signupData.role)

    async function handleLogin(e) {
        e.preventDefault()
        setLoginError('')
        if (!loginData.email || !loginData.password) {
            setLoginError('Please fill in all fields.')
            return
        }
        setLoading(true)
        try {
            const user = await apiLogin(loginData.email, loginData.password)
            await loadProtectedData()
            if (user.role === 'Trustee') await loadTrusteeData()
            navigate(from, { replace: true })
        } catch (err) {
            // Show pending screen if account is awaiting approval
            if (err.pending) {
                setPendingScreen({ role: 'your role', email: loginData.email })
            } else {
                setLoginError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function handleSignup(e) {
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
        if (needsSecretKey && !signupData.secretKey.trim()) {
            setSignupError('Please enter the secret key for this role.')
            return
        }
        setLoading(true)
        try {
            const result = await apiRegister(signupData)
            if (result.pending) {
                setPendingScreen({ role: signupData.role, email: signupData.email })
                return
            }
            await loadProtectedData()
            if (result.role === 'Trustee') await loadTrusteeData()
            navigate(from, { replace: true })
        } catch (err) {
            setSignupError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🏡</div>
                <h2>NGO Anand</h2>
                <p className="auth-sub">Welcome! Please sign in or create an account.</p>

                {/* Pending approval screen */}
                {pendingScreen && (
                    <div className="request-sent">
                        <div className="request-icon">📨</div>
                        <h3>Request Submitted!</h3>
                        <p>Your request to join as <strong>{pendingScreen.role}</strong> has been sent to our founders,</p>
                        <p><strong>Dhruv Jani & Dhruvil Gandhi</strong>.</p>
                        <p className="request-eta">⏳ They will review and respond to <strong>{pendingScreen.email}</strong> shortly.</p>
                        <button className="auth-submit" style={{ marginTop: '1rem' }} onClick={() => { setPendingScreen(null); setTab('login') }}>
                            Back to Login
                        </button>
                    </div>
                )}

                {!pendingScreen && <>
                <div className="auth-tabs">
                    <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setLoginError('') }}>Login</button>
                    <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setSignupError('') }}>Sign Up</button>
                </div>

                {tab === 'login' && (
                    <form className="auth-form" onSubmit={handleLogin}>
                        <label>Email</label>
                        <input type="email" placeholder="you@example.com" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} />

                        <label>Password</label>
                        <input type="password" placeholder="••••••••" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />

                        {loginError && <p className="auth-error">{loginError}</p>}
                        <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>

                        <p className="auth-switch">Don't have an account?{' '}
                            <button type="button" className="auth-link" onClick={() => setTab('signup')}>Sign Up</button>
                        </p>
                    </form>
                )}

                {tab === 'signup' && (
                    <form className="auth-form" onSubmit={handleSignup}>
                        <label>I am a</label>
                        <select value={signupData.role} onChange={e => setSignupData({ ...signupData, role: e.target.value, secretKey: '' })}>
                            {ROLES.map(r => <option key={r}>{r}</option>)}
                        </select>

                        <label>Full Name</label>
                        <input type="text" placeholder="Your name" value={signupData.name} onChange={e => setSignupData({ ...signupData, name: e.target.value })} />

                        <label>Email</label>
                        <input type="email" placeholder="you@example.com" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} />

                        <label>Password</label>
                        <input type="password" placeholder="Min. 6 characters" value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })} />

                        <label>Confirm Password</label>
                        <input type="password" placeholder="Repeat password" value={signupData.confirm} onChange={e => setSignupData({ ...signupData, confirm: e.target.value })} />

                        {needsSecretKey && (
                            <>
                                <div className="secret-key-notice">
                                    🔐 <strong>{signupData.role}</strong> role requires a secret key. Contact our founders to receive it.
                                </div>
                                <label>Secret Key</label>
                                <input type="password" placeholder="Enter secret key" value={signupData.secretKey} onChange={e => setSignupData({ ...signupData, secretKey: e.target.value })} />
                            </>
                        )}

                        {signupError && <p className="auth-error">{signupError}</p>}
                        <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Creating account…' : 'Create Account'}</button>

                        <p className="auth-switch">Already have an account?{' '}
                            <button type="button" className="auth-link" onClick={() => setTab('login')}>Login</button>
                        </p>
                    </form>
                )}
                </>}
            </div>
        </div>
    )
}
