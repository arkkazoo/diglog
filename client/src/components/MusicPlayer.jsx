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

    const [currentTime, setCurrentTime] = useState(0);
    const [currentTimeMin, setCurrentTimeMin] = useState("-");
    const [currentTimeSec, setCurrentTimeSec] = useState("--");
    const [duration, setDuration] = useState(1);
    const [durationMin, setDurationMin] = useState("-");
    const [durationSec, setDurationSec] = useState("--");
    const [requestId, setRequestId] = useState(null);

    const [isSeeking, setIsSeeking] = useState(false);

    const { trackData, setTrackData } = useContext(MyContext);
    const { isPlaying, setIsPlaying } = useContext(MyContext);
    const { queuedTracks, setQueuedTracks } = useContext(MyContext);

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

    useEffect(() => {
        if (currentPlatform === 'soundcloud') {
            if (isSeeking) {
                SCPlayer.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
            }
            if (!isSeeking) {
                SCPlayer.bind(window.SC.Widget.Events.PLAY_PROGRESS, function () {
                    SCPlayer.getPosition(function (currentTimeMilliSec) {
                        const currentTime = currentTimeMilliSec / 1000;
                        const currentTimeMin = Math.floor(currentTime / 60);
                        let currentTimeSec = Math.floor(currentTime % 60);
                        if (currentTimeSec < 10) {
                            currentTimeSec = `0${currentTimeSec}`;
                        }
                        setCurrentTime(currentTime);
                        setCurrentTimeMin(currentTimeMin);
                        setCurrentTimeSec(currentTimeSec);
                    });
                });
            }
        }
    }, [isSeeking]
    );

    useEffect(() => {
        if (!isPlaying && queuedTracks.length > 0) {
            setTrackData(queuedTracks[0]);
            setQueuedTracks(queuedTracks.slice(1));
        }
    }, [isPlaying]
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

    const resetTime = () => {
        // requestIdがあればrequestAnimationFrameを止める
        if (requestId !== null) {
            cancelAnimationFrame(requestId);
        }
        setCurrentTime(0);
        setDuration(1);
        setCurrentTimeMin("-");
        setCurrentTimeSec("--");
        setDurationMin("-");
        setDurationSec("--");
    };

    const generateNewYTPlayer = (id) => {
        setCurrentPlatform('youtube');
        const newYTPlayer = new window.YT.Player('YTPlayer', {
            videoId: id,
            events: {
                onReady: (event) => {
                    const newDuration = event.target.getDuration();
                    setDuration(newDuration);
                    const durationMin = Math.floor(newDuration / 60);
                    let durationSec = Math.floor(newDuration % 60);

                    if (durationSec < 10) {
                        durationSec = `0${durationSec}`;
                    }

                    setDurationMin(durationMin);
                    setDurationSec(durationSec);
                    setCurrentTime(0);
                    setCurrentTimeMin(0);
                    setCurrentTimeSec("00");
                    setIsPlaying(true);
                    event.target.playVideo();
                },
                onStateChange: (event) => {
                    if (event.data === window.YT.PlayerState.PLAYING) {
                        // プレイヤーが再生中の場合、再生位置をリアルタイムに更新
                        const updateCurrentTime = () => {
                            // 分秒に変換
                            const currentTimeMin = Math.floor(event.target.getCurrentTime() / 60);
                            let currentTimeSec = Math.floor(event.target.getCurrentTime() % 60);
                            if (currentTimeSec < 10) {
                                currentTimeSec = `0${currentTimeSec}`;
                            }
                            setCurrentTime(event.target.getCurrentTime());
                            setCurrentTimeMin(currentTimeMin);
                            setCurrentTimeSec(currentTimeSec);
                            // currentTimeをリセットできるようにrequestIdをもらう
                            setRequestId(requestAnimationFrame(updateCurrentTime));
                        };
                        updateCurrentTime();
                    }
                    if (event.data === window.YT.PlayerState.ENDED) {
                        setIsPlaying(false);
                    }
                },
            },
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
        widget1.bind(window.SC.Widget.Events.READY, function () {
            // youtubeの音圧が低すぎる！！！
            widget1.setVolume(40);
            widget1.getDuration(function (durationMilliSec) {
                const duration = durationMilliSec / 1000;
                const durationMin = Math.floor(duration / 60);
                let durationSec = Math.floor(duration % 60);
                if (durationSec < 10) {
                    durationSec = `0${durationSec}`;
                }
                setDurationMin(durationMin);
                setDurationSec(durationSec);
                setDuration(duration);
                setCurrentTime(0);
                setCurrentTimeMin(0);
                setCurrentTimeSec("00");
                setIsPlaying(true);
            });
        });
        widget1.bind(window.SC.Widget.Events.PLAY_PROGRESS, function (e) {
            const currentTime = e.currentPosition / 1000;
            const currentTimeMin = Math.floor(currentTime / 60);
            let currentTimeSec = Math.floor(currentTime % 60);
            if (currentTimeSec < 10) {
                currentTimeSec = `0${currentTimeSec}`;
            }
            setCurrentTimeMin(currentTimeMin);
            setCurrentTimeSec(currentTimeSec);
            setCurrentTime(currentTime);
        });
        // 再生が終わったら、isPlayingをfalseにする
        widget1.bind(window.SC.Widget.Events.FINISH, function () {
            setIsPlaying(false);
        });

        setSCPlayer(widget1);
    };

    const playYT = (src) => {
        if (currentPlatform === 'soundcloud') {
            SCPlayer.pause();
            SCPlayer.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
        }
        if (currentPlatform === 'youtube') {
            YTPlayer.pauseVideo();
            YTPlayer.destroy();
        }
        resetTime();
        generateNewYTPlayer(src);
        if (!isMenuOpen) {
            toggleMenu();
        }
    };

    const playSC = (url) => {
        if (currentPlatform === 'youtube') {
            YTPlayer.pauseVideo();
            YTPlayer.destroy();
        }
        if (currentPlatform === 'soundcloud') {
            SCPlayer.pause();
            SCPlayer.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
        }
        resetTime();
        generateNewSCPlayer(url);
        if (!isMenuOpen) {
            toggleMenu();
        }
    }

    const onSliderChange = (event) => {
        if (requestId !== null && currentPlatform === 'youtube') {
            cancelAnimationFrame(requestId);
        }
        const targetTime = event.target.value * 1 / 1000 * duration;
        if (currentPlatform === 'youtube') {
            YTPlayer.seekTo(targetTime);
        } else {
            SCPlayer.seekTo(targetTime * 1000);
        }
        setCurrentTime(targetTime);
    };

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

    const onClickSkip = () => {
        const endTime = duration - 0.01;
        if (currentPlatform === 'youtube') {
            YTPlayer.seekTo(endTime);
        }
        if (currentPlatform === 'soundcloud') {
            SCPlayer.seekTo(endTime * 1000);
        }
    };

    const onClickBackToStart = () => {
        if (currentPlatform === 'youtube') {
            YTPlayer.seekTo(0);
        }
        if (currentPlatform === 'soundcloud') {
            SCPlayer.seekTo(0);
        }
    };

    return (
        <div ref={parentRef} className={`fixed bottom-0 w-full transition-transform translate-y-full`}>
            <div className='flex justify-center' ref={childRef}>
                <div className='w-full'>
                    <div className="bg-white shadow-md border">
                        <div className="flex flex-row items-center">
                            <div className='w-1/4 h-auto'>
                                <div className="flex-col px-4 py-2 border-r flex justify-center">
                                    <div className="overflow-hidden" id='artistOfPlayer'></div>
                                    <span className='font-bold text-lg overflow-hidden whitespace-nowrap' id='titleOfPlayer'></span>
                                </div>
                            </div>
                            <div className='w-1/2  border-r h-auto'>
                                <div className='flex justify-center items-center px-4'>
                                    <div className='w-12 text-center'>
                                        {currentTimeMin}:{currentTimeSec}
                                    </div>
                                    <input type="range" min="0" max="1000" value={(currentTime / duration) * 1000}
                                        onChange={onSliderChange}
                                        onMouseDown={() => setIsSeeking(true)}
                                        onMouseUp={() => setIsSeeking(false)}
                                        className="h-1 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700 grow"
                                        id="myRange">
                                    </input>
                                    <div className='w-12 text-center'>
                                        {durationMin}:{durationSec}
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-1/4 h-auto'>
                                <button onClick={onClickBackToStart} className='pr-3 flex-1'>|◁</button>
                                <button className='pr-3 flex-1' onClick={onClickPlayButton}>▷</button>
                                <button className='pr-3 flex-1' onClick={onClickPauseButton}>II</button>
                                <button onClick={onClickSkip} className=' flex-1'>▷|</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div style={{ position: 'absolute', left: '-9999px' }}>
                <div id='YTPlayer'></div>
                <iframe id="SCPlayer" width="100%" height="166" scrolling="no" allow="autoplay"
                    src="https://w.soundcloud.com/player/?url=https://soundcloud.com/sssokudo/sokudo-yukiyanagi-luv-redux">
                </iframe>
            </div>


        </div>

    );
};

export default MusicPlayer;