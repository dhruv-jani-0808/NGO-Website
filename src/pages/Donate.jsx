import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'

const CAUSES = [
    { id: 'food', icon: '🍱', label: 'Food Distribution', desc: 'Help us feed hungry families in Anand.' },
    { id: 'edu', icon: '📚', label: 'Education Fund', desc: 'Support school supplies and scholarships.' },
    { id: 'health', icon: '🏥', label: 'Healthcare Drive', desc: 'Fund medical camps and health kits.' },
    { id: 'relief', icon: '🌧️', label: 'Disaster Relief', desc: 'Aid communities during floods & disasters.' },
]

const UPI_ID = 'ngoanand@paytm'
const UPI_NAME = 'NGO Anand'

export default function Donate() {
    const { user } = useAuth()
    const { addDonation } = useAppData()

    // step 1 = select cause/amount, 2 = payment, 3 = pending confirmation
    const [step, setStep] = useState(1)
    const [selectedCause, setSelectedCause] = useState('food')
    const [amount, setAmount] = useState('')
    const [custom, setCustom] = useState('')
    const [upiId, setUpiId] = useState('')
    const [upiError, setUpiError] = useState('')
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)

    const presets = [100, 250, 500, 1000, 2500]
    const finalAmount = amount || custom
    const causeLabel = CAUSES.find(c => c.id === selectedCause)?.label

    function handleProceed(e) {
        e.preventDefault()
        if (!finalAmount || isNaN(finalAmount) || Number(finalAmount) <= 0) return
        setStep(2)
    }

    async function handlePaymentDone() {
        if (!upiId.trim()) {
            setUpiError('Please enter your UPI ID so we can verify your payment.')
            return
        }
        setUpiError('')
        setLoading(true)
        try {
            await addDonation({
                amount: Number(finalAmount),
                cause: causeLabel,
                donor: user?.name,
                email: user?.email,
                upiId: upiId.trim(),
            })
            setStep(3)
        } catch (err) {
            setUpiError(err.message || 'Failed to submit. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    function copyUPI() {
        navigator.clipboard.writeText(UPI_ID)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // ── STEP 3: Pending Confirmation ───────────────────────────────────────
    if (step === 3) {
        return (
            <div className="page-wrapper">
                <div className="thankyou-page">
                    <div className="thankyou-icon">⏳</div>
                    <h2>Payment Under Review</h2>
                    <p>
                        Your donation of <strong>₹{finalAmount}</strong> towards <strong>{causeLabel}</strong> has been submitted.
                    </p>
                    <div className="pending-info-box">
                        <p>📋 Your payment request has been sent to our founders</p>
                        <p><strong>Dhruv Jani & Dhruvil Gandhi</strong></p>
                        <p>They will verify your UPI payment and approve it shortly.</p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                            Once approved, the receipt will appear in your Profile page.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                        <button className="auth-submit" style={{ maxWidth: 200 }} onClick={() => { setStep(1); setAmount(''); setCustom(''); setUpiId('') }}>
                            Donate Again
                        </button>
                        <a href="/profile" className="auth-submit" style={{ maxWidth: 220, textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                            View My Profile 👤
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    // ── STEP 2: Payment Page ───────────────────────────────────────────────
    if (step === 2) {
        return (
            <div className="page-wrapper">
                <div className="page-hero donate-hero">
                    <h1>Complete Your Donation</h1>
                    <p>Pay ₹{finalAmount} towards {causeLabel}</p>
                </div>

                <div className="payment-page">
                    <div className="payment-summary">
                        <span className="pay-label">Amount</span>
                        <span className="pay-value amt-highlight">₹{Number(finalAmount).toLocaleString('en-IN')}</span>
                        <span className="pay-label">Cause</span>
                        <span className="pay-value">{causeLabel}</span>
                        <span className="pay-label">Donor</span>
                        <span className="pay-value">{user?.name} ({user?.role})</span>
                    </div>

                    <div className="payment-qr-card">
                        <p className="scan-title">📱 Scan QR Code to Pay</p>
                        <img src="/upi_qr.png" alt="NGO Anand UPI QR Code" className="qr-image" />
                        <p className="qr-sub">Scan with any UPI app — PhonePe, Google Pay, Paytm</p>
                    </div>

                    <div className="payment-upi-card">
                        <p className="scan-title">Or pay using UPI ID</p>
                        <div className="upi-row">
                            <span className="upi-id">{UPI_ID}</span>
                            <button className="copy-btn" onClick={copyUPI}>{copied ? '✅ Copied!' : '📋 Copy'}</button>
                        </div>
                        <p className="upi-name">Pay to: <strong>{UPI_NAME}</strong></p>
                    </div>

                    <div className="payment-steps">
                        <p className="steps-title">How to pay:</p>
                        <ol>
                            <li>Open PhonePe / Google Pay / Paytm / any UPI app</li>
                            <li>Scan the QR code <strong>or</strong> enter the UPI ID above</li>
                            <li>Enter amount: <strong>₹{finalAmount}</strong></li>
                            <li>Add note: <em>{causeLabel} - NGO Anand</em></li>
                            <li>Complete the payment, then fill your UPI ID below and click "I Have Paid"</li>
                        </ol>
                    </div>

                    {/* UPI ID input from donor */}
                    <div className="donor-upi-section">
                        <label className="donor-upi-label">Your UPI ID (for verification)</label>
                        <input
                            className="donor-upi-input"
                            type="text"
                            placeholder="e.g. yourname@paytm or 9876543210@upi"
                            value={upiId}
                            onChange={e => { setUpiId(e.target.value); setUpiError('') }}
                        />
                        {upiError && <p className="auth-error">{upiError}</p>}
                        <p className="upi-hint">We use this to match and verify your payment before approving.</p>
                    </div>

                    <div className="payment-actions">
                        <button className="back-btn" onClick={() => setStep(1)}>← Go Back</button>
                        <button className="auth-submit paid-btn" onClick={handlePaymentDone} disabled={loading}>
                            {loading ? 'Submitting…' : '✅ I Have Paid'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── STEP 1: Select Cause & Amount ──────────────────────────────────────
    return (
        <div className="page-wrapper">
            <div className="page-hero donate-hero">
                <h1>Make a Donation</h1>
                <p>Your generosity changes lives in Anand, Gujarat</p>
            </div>

            <div className="donate-layout">
                <section className="donate-section">
                    <h2>Choose a Cause</h2>
                    <div className="cause-grid">
                        {CAUSES.map(c => (
                            <div key={c.id} className={`cause-card ${selectedCause === c.id ? 'selected' : ''}`} onClick={() => setSelectedCause(c.id)}>
                                <span className="cause-icon">{c.icon}</span>
                                <h3>{c.label}</h3>
                                <p>{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="donate-section">
                    <h2>Select Amount (₹)</h2>
                    <form onSubmit={handleProceed}>
                        <div className="preset-amounts">
                            {presets.map(p => (
                                <button type="button" key={p} className={`preset-btn ${amount === String(p) ? 'active' : ''}`} onClick={() => { setAmount(String(p)); setCustom('') }}>
                                    ₹{p.toLocaleString('en-IN')}
                                </button>
                            ))}
                        </div>
                        <div className="custom-amount">
                            <label>Or enter custom amount</label>
                            <input type="number" min="1" placeholder="₹ Enter amount" value={custom} onChange={e => { setCustom(e.target.value); setAmount('') }} />
                        </div>
                        <p className="donor-name">Donating as: <strong>{user?.name}</strong> ({user?.role})</p>
                        <button type="submit" className="auth-submit donate-btn" disabled={!finalAmount || Number(finalAmount) <= 0}>
                            Proceed to Payment →
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}
