import React from 'react';

/**
 * OverlayPages — Renders content for each overlay type.
 * Called inside PageOverlay's children slot.
 *
 * Each page contains rich, farmer-relevant content styled
 * with the existing dark + gold design language.
 */
const OverlayPages = ({ overlayType, chatComponent }) => {
    switch (overlayType) {
        case 'heritage': return <HeritagePage />;
        case 'climate': return <ClimatePage />;
        case 'crops': return <CropsPage />;
        case 'gratitude': return <GratitudePage />;
        case 'chat': return chatComponent || null;
        default: return null;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// HERITAGE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function HeritagePage() {
    const stats = [
        { label: 'Haryana', value: '15%', desc: 'of India\'s wheat production' },
        { label: 'Uttar Pradesh', value: '#1', desc: 'largest food grain producer' },
        { label: 'India', value: '70%', desc: 'population depends on agriculture' }
    ];

    const timeline = [
        { year: '~8000 BCE', title: 'First Seeds', desc: 'Early cultivation begins in the fertile Indo-Gangetic plains, laying the foundation for one of the world\'s oldest agricultural traditions.' },
        { year: '~3000 BCE', title: 'Ancient Wisdom', desc: 'Indus Valley civilization develops sophisticated irrigation and water management systems across what is now Haryana.' },
        { year: '~1500 BCE', title: 'Vedic Agriculture', desc: 'Agricultural practices are codified in ancient Vedic texts. The plough, known as "sira", becomes central to farming life.' },
        { year: '~300 BCE', title: 'Arthashastra Era', desc: 'Kautilya documents systematic farming methods, crop rotation, and land revenue systems in his treatise.' },
        { year: '1960s', title: 'The Green Revolution', desc: 'Dr. M.S. Swaminathan and Norman Borlaug introduce high-yield wheat varieties, transforming Haryana and Punjab into India\'s breadbasket.' },
        { year: '2020s', title: 'Climate-Smart Era', desc: 'Precision agriculture, AI-driven advisory, and climate-resilient crop varieties herald a new chapter in Indian farming.' }
    ];

    return (
        <div className="overlay-page heritage-page">
            <p className="overlay-intro">
                Agriculture in Haryana and Uttar Pradesh is not merely an occupation — it is the
                bedrock upon which civilizations have risen, empires have been sustained, and a billion
                lives continue to be nourished each day.
            </p>

            {/* Statistics Row */}
            <div className="stats-row">
                {stats.map((s, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-desc">{s.desc}</div>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div className="overlay-section-label">Timeline</div>
            <div className="timeline">
                {timeline.map((entry, i) => (
                    <div key={i} className="timeline-entry">
                        <div className="timeline-marker">
                            <div className="timeline-dot" />
                            {i < timeline.length - 1 && <div className="timeline-line" />}
                        </div>
                        <div className="timeline-content">
                            <span className="timeline-year">{entry.year}</span>
                            <h4 className="cinematic-font timeline-title">{entry.title}</h4>
                            <p className="timeline-desc">{entry.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLIMATE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function ClimatePage() {
    const risks = [
        {
            type: 'Drought',
            severity: 'Moderate',
            severityLevel: 2,
            indicator: '#FFB300',
            description: 'Declining groundwater levels across southwest Haryana and Bundelkhand. Shift to less water-intensive crops like millets and pulses.',
            regions: ['SW Haryana', 'Bundelkhand (UP)']
        },
        {
            type: 'Flooding',
            severity: 'High',
            severityLevel: 3,
            indicator: '#EF5350',
            description: 'Erratic monsoon causing flash floods in Gangetic plains. Build field bunds and ensure proper drainage systems.',
            regions: ['Eastern UP', 'Yamuna Belt']
        },
        {
            type: 'Heat Waves',
            severity: 'High',
            severityLevel: 3,
            indicator: '#EF5350',
            description: 'Rising temperatures affecting wheat grain filling. Early sowing (Nov 1-15) recommended to avoid terminal heat stress.',
            regions: ['All Haryana', 'Western UP']
        },
        {
            type: 'Unseasonal Rain',
            severity: 'Moderate',
            severityLevel: 2,
            indicator: '#FFB300',
            description: 'Increasing frequency of unseasonal rains damaging standing Rabi crops. Timely harvesting and crop insurance are crucial.',
            regions: ['Central UP', 'NE Haryana']
        }
    ];

    const seasons = [
        { name: 'Rabi', months: 'October — March', crops: ['Wheat', 'Mustard', 'Barley', 'Chickpea', 'Peas'], note: 'Monitor frost risk in January-February. Ensure 4-5 irrigations for optimal wheat yield.' },
        { name: 'Kharif', months: 'June — October', crops: ['Rice', 'Sugarcane', 'Cotton', 'Bajra', 'Maize'], note: 'Monsoon-dependent. Watch for delayed onset. Use short-duration rice varieties to reduce water stress.' },
        { name: 'Zaid', months: 'March — June', crops: ['Moong', 'Watermelon', 'Cucumber', 'Fodder'], note: 'Short summer window. Heat-tolerant varieties recommended. Ensure adequate irrigation during peak summer.' }
    ];

    return (
        <div className="overlay-page climate-page">
            <p className="overlay-intro">
                Climate patterns across North India are shifting. Understanding these changes is
                the first step toward protecting your harvest and adapting your practices.
            </p>

            {/* Seasonal Patterns */}
            <div className="overlay-section-label">Seasonal Patterns</div>
            <div className="overlay-cards-grid">
                {seasons.map((s, i) => (
                    <div key={i} className="overlay-card">
                        <div className="overlay-card-header">
                            <h4 className="cinematic-font">{s.name} Season</h4>
                            <span className="overlay-card-meta">{s.months}</span>
                        </div>
                        <div className="overlay-card-tags">
                            {s.crops.map((c, j) => (
                                <span key={j} className="overlay-tag">{c}</span>
                            ))}
                        </div>
                        <p className="overlay-card-text">{s.note}</p>
                    </div>
                ))}
            </div>

            {/* Risk Assessment */}
            <div className="overlay-section-label">Risk Assessment</div>
            <div className="overlay-cards-grid risks-layout">
                {risks.map((r, i) => (
                    <div key={i} className="overlay-card risk-card">
                        <div className="risk-card-header">
                            <div className="risk-indicator" style={{ backgroundColor: r.indicator }} />
                            <h4 className="cinematic-font">{r.type}</h4>
                            <span className={`risk-severity ${r.severity.toLowerCase()}`}>{r.severity}</span>
                        </div>
                        <div className="risk-meter-bar">
                            {[1, 2, 3].map(level => (
                                <div
                                    key={level}
                                    className="risk-meter-seg"
                                    style={{ backgroundColor: level <= r.severityLevel ? r.indicator : 'rgba(255,255,255,0.08)' }}
                                />
                            ))}
                        </div>
                        <p className="overlay-card-text">{r.description}</p>
                        <div className="risk-region-list">
                            {r.regions.map((reg, j) => (
                                <span key={j} className="risk-region">{reg}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CROPS PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_INDEX = {};
MONTHS.forEach((m, i) => { MONTH_INDEX[m] = i; });

const CROP_CALENDAR = [
    { crop: 'Wheat', sow: 'Nov', harvest: 'Apr', color: '#D4AF37' },
    { crop: 'Rice', sow: 'Jun', harvest: 'Oct', color: '#7CB342' },
    { crop: 'Mustard', sow: 'Oct', harvest: 'Mar', color: '#FFB300' },
    { crop: 'Sugarcane', sow: 'Feb', harvest: 'Jan', color: '#26A69A' },
    { crop: 'Cotton', sow: 'Apr', harvest: 'Nov', color: '#AB47BC' },
    { crop: 'Bajra', sow: 'Jul', harvest: 'Oct', color: '#8D6E63' }
];

function CropsPage() {
    const haryanaAdvice = [
        { title: 'Wheat Belt Strategy', desc: 'Sow HD-3226 or WH-1270 varieties by November 15. Ensure 4-5 irrigations at crown root, tillering, jointing, flowering, and grain filling stages.' },
        { title: 'Mustard Optimization', desc: 'RH-749 and RH-725 perform well in Haryana\'s semi-arid conditions. Apply 60kg nitrogen and 40kg phosphorus per hectare for optimal yield.' },
        { title: 'Water Management', desc: 'Micro-irrigation can save 30-40% water. Laser land leveling reduces water use by 25% and increases yield by 8-10%.' }
    ];

    const upAdvice = [
        { title: 'Rice-Wheat System', desc: 'Adopt direct-seeded rice (DSR) to save water and labor. Follow with zero-till wheat sowing to preserve soil moisture and reduce costs.' },
        { title: 'Sugarcane Practices', desc: 'Plant Co-0238 or CoLk-94184 varieties. Trash mulching reduces irrigation needs by 30% and improves soil organic carbon.' },
        { title: 'Diversification', desc: 'Integrate pulses (arhar, moong) in rice-fallows. This improves soil nitrogen, breaks pest cycles, and adds income.' }
    ];

    return (
        <div className="overlay-page crops-page">
            <p className="overlay-intro">
                The right crop at the right time makes all the difference. Here is region-specific
                guidance for maximizing your yield while building soil resilience.
            </p>

            {/* Crop Calendar */}
            <div className="overlay-section-label">Crop Calendar</div>
            <div className="crop-calendar-overlay">
                <div className="calendar-header">
                    <div className="calendar-label">Crop</div>
                    {MONTHS.map(m => (
                        <div key={m} className="calendar-month">{m}</div>
                    ))}
                </div>
                {CROP_CALENDAR.map((crop, index) => {
                    const sowIdx = MONTH_INDEX[crop.sow];
                    const harvestMonth = crop.harvest.replace('+', '');
                    const harvestIdx = MONTH_INDEX[harvestMonth];
                    const wraps = harvestIdx < sowIdx;

                    return (
                        <div key={index} className="calendar-row">
                            <div className="calendar-crop-name">{crop.crop}</div>
                            {MONTHS.map((_, mIdx) => {
                                let isActive = wraps
                                    ? (mIdx >= sowIdx || mIdx <= harvestIdx)
                                    : (mIdx >= sowIdx && mIdx <= harvestIdx);
                                const isSow = mIdx === sowIdx;
                                const isHarvest = mIdx === harvestIdx;

                                return (
                                    <div
                                        key={mIdx}
                                        className={`calendar-cell ${isActive ? 'active' : ''}`}
                                        style={isActive ? { backgroundColor: crop.color + '30', borderColor: crop.color } : {}}
                                    >
                                        {isSow && <span className="cell-label">S</span>}
                                        {isHarvest && <span className="cell-label">H</span>}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
                <div className="calendar-legend">
                    <span><span className="legend-dot" style={{ background: '#D4AF37' }} /> S = Sowing Window</span>
                    <span><span className="legend-dot" style={{ background: '#7CB342' }} /> H = Harvest Window</span>
                </div>
            </div>

            {/* Regional Advisory */}
            <div className="overlay-section-label">Haryana Advisory</div>
            <div className="advisory-list">
                {haryanaAdvice.map((a, i) => (
                    <div key={i} className="advisory-item">
                        <h4 className="cinematic-font">{a.title}</h4>
                        <p>{a.desc}</p>
                    </div>
                ))}
            </div>

            <div className="overlay-section-label">Uttar Pradesh Advisory</div>
            <div className="advisory-list">
                {upAdvice.map((a, i) => (
                    <div key={i} className="advisory-item">
                        <h4 className="cinematic-font">{a.title}</h4>
                        <p>{a.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRATITUDE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function GratitudePage() {
    const quotes = [
        { text: 'Agriculture is the most healthful, most useful, and most noble employment of man.', author: 'George Washington' },
        { text: 'The farmer has to be an optimist or he wouldn\'t still be a farmer.', author: 'Will Rogers' },
        { text: 'To forget how to dig the earth and to tend the soil is to forget ourselves.', author: 'Mahatma Gandhi' }
    ];

    const facts = [
        { value: '263M', label: 'Agricultural workers in India' },
        { value: '4:30 AM', label: 'Average wake-up time for farmers' },
        { value: '1.4B', label: 'Meals made possible every day' },
        { value: '140M', label: 'Hectares cultivated across India' }
    ];

    return (
        <div className="overlay-page gratitude-page">
            <p className="overlay-intro gratitude-intro">
                Behind every grain of wheat, every stalk of rice, every harvest that reaches our tables,
                there are hands that have worked since before dawn. This is for them.
            </p>

            {/* Facts */}
            <div className="gratitude-facts">
                {facts.map((f, i) => (
                    <div key={i} className="gratitude-fact">
                        <div className="gratitude-fact-value">{f.value}</div>
                        <div className="gratitude-fact-label">{f.label}</div>
                    </div>
                ))}
            </div>

            {/* Quotes */}
            <div className="gratitude-quotes">
                {quotes.map((q, i) => (
                    <blockquote key={i} className="gratitude-quote">
                        <p className="cinematic-font">"{q.text}"</p>
                        <cite>— {q.author}</cite>
                    </blockquote>
                ))}
            </div>

            <div className="gratitude-closing">
                <p className="cinematic-font">
                    To every farmer who rises before the sun, who reads the sky like scripture,
                    who trusts the soil with their livelihood — we see you, we honor you,
                    and we stand with you.
                </p>
            </div>
        </div>
    );
}

export default OverlayPages;
