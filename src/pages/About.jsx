const team = [
    { name: 'Dhruvil Gandhi', role: 'Founder & Trustee', emoji: '🧑‍💼' },
    { name: 'Dhruv Jani', role: 'Founder & Trustee', emoji: '👨‍💼' },
    { name: 'Arjun Mehta', role: 'Field Coordinator', emoji: '🧑‍🤝‍🧑' },
    { name: 'Sunita Desai', role: 'Volunteer Head', emoji: '🤝' },
]

const values = [
    { icon: '💛', title: 'Compassion', desc: 'We act with empathy and care for every individual we serve.' },
    { icon: '🤝', title: 'Integrity', desc: 'Transparent operations and honest use of every rupee donated.' },
    { icon: '🌱', title: 'Sustainability', desc: 'Building long-term solutions, not just short-term relief.' },
    { icon: '🏘️', title: 'Community', desc: 'Rooted in Anand, working for the people of Gujarat.' },
]

export default function About() {
    return (
        <div className="page-wrapper">
            {/* Hero Banner */}
            <div className="page-hero about-hero">
                <h1>About Us</h1>
                <p>Serving the community of Anand, Gujarat since 2010</p>
            </div>

            {/* Mission */}
            <section className="about-section">
                <h2>Our Story</h2>
                <p>
                    NGO Anand was founded with a simple belief — that every person deserves dignity,
                    opportunity, and care. Starting with a small food distribution drive in 2010,
                    we have grown into a full-fledged organization running programs in education,
                    healthcare, disaster relief, and women empowerment across Anand district.
                </p>
                <p>
                    Over the past 15 years, we have helped more than <strong>2,500 families</strong>,
                    distributed over <strong>50,000 meals</strong>, and supported <strong>300+ children</strong>
                    with school supplies and scholarships.
                </p>
            </section>

            {/* Values */}
            <section className="about-section">
                <h2>Our Values</h2>
                <div className="values-grid">
                    {values.map((v, i) => (
                        <div className="value-card" key={i}>
                            <span className="value-icon">{v.icon}</span>
                            <h3>{v.title}</h3>
                            <p>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="about-section">
                <h2>Meet the Team</h2>
                <div className="team-grid">
                    {team.map((member, i) => (
                        <div className="team-card" key={i}>
                            <div className="team-avatar">{member.emoji}</div>
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
