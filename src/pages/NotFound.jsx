import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="notfound-page">
            <div className="notfound-card">
                <div className="notfound-code">404</div>
                <div className="notfound-emoji">🏚️</div>
                <h1>Page Not Found</h1>
                <p>
                    Oops! The page you're looking for doesn't exist or may have been moved.
                    Let's get you back on track.
                </p>

                <div className="notfound-btns">
                    <Link to="/" className="nf-btn primary">🏠 Go to Home</Link>
                    <button className="nf-btn secondary" onClick={() => navigate(-1)}>
                        ← Go Back
                    </button>
                </div>

                <div className="notfound-links">
                    <span>Or visit:</span>
                    <Link to="/about">About</Link>
                    <Link to="/blog">News & Events</Link>
                    <Link to="/donate">Donate</Link>
                    <Link to="/contact">Contact</Link>
                </div>
            </div>

            {/* Decorative blobs */}
            <div className="nf-blob nf-blob-1" />
            <div className="nf-blob nf-blob-2" />
        </div>
    )
}
