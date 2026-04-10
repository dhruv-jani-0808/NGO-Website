import { createContext, useContext, useState } from 'react'

const API = import.meta.env.VITE_API_URL
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('ngo_user')
        return saved ? JSON.parse(saved) : null
    })

    // Called after successful login/register — stores user + token
    const login = (userData, token) => {
        if (token) localStorage.setItem('ngo_token', token)
        localStorage.setItem('ngo_user', JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('ngo_user')
        localStorage.removeItem('ngo_token')
        setUser(null)
    }

    // API: login with email + password
    const apiLogin = async (email, password) => {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (data.pending) {
            const err = new Error(data.message)
            err.pending = true
            throw err
        }
        if (!res.ok) throw new Error(data.message || 'Login failed')
        login(data.user, data.token)
        return data.user
    }

    // API: register new user
    const apiRegister = async ({ name, email, password, role, secretKey }) => {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, secretKey }),
        })
        const data = await res.json()
        if (data.pending) return { pending: true } // restricted role — awaiting approval
        if (!res.ok) throw new Error(data.message || 'Registration failed')
        login(data.user, data.token)
        return data.user
    }

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, apiLogin, apiRegister }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
