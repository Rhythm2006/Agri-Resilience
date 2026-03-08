import React, { useEffect } from 'react';

/**
 * PageOverlay — Full-screen overlay shell with cinematic transitions.
 * Used by each scroll section's CTA to present immersive content.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - title: string (large cinematic heading)
 *  - subtitle: string (small uppercase label above title)
 *  - children: React.ReactNode (overlay content)
 */
const PageOverlay = ({ isOpen, onClose, title, subtitle, children }) => {
    // Lock body scroll when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    return (
        <div className={`page-overlay ${isOpen ? 'page-overlay-open' : ''}`}>
            {/* Close Button */}
            <button className="overlay-close-btn" onClick={onClose} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span>Close</span>
            </button>

            {/* Overlay Header */}
            <div className="overlay-header">
                {subtitle && (
                    <div className="overlay-subtitle">{subtitle}</div>
                )}
                {title && (
                    <h2 className="cinematic-font overlay-title">{title}</h2>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="overlay-body">
                {children}
            </div>
        </div>
    );
};

export default PageOverlay;
