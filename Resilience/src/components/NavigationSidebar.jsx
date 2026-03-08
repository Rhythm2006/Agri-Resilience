import React from 'react';

const NavigationSidebar = ({ sections, activeSectionIndex, onNavigate, config }) => {
    const activeSection = sections[activeSectionIndex];

    const handlePrev = () => {
        if (activeSectionIndex > 0) {
            onNavigate(activeSectionIndex - 1);
        }
    };

    const handleNext = () => {
        if (activeSectionIndex < sections.length - 1) {
            onNavigate(activeSectionIndex + 1);
        }
    };

    return (
        <div className="nav-layer">
            <div className="nav-wrapper">
                <div
                    className="nav-index"
                    style={{ color: config.global.themeAccentColor }}
                >
                    {activeSection.id}
                </div>

                <div className="nav-strip">
                    <div
                        className="nav-label"
                        onClick={handlePrev}
                        style={{ opacity: activeSectionIndex === 0 ? 0.3 : 1, pointerEvents: activeSectionIndex === 0 ? 'none' : 'auto' }}
                    >
                        <span className="nav-arrow">&lt;</span> PREV
                    </div>

                    <div className="nav-divider"></div>

                    <div
                        className="nav-label"
                        onClick={handleNext}
                        style={{ opacity: activeSectionIndex === sections.length - 1 ? 0.3 : 1, pointerEvents: activeSectionIndex === sections.length - 1 ? 'none' : 'auto' }}
                    >
                        NEXT <span className="nav-arrow">&gt;</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationSidebar;
