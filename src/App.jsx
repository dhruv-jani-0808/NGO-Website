import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppDataProvider } from './context/AppDataContext'
import Home from './pages/Home'
import About from './pages/About'
import Donate from './pages/Donate'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Blog from './pages/Blog'
import VolunteerDashboard from './pages/VolunteerDashboard'
import TrusteeDashboard from './pages/TrusteeDashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import './App.css'

// Protects routes — if not logged in, redirect to /login
function ProtectedRoute({ children, allowedRoles }) {
    const { isLoggedIn, user } = useAuth()
    const location = useLocation()
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />
    }
    return children
}

function Navbar() {
    const { isLoggedIn, user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false)
    }, [location.pathname])

    // Close menu when clicking outside
    useEffect(() => {
        if (!menuOpen) return
        function handleClick(e) {
            if (!e.target.closest('nav')) setMenuOpen(false)
        }
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [menuOpen])

    function handleLogout() {
        logout()
        navigate('/')
        setMenuOpen(false)
    }

    function close() { setMenuOpen(false) }

    return (
        <nav>
            {/* Brand */}
            <Link to="/" className="nav-brand-link" onClick={close}>
                <span className="nav-brand">🏡 NGO Anand</span>
            </Link>

            {/* Hamburger button — only visible on mobile */}
            <button
                className={`hamburger ${menuOpen ? 'open' : ''}`}
                onClick={(e) => { e.stopPropagation(); setMenuOpen(m => !m) }}
                aria-label="Toggle navigation"
                aria-expanded={menuOpen}
            >
                <span />
                <span />
                <span />
            </button>

            {/* Nav links */}
            <ul className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
                <li><Link to="/" onClick={close}>Home</Link></li>
                <li><Link to="/about" onClick={close}>About</Link></li>
                <li><Link to="/blog" onClick={close}>News & Events</Link></li>
                <li><Link to="/donate" onClick={close}>Donate</Link></li>
                <li><Link to="/contact" onClick={close}>Contact</Link></li>

                {isLoggedIn && user?.role === 'Volunteer' && (
                    <li><Link to="/volunteer" className="role-nav-link vol-link" onClick={close}>🤝 My Dashboard</Link></li>
                )}
                {isLoggedIn && user?.role === 'Trustee' && (
                    <li><Link to="/trustee" className="role-nav-link trustee-link" onClick={close}>⚙️ Admin Panel</Link></li>
                )}

                {isLoggedIn ? (
                    <>
                        <li><Link to="/profile" className="role-nav-link profile-link" onClick={close}>👤 {user?.name}</Link></li>
                        <li>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                ) : (
                    <li><Link to="/login" className="login-btn" onClick={close}>Login / Sign Up</Link></li>
                )}
            </ul>
        </nav>
    )
}

function AppLayout() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/donate"
                    element={
                        <ProtectedRoute>
                            <Donate />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/volunteer"
                    element={
                        <ProtectedRoute allowedRoles={['Volunteer']}>
                            <VolunteerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/trustee"
                    element={
                        <ProtectedRoute allowedRoles={['Trustee']}>
                            <TrusteeDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                {/* 404 — catch all unmatched routes */}
                <Route path="*" element={<NotFound />} />
            </Routes>
            <footer>
                <div className="footer-grid">
                    <div className="footer-col">
                        <div className="footer-brand">🏡 NGO Anand</div>
                        <p className="footer-tagline">Uplifting communities in Anand, Gujarat since 2010.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/blog">News & Events</Link></li>
                            <li><Link to="/donate">Donate</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <p>📍 Station Road, Anand, Gujarat – 388001</p>
                        <p>📞 +91 76008 08675</p>
                        <p>📧 <a href="mailto:contact@ngoanand.org">contact@ngoanand.org</a></p>
                        <p>🕐 Mon – Sat: 9 AM – 6 PM</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 NGO Anand. All rights reserved. | Photos: Unsplash</p>
                </div>
            </footer>
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppDataProvider>
                    <AppLayout />
                </AppDataProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}
