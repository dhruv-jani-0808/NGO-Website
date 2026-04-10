import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const slides = [
    {
        img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=500&fit=crop',
        title: 'Feeding the Hungry',
        subtitle: 'Every meal is a step towards dignity.',
    },
    {
        img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&h=500&fit=crop',
        title: 'Education for All',
        subtitle: 'Knowledge is the most powerful tool for change.',
    },
    {
        img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=500&fit=crop',
        title: 'Health & Wellness',
        subtitle: 'Free healthcare for everyone who needs it.',
    },
    {
        img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=500&fit=crop',
        title: 'Community Support',
        subtitle: 'Together, we build a stronger Anand.',
    },
    {
        img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&h=500&fit=crop',
        title: 'Winter Relief',
        subtitle: 'Warmth, care, and compassion for all.',
    },
]

const counters = [
    { icon: '💰', value: '₹4,90,000+', label: 'Total Donations Received' },
    { icon: '🫂', value: '2,500+', label: 'People Helped' },
    { icon: '🤝', value: '15+', label: 'Active Volunteers' },
    { icon: '📅', value: '15+', label: 'Events Conducted' },
]

const testimonials = [
    {
        name: 'Meera Patel',
        role: 'Recipient, Anand',
        avatar: 'M',
        color: '#059669',
        quote: 'NGO Anand gave my children school supplies when we had nothing. I never thought strangers could care so much. Bless everyone involved.',
    },
    {
        name: 'Arjun Mehta',
        role: 'Volunteer since 2023',
        avatar: 'A',
        color: '#1e40af',
        quote: 'Volunteering here changed my perspective on life. Every food drive leaves me more grateful and motivated. This team is truly incredible.',
    },
    {
        name: 'Karan Joshi',
        role: 'Corporate Donor',
        avatar: 'K',
        color: '#7c3aed',
        quote: 'We\'ve partnered with many NGOs, but NGO Anand stands out for their transparency and real impact. Every rupee goes exactly where it should.',
    },
    {
        name: 'Sunita Desai',
        role: 'Health Camp Beneficiary',
        avatar: 'S',
        color: '#d97706',
        quote: 'The free eye check-up camp detected my glaucoma early. I got free spectacles and treatment. They literally saved my sight.',
    },
]

const causes = [
    { icon: '🍱', title: 'Food Distribution', desc: 'Monthly drives feeding 500+ families across Anand district.', color: '#fde68a', textColor: '#92400e' },
    { icon: '📚', title: 'Education Support', desc: 'School supplies, tutoring & scholarship funding for children.', color: '#dbeafe', textColor: '#1e40af' },
    { icon: '🏥', title: 'Health Camps', desc: 'Free GP check-ups, eye, dental & mental health screening.', color: '#dcfce7', textColor: '#065f46' },
    { icon: '🆘', title: 'Disaster Relief', desc: 'Rapid relief during floods, droughts & emergencies.', color: '#ede9fe', textColor: '#5b21b6' },
]

export default function Home() {
    const sliderRef = useRef(null)
    const currentSlide = useRef(0)

    useEffect(() => {
        const interval = setInterval(() => {
            currentSlide.current = (currentSlide.current + 1) % slides.length
            if (sliderRef.current) {
                sliderRef.current.style.transform = `translateX(-${currentSlide.current * 100}%)`
            }
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {/* ── Hero Slider ── */}
            <div className="slider-container">
                <div className="slider" ref={sliderRef}>
                    {slides.map((slide, i) => (
                        <div
                            key={i}
                            className="slide"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${slide.img}')`,
                            }}
                        >
                            <div className="slide-content">
                                <h1>{slide.title}</h1>
                                <p>{slide.subtitle}</p>
                                <div className="slide-cta-row">
                                    <Link to="/donate" className="slide-cta-btn primary">
                                        ❤️ Donate Now
                                    </Link>
                                    <Link to="/volunteer" className="slide-cta-btn secondary">
                                        🤝 Volunteer
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Slide Indicators */}
                <div className="slide-indicators">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            className="slide-dot"
                            onClick={() => {
                                currentSlide.current = i
                                if (sliderRef.current) {
                                    sliderRef.current.style.transform = `translateX(-${i * 100}%)`
                                }
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ── Impact Counters ── */}
            <div className="counters">
                {counters.map((c, i) => (
                    <div className="counter-box" key={i}>
                        <span className="counter-icon">{c.icon}</span>
                        <h2>{c.value}</h2>
                        <p>{c.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Mission Strip ── */}
            <div className="mission-strip">
                <h2>Our Mission</h2>
                <p>
                    NGO Anand is dedicated to uplifting communities in Anand, Gujarat through
                    food distribution, education support, healthcare initiatives, and disaster
                    relief programs. Together, we build a brighter tomorrow.
                </p>
                <Link to="/about" className="mission-learn-more">Learn Our Story →</Link>
            </div>

            {/* ── What We Do ── */}
            <section className="causes-section">
                <div className="section-header">
                    <h2>What We Do</h2>
                    <p>Four pillars of change that define our work in the community</p>
                </div>
                <div className="causes-grid">
                    {causes.map((c, i) => (
                        <div className="cause-card" key={i} style={{ '--card-bg': c.color, '--card-color': c.textColor }}>
                            <div className="cause-icon">{c.icon}</div>
                            <h3>{c.title}</h3>
                            <p>{c.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Donate CTA Banner ── */}
            <section className="home-cta-banner">
                <div className="home-cta-content">
                    <h2>Make a Difference Today</h2>
                    <p>
                        Your contribution, however small, creates real impact in the lives of
                        thousands of families in Anand, Gujarat.
                    </p>
                    <div className="home-cta-btns">
                        <Link to="/donate" className="home-cta-primary">❤️ Donate Now</Link>
                        <Link to="/blog" className="home-cta-secondary">See Our Impact →</Link>
                    </div>
                </div>
                <div className="home-cta-stats">
                    <div>
                        <strong>₹490K+</strong>
                        <span>Raised</span>
                    </div>
                    <div>
                        <strong>100%</strong>
                        <span>Transparent</span>
                    </div>
                    <div>
                        <strong>2500+</strong>
                        <span>Lives Touched</span>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="testimonials-section">
                <div className="section-header">
                    <h2>Words from Our Community</h2>
                    <p>Real stories from those whose lives we've touched</p>
                </div>
                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div className="testimonial-card" key={i}>
                            <div className="testimonial-quote-icon">"</div>
                            <p className="testimonial-text">{t.quote}</p>
                            <div className="testimonial-author">
                                <div
                                    className="testimonial-avatar"
                                    style={{ background: t.color }}
                                >
                                    {t.avatar}
                                </div>
                                <div>
                                    <strong>{t.name}</strong>
                                    <span>{t.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="join-strip">
                <h2>Ready to Join Us?</h2>
                <p>Register as a volunteer and be part of something meaningful.</p>
                <div className="join-btns">
                    <Link to="/login" className="home-cta-primary">🙋 Become a Volunteer</Link>
                    <Link to="/contact" className="home-cta-secondary">📞 Get in Touch</Link>
                </div>
            </section>
        </>
    )
}
