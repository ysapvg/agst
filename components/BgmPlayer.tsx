'use client';

import { useEffect, useState } from 'react';

const YOUTUBE_VIDEO_ID = 'WGZMJ6amOPE'; 

export default function BgmPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [ytPlayer, setYtPlayer] = useState<any>(null);
    const [trackInfo, setTrackInfo] = useState({ title: 'FETCHING_AUDIO...', author: 'SYSTEM' });

    useEffect(() => {
        fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`)
            .then(res => res.json())
            .then(data => {
                if (data.title) {
                    setTrackInfo({ 
                        title: data.title.toUpperCase(), 
                        author: data.author_name.toUpperCase() 
                    });
                }
            })
            .catch(err => console.error("Error fetching YT data", err));
    }, []);

    useEffect(() => {
        if (!(window as any).YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        (window as any).onYouTubeIframeAPIReady = () => {
            const player = new (window as any).YT.Player('yt-player-container', {
                height: '0',
                width: '0',
                videoId: YOUTUBE_VIDEO_ID,
                host: 'https://www.youtube-nocookie.com', 
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    loop: 1,
                    playlist: YOUTUBE_VIDEO_ID,
                },
                events: {
                    onReady: (event: any) => {
                        setYtPlayer(event.target);
                    },
                },
            });
        };
    }, []);

    const togglePlay = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (!ytPlayer) return;

        const state = ytPlayer.getPlayerState();
        
        if (state === 1) {
            ytPlayer.pauseVideo();
            setIsPlaying(false);
        } else {
            ytPlayer.playVideo();
            setIsPlaying(true);
        }
    };

    return (
        <>
            <div id="yt-player-container" style={{ display: 'none' }}></div>
            {/* CONTAINER SLEEK ALA SHADCN */}
            <div className="bgm-sleek">
                {/* TOMBOL CIRCLE SEKALIGUS VINYL */}
                <button 
                    className={`vinyl-btn ${isPlaying ? 'is-playing' : ''}`}
                    onClick={togglePlay}
                    onTouchStart={togglePlay}
                >
                    <img src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`} alt="vinyl" />
                    <div className="vinyl-hole"></div>
                </button>
                
                {/* TEXT MARQUEE CLEAN */}
                <div className="bgm-info sys-text">
                    <div className="bgm-marquee">
                        <span>{trackInfo.title} • {trackInfo.author} &nbsp;&nbsp;&nbsp;***&nbsp;&nbsp;&nbsp; {trackInfo.title} • {trackInfo.author} &nbsp;&nbsp;&nbsp;***&nbsp;&nbsp;&nbsp;</span>
                    </div>
                </div>
            </div>
        </>
    );
}