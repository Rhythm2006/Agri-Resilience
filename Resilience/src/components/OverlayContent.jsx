import React from 'react';

/**
 * OverlayContent — Left-side content layer for cinematic scroll sections.
 * Each section now has a single CTA that triggers an overlay.
 */
const OverlayContent = ({ sections, activeSectionIndex, config, onButtonClick }) => {
    return (
        <div className="content-layer">
            <div className="content-wrapper">
                {sections.map((section, index) => {
                    const isActive = index === activeSectionIndex;

                    return (
                        <div
                            key={section.id}
                            className={`content-section ${isActive ? 'active' : ''}`}
                            style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                        >
                            <div
                                className="section-subtitle"
                                style={{ color: config.global.themeAccentColor }}
                            >
                                {section.subtitle}
                            </div>
                            <h1 className="cinematic-font section-title">{section.title}</h1>
                            <p className="section-paragraph">{section.paragraph}</p>
                            <div className="button-group">
                                <button
                                    className="btn btn-right"
                                    style={{
                                        backgroundColor: config.global.themeAccentColor,
                                        borderColor: config.global.themeAccentColor
                                    }}
                                    onClick={() => onButtonClick(section.overlayType)}
                                >
                                    {section.cta}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OverlayContent;
