'use client';

import { useState, useEffect, useRef } from 'react';
import BgmPlayer from '@/components/BgmPlayer';
import WorksModal from '@/components/WorksModal';

type Lang = 'en' | 'zh' | 'jp';

interface WorkItem {
    id: number;
    title: string;
    src: string;
    type: 'image' | 'video';
}

// -----------------------------------------------------
// 1. DATABASE KARYA (GAMBAR ATAU VIDEO)
// -----------------------------------------------------
const WORKS_DATA: WorkItem[] = [
    // --- BATMAN SERIES ---
    { id: 1, title: "BATMAN_1", src: "/batman1.jpg", type: "image" },
    { id: 2, title: "BATMAN_2", src: "/batman2.jpg", type: "image" },
    { id: 5, title: "R_EXPERIMENTAL_VID", src: "/r.mp4", type: "video" },
    { id: 3, title: "BATMAN_3", src: "/batman3.jpg", type: "image" },
    { id: 4, title: "BATMAN_4", src: "/batman4.jpg", type: "image" },

    // --- LHOUSE SERIES ---
    { id: 33, title: "ARCHIVE_2022_VID", src: "/2022.mp4", type: "video" },
    { id: 6, title: "LHOUSE_1", src: "/lhouse1.jpg", type: "image" },
    { id: 7, title: "LHOUSE_2", src: "/lhouse2.jpg", type: "image" },
    { id: 8, title: "LHOUSE_3", src: "/lhouse3.jpg", type: "image" },

    // --- BLUE SERIES ---
    { id: 9, title: "BLUE_1", src: "/blue1.jpg", type: "image" },
    { id: 15, title: "MORPHIE_VID", src: "/morphie.mp4", type: "video" },
    { id: 10, title: "BLUE_2", src: "/blue2.jpg", type: "image" },
    { id: 12, title: "REAP_VID", src: "/reap.mp4", type: "video" },

    // --- JOKER SERIES ---
    { id: 13, title: "JOKER_1", src: "/joker1.jpg", type: "image" },
    { id: 14, title: "JOKER_2", src: "/joker2.jpg", type: "image" },
    { id: 16, title: "CANT_STOP_VID", src: "/cantstop.mp4", type: "video" },

    // --- STANDALONE & GILROY ---
    { id: 17, title: "OPPENHEIMER", src: "/oppenheimer.jpg", type: "image" },
    { id: 18, title: "GILROY_1", src: "/gilroy1.jpg", type: "image" },
    { id: 19, title: "GILROY_2", src: "/gilroy2.jpg", type: "image" },
    { id: 20, title: "LYFT_VID", src: "/lyft.mp4", type: "video" },

    // --- SNATCH SERIES & HONG ---
    { id: 21, title: "SNATCH_ORIGINAL", src: "/snatch.jpg", type: "image" },
    { id: 22, title: "SNATCH_1", src: "/snatch1.jpg", type: "image" },
    { id: 23, title: "HONG_1", src: "/hong1.jpg", type: "image" },
    { id: 24, title: "HONG_2", src: "/hong2.jpg", type: "image" },
    { id: 25, title: "HONG_3", src: "/hong3.jpg", type: "image" },
    { id: 26, title: "HONG_4", src: "/hong4.jpg", type: "image" },

    // --- PROJECT NUMBERS ---
    { id: 28, title: "PROJECT_171", src: "/171.jpg", type: "image" },
    { id: 29, title: "PROJECT_172", src: "/172.jpg", type: "image" },
    { id: 30, title: "PULANG_VID", src: "/pulang.mp4", type: "video" },

    // --- STANDALONE SISA ---
    { id: 31, title: "SUKATANI", src: "/sukatani.jpg", type: "image" },
    { id: 32, title: "PANCARONA", src: "/pancarona.jpg", type: "image" },
    { id: 34, title: "HOW_YOU_FALL", src: "/howyoufall.jpg", type: "image" },
    { id: 35, title: "NO_SUCH_THING", src: "/mbg.png", type: "image" },
];

// -----------------------------------------------------
// 2. SCRAMBLE TEXT GLITCH FUNCTION
// -----------------------------------------------------
const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________';

function useScrambleText(originalText: string) {
    const [text, setText] = useState(originalText);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const trigger = () => {
        let iteration = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setText(() =>
                originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        if (char === ' ') return ' ';
                        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                    })
                    .join('')
            );

            if (iteration >= originalText.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
            iteration += 1 / 2;
        }, 30);
    };

    return { text, trigger };
}

function ScrambleLink({ href, label, onClick }: { href: string; label: string; onClick?: (e: React.MouseEvent) => void }) {
    const { text, trigger } = useScrambleText(label);
    return (
        <a 
            href={href} 
            onMouseEnter={trigger} 
            onClick={onClick}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {text}
        </a>
    );
}

