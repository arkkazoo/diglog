import React, { useState, useRef } from 'react';
import { useEffect, useContext } from 'react';
import MyContext from '../MyContext';

const MusicPlayer = () => {
    const [YTPlayer, setYTPlayer] = useState(null);
    const [SCPlayer, setSCPlayer] = useState(null);
    const [currentPlatform, setCurrentPlatform] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const parentRef = useRef(null);
    const childRef = useRef(null);

    const { trackData } = useContext(MyContext);

    // APIのスクリプトを読み込む
    useEffect(() => {
        const YTScript = document.createElement('script');
        YTScript.src = 'https://www.youtube.com/iframe_api';
        YTScript.async = true;
        document.body.appendChild(YTScript);
        const SCScript = document.createElement('script');
        SCScript.src = 'https://w.soundcloud.com/player/api.js';
        SCScript.async = true;
        document.body.appendChild(SCScript);
        return () => {
            // コンポーネントがアンマウントされたら、スクリプトを削除
            document.body.removeChild(YTScript);
            document.body.removeChild(SCScript);
        };
    }, []
    );

    // trackDataが変更されたら、再生する
    useEffect(() => {
        if (trackData.domain === 'youtube') {
            document.getElementById('artistOfPlayer').textContent = trackData.artist;
            document.getElementById('titleOfPlayer').textContent = trackData.title;
            const videoId = trackData.url.split('v=')[1].split('&')[0];
            playYT(videoId);
        }
        if (trackData.domain === 'soundcloud') {
            document.getElementById('artistOfPlayer').textContent = trackData.artist;
            document.getElementById('titleOfPlayer').textContent = trackData.title;
            playSC(trackData.url);
        }
    }, [trackData]
    );

    useEffect(() => {
        const childHeight = childRef.current.offsetHeight;
        {
            isMenuOpen
                ? parentRef.current.style.transform = `translateY(0px)`
                : parentRef.current.style.transform = `translateY(${childHeight}px)`
        }
    }, [isMenuOpen]
    );

    const generateNewYTPlayer = (id) => {
        console.log(currentPlatform);
        setCurrentPlatform('youtube');
        console.log(currentPlatform);
        const newYTPlayer = new window.YT.Player('YTPlayer', {
            videoId: id,
            events: { onReady: (event) => {
                event.target.playVideo();
            }},
        });
        setYTPlayer(newYTPlayer);
    };

    const generateNewSCPlayer = (url) => {
        setCurrentPlatform('soundcloud');
        var iframeElement = document.querySelector('#SCPlayer');
        var widget1 = new window.SC.Widget(iframeElement);
        widget1.load(url, {
            auto_play: true
        });
        setSCPlayer(widget1);
    };

    const playYT = (src) => {
        if (YTPlayer === null) {
            if (currentPlatform === 'soundcloud') {
                SCPlayer.pause();
            }
            setCurrentPlatform('youtube');
            generateNewYTPlayer(src);
            if (!isMenuOpen) {
                toggleMenu();
            }
        } else if (currentPlatform === 'youtube') {
            YTPlayer.loadVideoById(src);
        } else {
            setCurrentPlatform('youtube');
            SCPlayer.pause();
            YTPlayer.loadVideoById(src);
        }
    }

    const playSC = (url) => {
        if (SCPlayer === null) {
            if (currentPlatform === 'youtube') {
                YTPlayer.pauseVideo();
            }
            setCurrentPlatform('soundcloud');
            generateNewSCPlayer(url);
            if (!isMenuOpen) {
                toggleMenu();
            }
        } else if (currentPlatform === 'soundcloud') {
            SCPlayer.load(url, {
                auto_play: true
            });
        } else {
            setCurrentPlatform('soundcloud');
            YTPlayer.pauseVideo();
            SCPlayer.load(url, {
                auto_play: true
            });
        }
    }



    const onClickPlayButton = () => {
        if (currentPlatform === 'youtube') {
            YTPlayer.playVideo();
        }
        if (currentPlatform === 'soundcloud') {
            SCPlayer.play();
        }
    };
    const onClickPauseButton = () => {
        if (currentPlatform === 'youtube') {
            YTPlayer.pauseVideo();
        }
        if (currentPlatform === 'soundcloud') {
            SCPlayer.pause();
        }
    };
    return (
        <div ref={parentRef} className={`fixed bottom-0 w-full transition-transform translate-y-full`}>
            <div className='flex justify-center' ref={childRef}>
                <div className='w-full'>
                    <div className="bg-gray-100 p-4 shadow-md">
                        <div className="flex items-center">
                            <div className="flex-col px-4 border-r mr-5 1/2 md:w-2/5 flex justify-center lg:w-1/4">
                                <div className="text-sm  text-gray-400" id='artistOfPlayer'></div>
                                <div id='titleOfPlayer'></div>
                            </div>
                            <div className='flex-col'>
                                <div>
                                    <button className='pr-3'>前へ</button>
                                    <button className='pr-3' onClick={onClickPlayButton}>再生</button>
                                    <button className='pr-3' onClick={onClickPauseButton}>停止</button>
                                    <button>次へ</button>
                                </div>
                                {/* シークバー */}
                                <input type="range" min="0" max="100" className="slider" id="myRange"></input>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className='hidden'>
                <div id='YTPlayer'></div>
                <iframe id="SCPlayer" width="100%" height="166" scrolling="no" allow="autoplay"
                    src="https://w.soundcloud.com/player/?url=https://soundcloud.com/sssokudo/sokudo-yukiyanagi-luv-redux">
                </iframe>
            </div>

        </div>

    );
};

export default MusicPlayer;