import { useState } from 'react'
import { useAppData } from '../context/AppDataContext'

const contactInfo = [
    { icon: '📍', title: 'Address', detail: 'NGO Anand Office, Station Road, Anand, Gujarat – 388001' },
    { icon: '📞', title: 'Phone', detail: '+91 76008 08675' },
    { icon: '📧', title: 'Email', detail: 'contact@ngoanand.org' },
    { icon: '🕐', title: 'Hours', detail: 'Mon – Sat: 9:00 AM – 6:00 PM' },
]

export default function Contact() {
    const { addContactMessage } = useAppData()
    const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' })
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        addContactMessage(form)
        setForm({ name: '', email: '', subject: 'General Inquiry', message: '' })
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 4000)
    }

    return (
        <div className="page-wrapper">
            <div className="page-hero contact-hero">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you — reach out anytime!</p>
            </div>

            {submitted && (
                <div className="success-toast contact-toast">
                    ✅ Message sent! We'll get back to you soon.
                </div>
            )}

            <div className="contact-layout">
                {/* Info Cards */}
                <section className="contact-info">
                    <h2>Get in Touch</h2>
                    <div className="contact-cards">
                        {contactInfo.map((item, i) => (
                            <div className="contact-card" key={i}>
                                <span className="contact-icon">{item.icon}</span>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Form */}
                <section className="contact-form-section">
                    <h2>Send a Message</h2>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <label>Your Name</label>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />

                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />

                        <label>Subject</label>
                        <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                            <option>General Inquiry</option>
                            <option>Donation Help</option>
                            <option>Volunteer Opportunities</option>
                            <option>Partnership Proposal</option>
                            <option>Media / Press</option>
                            <option>Other</option>
                        </select>

                        <label>Message</label>
                        <textarea
                            rows="5"
                            placeholder="Write your message here..."
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            required
                        />

                        <button type="submit" className="auth-submit">Send Message</button>
                    </form>
                </section>
            </div>

            {/* Google Map Embed */}
            <section className="map-section">
                <h2>Our Location</h2>
                <div className="map-embed-wrapper">
                    <iframe
                        title="NGO Anand Location"
                        src="https://www.google.com/maps?q=Station+Road,+Anand,+Gujarat+388001,+India&output=embed"
                        width="100%"
                        height="400"
                        style={{ border: 0, borderRadius: '14px', display: 'block' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="map-footer">
                        <span>📍 Station Road, Anand, Gujarat – 388001</span>
                        <a
                            href="https://maps.google.com/?q=Station+Road,+Anand,+Gujarat+388001,+India"
                            target="_blank"
                            rel="noreferrer"
                            className="map-open-btn"
                        >
                            🗺️ Open in Google Maps →
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
