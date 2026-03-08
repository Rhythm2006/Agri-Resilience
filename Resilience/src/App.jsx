import React, { useEffect, useState, useCallback } from 'react';
import { config } from './config';
import BackgroundSequence from './components/BackgroundSequence';
import OverlayContent from './components/OverlayContent';
import NavigationSidebar from './components/NavigationSidebar';
import PageOverlay from './components/PageOverlay';
import OverlayPages from './components/OverlayPages';
import AIChatPanel from './components/AIChatPanel';

/**
 * Overlay metadata — maps overlayType to PageOverlay header text.
 */
const OVERLAY_META = {
  heritage: {
    title: 'The Roots of Indian Agriculture',
    subtitle: 'Where Civilization Began'
  },
  climate: {
    title: 'Climate Patterns & Risks',
    subtitle: 'Understanding the Forces'
  },
  crops: {
    title: 'Seasonal Crop Advisory',
    subtitle: 'Wisdom for Every Season'
  },
  gratitude: {
    title: 'To the Hands That Feed Us',
    subtitle: 'A Nation\'s Gratitude'
  },
  chat: {
    title: 'Krishi Mitra',
    subtitle: 'Your AI Farming Companion'
  }
};

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState(null);

  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const sectionsCount = config.sections.length;

  const handleScroll = useCallback(() => {
    const sequenceScrollDistance = window.innerHeight * 7;
    const scrollTop = window.scrollY;
    const progress = Math.min(1, Math.max(0, scrollTop / sequenceScrollDistance));
    setScrollProgress(progress);

    const sectionFraction = 1 / sectionsCount;
    let index = Math.floor(progress / sectionFraction);
    if (index >= sectionsCount) {
      index = sectionsCount - 1;
    }
    setActiveSectionIndex(index);
  }, [sectionsCount]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const navigateToSection = (index) => {
    const sequenceScrollDistance = window.innerHeight * 7;
    const sectionFraction = 1 / sectionsCount;
    const targetProgress = index * sectionFraction + (sectionFraction * 0.1);
    const targetScrollY = targetProgress * sequenceScrollDistance;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  // Open an overlay by type
  const openOverlay = (overlayType) => {
    setActiveOverlay(overlayType);
  };

  // Close the active overlay
  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  const overlayMeta = activeOverlay ? OVERLAY_META[activeOverlay] : {};

  return (
    <>
      {/* Loading Screen */}
      <div className={`global-loading-screen ${!isLoading ? 'fade-out' : ''}`}>
        <div className="loading-content">
          <h2 className="loading-title">{config.global.title}</h2>
          <div className="loading-bar-container">
            <div className="loading-bar" style={{ width: `${loadingProgress}%` }}></div>
          </div>
          <div className="loading-text">{loadingProgress}%</div>
        </div>
      </div>

      <div className="app-container">
        {/* Background layer — sticky canvas with scroll-driven frame sequence */}
        <div className="sticky-layer">
          <BackgroundSequence
            scrollProgress={scrollProgress}
            onProgress={setLoadingProgress}
            onLoadComplete={() => {
              // Small delay to ensure smooth transition once 100% is hit
              setTimeout(() => setIsLoading(false), 600);
            }}
          />
          <div className="gradient-overlay"></div>
          <OverlayContent
            sections={config.sections}
            activeSectionIndex={activeSectionIndex}
            config={config}
            onButtonClick={openOverlay}
          />
          <NavigationSidebar
            sections={config.sections}
            activeSectionIndex={activeSectionIndex}
            onNavigate={navigateToSection}
            config={config}
          />
        </div>
      </div>

      {/* Scrolling Content Below Parallax */}
      <div className="scrolling-content">
        <h2 className="final-quote">
          "The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings."
        </h2>
        <div className="quote-author">- Masanobu Fukuoka</div>

        <div className="button-group" style={{ marginTop: '3rem' }}>
          <button
            className="btn btn-right"
            style={{
              backgroundColor: config.global.themeAccentColor,
              borderColor: config.global.themeAccentColor,
              padding: '16px 40px',
              fontSize: '1rem'
            }}
            onClick={() => openOverlay('chat')}
          >
            Ask Krishi Mitra
          </button>
        </div>

        <div className="footer">
          <div>&copy; {new Date().getFullYear()} {config.global.title}. All rights reserved.</div>
          <div className="footer-credits">Created by Rhythm Sanjeev, Aarti &amp; Adharv Kaushik</div>
        </div>
      </div>

      {/* Full-Screen Overlay System */}
      <PageOverlay
        isOpen={!!activeOverlay}
        onClose={closeOverlay}
        title={overlayMeta.title}
        subtitle={overlayMeta.subtitle}
      >
        <OverlayPages
          overlayType={activeOverlay}
          chatComponent={<AIChatPanel />}
        />
      </PageOverlay>
    </>
  );
}

export default App;
