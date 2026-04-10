const NEWS_ITEMS = [
    {
        id: 'n1',
        type: 'news',
        title: 'NGO Anand Distributes 5,000 Meals During Holi Season',
        date: '2026-03-25',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=380&fit=crop',
        summary: 'This Holi, our volunteers joined hands to distribute hot meals and sweets to over 500 families across Anand district, spreading joy and warmth.',
        tag: '🍱 Food Drive',
        tagColor: 'orange',
    },
    {
        id: 'n2',
        type: 'news',
        title: 'Free Eye Check-Up Camp Helps 300+ Patients',
        date: '2026-03-10',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=380&fit=crop',
        summary: 'In partnership with Anand Eye Institute, we organized a free eye check-up camp. Over 300 patients received consultations and 80 received free spectacles.',
        tag: '👁️ Health Camp',
        tagColor: 'blue',
    },
    {
        id: 'n3',
        type: 'news',
        title: 'Scholarship Program Supports 50 Meritorious Students',
        date: '2026-02-20',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=380&fit=crop',
        summary: 'NGO Anand awarded scholarships to 50 deserving students from underprivileged families, covering school fees and books for the academic year 2026-27.',
        tag: '📚 Education',
        tagColor: 'green',
    },
    {
        id: 'n4',
        type: 'event',
        title: 'Upcoming: Food Distribution Drive — April 20',
        date: '2026-04-20',
        image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=380&fit=crop',
        summary: 'Join us on April 20th at Station Road, Anand for our monthly food distribution drive. We aim to serve 600+ families. Volunteers welcome!',
        tag: '📅 Upcoming',
        tagColor: 'purple',
    },
    {
        id: 'n5',
        type: 'event',
        title: 'Free Health Camp — April 27, Vallabh Vidyanagar',
        date: '2026-04-27',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=380&fit=crop',
        summary: 'Free general health check-up, BP screening, sugar testing, and doctor consultations. Open to all. Bring your family!',
        tag: '🏥 Health Camp',
        tagColor: 'blue',
    },
    {
        id: 'n6',
        type: 'event',
        title: 'Back-to-School Supply Drive — May 5',
        date: '2026-05-05',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=380&fit=crop',
        summary: 'Help us distribute school bags, books, and stationery to 200+ children at Anand Primary School. Every contribution counts!',
        tag: '📅 Upcoming',
        tagColor: 'purple',
    },
]

const GALLERY_ITEMS = [
    { id: 'g1', src: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop', caption: 'Community food drive volunteers' },
    { id: 'g2', src: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop', caption: 'Winter relief blanket distribution' },
    { id: 'g3', src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', caption: 'Volunteers at community support event' },
    { id: 'g4', src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop', caption: 'Feeding families in need' },
    { id: 'g5', src: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=300&fit=crop', caption: 'Annual charity gala dinner' },
    { id: 'g6', src: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop', caption: 'Children receiving school supplies' },
    { id: 'g7', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', caption: 'Trustee and volunteer team' },
    { id: 'g8', src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop', caption: 'Planning next community event' },
]

import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Blog() {
    const [filter, setFilter] = useState('all')
    const [lightbox, setLightbox] = useState(null)

    const filtered = filter === 'all'
        ? NEWS_ITEMS
        : filter === 'gallery'
            ? []
            : NEWS_ITEMS.filter(n => n.type === filter)

    return (
        <div className="page-wrapper">
            <div className="page-hero blog-hero">
                <h1>News & Events</h1>
                <p>Stay updated with our latest drives, camps, and community stories</p>
            </div>

            {/* Filter Tabs */}
            <div className="blog-filters">
                {['all', 'news', 'event', 'gallery'].map(f => (
                    <button
                        key={f}
                        className={`blog-filter-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' && '🌐 All'}
                        {f === 'news' && '📰 News'}
                        {f === 'event' && '📅 Events'}
                        {f === 'gallery' && '🖼️ Gallery'}
                    </button>
                ))}
            </div>

            {/* News & Events Grid */}
            {filter !== 'gallery' && (
                <div className="blog-grid">
                    {filtered.map(item => (
                        <div className="blog-card" key={item.id}>
                            <div className="blog-img-wrap">
                                <img src={item.image} alt={item.title} className="blog-img" />
                                <span className={`blog-tag tag-${item.tagColor}`}>{item.tag}</span>
                            </div>
                            <div className="blog-body">
                                <p className="blog-date">📅 {item.date}</p>
                                <h3>{item.title}</h3>
                                <p className="blog-summary">{item.summary}</p>
                                {item.type === 'event' && (
                                    <Link to="/donate" className="blog-cta">Support This Event →</Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Gallery */}
            {filter === 'gallery' && (
                <div className="gallery-section">
                    <div className="gallery-grid">
                        {GALLERY_ITEMS.map(g => (
                            <div
                                className="gallery-item"
                                key={g.id}
                                onClick={() => setLightbox(g)}
                            >
                                <img src={g.src} alt={g.caption} />
                                <div className="gallery-overlay">
                                    <p>{g.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {lightbox && (
                <div className="lightbox" onClick={() => setLightbox(null)}>
                    <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
                        <img src={lightbox.src.replace('w=400&h=300', 'w=900&h=600')} alt={lightbox.caption} />
                        <p>{lightbox.caption}</p>
                        <button className="lightbox-close" onClick={() => setLightbox(null)}>✕ Close</button>
                    </div>
                </div>
            )}

            {/* CTA Strip */}
            <div className="blog-cta-strip">
                <h2>Want to be part of our next story?</h2>
                <p>Join us as a volunteer or make a donation to power our next drive.</p>
                <div className="blog-cta-btns">
                    <Link to="/donate" className="cta-btn-primary">💛 Donate Now</Link>
                    <Link to="/contact" className="cta-btn-secondary">🤝 Volunteer</Link>
                </div>
            </div>
        </div>
    )
}
