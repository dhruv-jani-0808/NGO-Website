import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'

function printReceipt(donation, userName) {
    const win = window.open('', '_blank')
    win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Donation Receipt — ${donation.receiptNo}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; max-width: 600px; margin: auto; color: #1e293b; }
    .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 1rem; margin-bottom: 1.5rem; }
    .header h1 { color: #1e40af; font-size: 1.6rem; margin: 0; }
    .header p { color: #64748b; font-size: 0.9rem; margin: 0.3rem 0 0; }
    .receipt-no { font-size: 0.85rem; color: #64748b; text-align: right; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 0.6rem 0.8rem; border-bottom: 1px solid #e2e8f0; }
    td:first-child { font-weight: 600; color: #475569; width: 40%; }
    .amount { font-size: 1.5rem; font-weight: 800; color: #059669; }
    .footer { margin-top: 2rem; text-align: center; font-size: 0.82rem; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 1rem; }
    .thankyou { text-align: center; font-size: 1.1rem; color: #1e40af; font-weight: 700; margin: 1.5rem 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏡 NGO Anand</h1>
    <p>Station Road, Anand, Gujarat – 388001 | contact@ngoanand.org | +91 76008 08675</p>
  </div>
  <div class="receipt-no">Receipt No: <strong>${donation.receiptNo}</strong></div>
  <table>
    <tr><td>Donor Name</td><td>${donation.donor}</td></tr>
    <tr><td>Email</td><td>${donation.email}</td></tr>
    <tr><td>Cause</td><td>${donation.cause}</td></tr>
    <tr><td>Amount Donated</td><td class="amount">₹${Number(donation.amount).toLocaleString('en-IN')}</td></tr>
    <tr><td>Payment Method</td><td>UPI</td></tr>
    <tr><td>Date</td><td>${donation.date}</td></tr>
  </table>
  <p class="thankyou">Thank you, ${userName}! Your generosity changes lives. 🙏</p>
  <div class="footer">
    This is an official donation receipt from NGO Anand.<br>
    Registered under the Gujarat Societies Registration Act.
  </div>
  <script>window.onload = () => window.print()</script>
</body>
</html>`)
    win.document.close()
}

export default function Profile() {
    const { user } = useAuth()
    const { donations, loadProtectedData } = useAppData()

    useEffect(() => { loadProtectedData() }, [])

    const myDonations = donations.filter(d => d.email === user?.email)
    const myTotal = myDonations.reduce((s, d) => s + Number(d.amount), 0)

    return (
        <div className="page-wrapper">
            <div className="page-hero profile-hero">
                <h1>My Profile</h1>
                <p>Manage your account and view your donation history</p>
            </div>

            <div className="profile-layout">
                {/* Profile Card */}
                <div className="profile-card">
                    <div className="profile-avatar">
                        {user?.name?.[0]?.toUpperCase() || '👤'}
                    </div>
                    <h2>{user?.name}</h2>
                    <p className="profile-email">{user?.email}</p>
                    <span className="profile-role-badge">{user?.role}</span>

                    <div className="profile-stats">
                        <div>
                            <strong>{myDonations.length}</strong>
                            <span>Donations</span>
                        </div>
                        <div>
                            <strong>₹{myTotal.toLocaleString('en-IN')}</strong>
                            <span>Total Given</span>
                        </div>
                    </div>
                </div>

                {/* Donation History */}
                <div className="profile-history">
                    <h2 className="dash-section-title">My Donation History</h2>
                    {myDonations.length === 0 ? (
                        <div className="empty-state">
                            <span>💰</span>
                            <p>You haven't made any donations yet.</p>
                            <a href="/donate" className="ev-btn ev-reg">Donate Now →</a>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="dash-table">
                                <thead>
                                    <tr>
                                        <th>Receipt No</th>
                                        <th>Cause</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myDonations.map(d => (
                                        <tr key={d._id}>
                                            <td><code>{d.receiptNo}</code></td>
                                            <td>{d.cause}</td>
                                            <td><strong className="amount-cell">₹{Number(d.amount).toLocaleString('en-IN')}</strong></td>
                                            <td>{d.date}</td>
                                            <td>
                                                <button
                                                    className="receipt-btn"
                                                    onClick={() => printReceipt(d, user?.name)}
                                                >
                                                    🖨️ Print
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2"><strong>Total</strong></td>
                                        <td colSpan="3"><strong className="amount-cell">₹{myTotal.toLocaleString('en-IN')}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