// -----------------------------------------------------
// 3. KOMPONEN MEDIA BRUTALIST (DENGAN WIREFRAME FALLBACK)
// -----------------------------------------------------
const LaggyMedia = ({ 
    work, 
    delay, 
    onInspect 
}: { 
    work: WorkItem; 
    delay: number; 
    onInspect: (work: WorkItem) => void;
}) => {
    const [isTriggered, setIsTriggered] = useState(false);
    const [hasError, setHasError] = useState(false);
    const renderTime = useRef((Math.random() * 1.5 + 0.8).toFixed(2)); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTriggered(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className="work-card">
            <div className="work-card-bar">
                <span>#{String(work.id).padStart(2, '0')} // {work.title}</span>
                <span>[{work.type.toUpperCase()}]</span>
            </div>
            
            <div 
                className="work-card-body"
                onClick={() => onInspect(work)}
                title="CLICK TO INSPECT RAW SPEC"
            >
                {hasError ? (
                    <div className="raw-media-placeholder">
                        <div style={{ opacity: 0.6 }}>[PAYLOAD_AWAITING]</div>
                        <div className="raw-media-inner">
                            <pre>+-------------+</pre>
                            <pre>| RAW_ARCHIVE |</pre>
                            <pre>+-------------+</pre>
                            <p style={{ marginTop: 8 }}>{work.src}</p>
                        </div>
                        <div style={{ opacity: 0.6, textAlign: 'right' }}>[RAW_ASSET]</div>
                    </div>
                ) : work.type === 'video' ? (
                    <video
                        src={work.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={() => setHasError(true)}
                        className={`laggy-img ${isTriggered ? 'is-loaded' : ''}`}
                        style={{ 
                            animationDuration: isTriggered ? `${renderTime.current}s` : '0s' 
                        }}
                    />
                ) : (
                    <img
                        src={work.src}
                        alt={work.title}
                        onError={() => setHasError(true)}
                        className={`laggy-img ${isTriggered ? 'is-loaded' : ''}`}
                        style={{ 
                            animationDuration: isTriggered ? `${renderTime.current}s` : '0s' 
                        }}
                    />
                )}
            </div>
        </div>
    );
};

// -----------------------------------------------------
// 4. HALAMAN UTAMA
// -----------------------------------------------------
export default function Home() {
    const [lang, setLang] = useState<Lang>('en');
    const [showWorks, setShowWorks] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inspectedWork, setInspectedWork] = useState<WorkItem | null>(null);
    const [logoImgError, setLogoImgError] = useState(false);
    const [footerImgError, setFooterImgError] = useState(false);

    // --- EFEK CHAOS COLOR HOVER (PC) ---
    const chaosColors = ['#9333ea', '#0000ff', '#10b981', '#f59e0b', '#ec4899'];

    const handleMouseEnter = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.currentTarget.style.color = chaosColors[Math.floor(Math.random() * chaosColors.length)];
    };
    const handleMouseLeave = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.currentTarget.style.color = 'var(--text-color)';
    };

    // --- EFEK CHAOS COLOR TOUCH (HP) ---
    const handleTouchStart = (e: React.TouchEvent<HTMLParagraphElement>) => {
        e.currentTarget.style.color = chaosColors[Math.floor(Math.random() * chaosColors.length)];
    };
    const handleTouchEnd = (e: React.TouchEvent<HTMLParagraphElement>) => {
        e.currentTarget.style.color = 'var(--text-color)';
    };

    // --- TOMBOL WORKS ---
    const handleWorksClick = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setShowWorks(true);
        setTimeout(() => {
            const worksSection = document.getElementById('works-gallery');
            if (worksSection) {
                worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 120);
    };

    return (
        <>
            <BgmPlayer />
            <WorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* FULLSCREEN BRUTALIST INSPECTOR LIGHTBOX */}
            {inspectedWork && (
                <div className="inspector-overlay" onClick={() => setInspectedWork(null)}>
                    <div className="inspector-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="inspector-header">
                            <span>// INSPECT_PAYLOAD :: {inspectedWork.title}</span>
                            <button className="inspector-close" onClick={() => setInspectedWork(null)}>
                                [X] ESC
                            </button>
                        </div>
                        <div className="inspector-content">
                            {inspectedWork.type === 'video' ? (
                                <video
                                    src={inspectedWork.src}
                                    autoPlay
                                    loop
                                    controls
                                    className="inspector-media"
                                />
                            ) : (
                                <img
                                    src={inspectedWork.src}
                                    alt={inspectedWork.title}
                                    className="inspector-media"
                                />
                            )}
                        </div>
                        <div className="inspector-footer">
                            <span>FORMAT: {inspectedWork.type.toUpperCase()}</span>
                            <span>SOURCE: {inspectedWork.src}</span>
                            <span>STATUS: ARCHIVED_RAW</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                
                {/* BAGIAN LOGO REFINED & SUBTLE */}
                <div className="logo-box sys-text">
                    <pre>+-----------------------------------------+</pre>
                    <div className="logo-row">
                        <span className="pipe">|</span>
                        <div className="logo-center">
                            {!logoImgError ? (
                                <img 
                                    src="/agst_landing.png" 
                                    alt="agst logo" 
                                    className="logo" 
                                    onError={() => setLogoImgError(true)}
                                />
                            ) : (
                                <span className="logo-brand-text">AGST</span>
                            )}
                        </div>
                        <span className="pipe">|</span>
                    </div>
                    <pre>+-----------------------------------------+</pre>
                    <pre>|              VISUAL&VISUAL              |</pre>
                    <pre>+-----------------------------------------+</pre>
                </div>

                {/* LANGUAGE SWITCHER */}
                <div className="lang-switcher sys-text">
                    <a href="#" className={lang === 'en' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setLang('en'); }}>[ en ]</a>
                    <span className="lang-divider">/</span>
                    <a href="#" className={lang === 'zh' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setLang('zh'); }}>[ 中 ]</a>
                    <span className="lang-divider">/</span>
                    <a href="#" className={lang === 'jp' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setLang('jp'); }}>[ 日 ]</a>
                </div>

                {/* KONTEN UTAMA */}
                <main className="content">
                    {lang === 'en' && (
                        <div id="content-en">
                            <p onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                                <strong>agst</strong> is basically just me keeping track of things (idk why but yeah) under the moniker <strong>visual&visual</strong>.
                            </p>
                            <p onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                                not a proper showcase tbh... just an ongoing experiment (or whatever). it’s a relaxed spot to play around with graphic designs, raw video treatments, and digital layouts (no rules here wkwk).
                            </p>
                            <p onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                                think of it as a <strong>raw</strong> and <strong>brutalist</strong> sketchbook of ideas before they end up on my <a href="https://instagram.com/ag300099" target="_blank" rel="noopener noreferrer">@instagram</a> (i'll be posting more here wkwk... hopefully).
                            </p>
                        </div>
                    )}

                    {lang === 'zh' && (
                        <div id="content-zh">
                            <p onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                                <strong>agst</strong> 基本上就是我用 <strong>visual&visual</strong> 这个名字随便记录点东西的地方（我都不知道为什么 tbh wkwk）。
                            </p>
                            <p onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                                算不上什么正式的作品集... 充其量是个乱搞的实验空间（或者别的什么鬼 idk）。随便玩玩平面设计、粗糙的视频处理、还有排版（反正没规矩 wkwk）。
                            </p>
                            <p onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                                当作一个<strong>粗犷</strong>又<strong>野兽派</strong>的草稿本看就行，反正都是发到 <a href="https://instagram.com/ag300099" target="_blank" rel="noopener noreferrer">@instagram</a> 前的废稿（我之后会多发点东西的 wkwk... 大概吧）。
                            </p>
                        </div>
                    )}

                    {lang === 'jp' && (
                        <div id="content-jp">
                            <p onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                                <strong>agst</strong> は基本的に、<strong>visual&visual</strong> って名義で色々メモしてるだけの場所です（なんでか知らんけど wkwk）。
                            </p>
                            <p onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                                きちんとしたポートフォリオとかじゃなくて tbh... ただの実験場（or whatever）。グラフィックとか未加工の動画とかレイアウトとか、ルールなしで適当に遊んでるだけ（マジで自由 wkwk）。
                            </p>
                            <p onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                                <a href="https://instagram.com/ag300099" target="_blank" rel="noopener noreferrer">@instagram</a> に投げる前の、<strong>生々しくて</strong><strong>ブルータリズム</strong>なスケッチブックだと思ってください（ここにももっと投稿する予定 wkwk... たぶん）。
                            </p>
                        </div>
                    )}
                </main>

                {/* LINKS & BUTTONS DENGAN SCRAMBLE EFFECT */}
                <div className="links-section sys-text">
                    <ul className="inline-links">
                        <li>
                            <ScrambleLink href="https://instagram.com/ag300099" label=">> instagram" />
                        </li>
                        <li>
                            <ScrambleLink href="https://twitter.com/agungxsoeltani" label=">> x/twitter" />
                        </li>
                        <li>
                            <ScrambleLink href="#works" label=">> works" onClick={handleWorksClick} />
                        </li>
                        <li>
                            <ScrambleLink href="#prompt" label=">> commission_note" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} />
                        </li>
                    </ul>
                </div>

                {/* FOOTER */}
                <div className="footer-logo">
                    {!footerImgError ? (
                        <img 
                            src="/visual&&visual.png" 
                            alt="visual&&visual" 
                            onError={() => setFooterImgError(true)}
                        />
                    ) : (
                        <span className="sys-text" style={{ fontSize: '0.72rem', opacity: 0.5, letterSpacing: '0.1em' }}>
                            [ VISUAL&VISUAL ]
                        </span>
                    )}
                </div>

                <div className="copyright-box sys-text">
                    <pre>+-----------------------------------------+</pre>
                    <pre>| (c) 2026 agst. NO RIGHTS RESERVED.      |</pre>
                    <pre>+-----------------------------------------+</pre>
                </div>

                {/* GALLERY YANG MUNCUL PAS WORKS DIKLIK */}
                {showWorks && (
                    <div id="works-gallery" className="works-gallery">
                        {WORKS_DATA.map((work) => (
                            <LaggyMedia 
                                key={work.id} 
                                work={work} 
                                delay={Math.random() * 250 + 80} 
                                onInspect={(selected) => setInspectedWork(selected)}
                            />
                        ))}
                    </div>
                )}

            </div>
        </>
    );
}
