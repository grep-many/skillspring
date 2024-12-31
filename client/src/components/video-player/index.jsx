import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'react-toastify';

export function isValidYouTubeURL(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?.*v=|playlist\?|embed\/)|youtu\.be\/)([\w-]{11}(&.*)?|.*list=([\w-]+))/;
    return youtubeRegex.test(url);
}

const VideoPlayer = ({ play = 'true', width = "100%", height = "100%", url, thumbnail, onProgressUpdate, progressData }) => {

    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5)
    const [muted, setMuted] = useState(false)
    const [played, setPlayed] = useState(0)
    const [seeking, setSeeking] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    function handlePlayAndPause() {
        setPlaying(!playing)
    }    

    function handleProgress(state) {
        if (!seeking) {
            setPlayed(state.played)
        }
    }

    function handleRewind() {
        playerRef?.current.seekTo(playerRef?.current.getCurrentTime() - 5)
    }

    function handleForward() {
        playerRef?.current.seekTo(playerRef?.current.getCurrentTime() + 5)
    }

    function handleToggleMute() {
        setMuted(!muted)
    }

    function handleSeekChange(value) {
        setPlayed(value[0]);
        setSeeking(true)
    }

    function handleSeekMouseUp() {
        setSeeking(false)
        playerRef.current?.seekTo(played)
    }

    function handleVolumeChange(value) {
        setVolume(value[0])
    }

    function handleMouseMove() {
        setShowControls(true);
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500)
    }

    const handleFullScreen = useCallback(() => {
        if (!isFullScreen) {
            // Enter fullscreen
            if (playerContainerRef.current.requestFullscreen) {
                playerContainerRef.current.requestFullscreen();
            } else if (playerContainerRef.current.webkitRequestFullscreen) {
                // Safari
                playerContainerRef.current.webkitRequestFullscreen();
            } else if (playerContainerRef.current.msRequestFullscreen) {
                // IE/Edge
                playerContainerRef.current.msRequestFullscreen();
            } else {
                toast.error("Fullscreen API is not supported in this browser.");
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                // Safari
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                // IE/Edge
                document.msExitFullscreen();
            } else {
                toast.error("Fullscreen exit API is not supported in this browser.");
            }
        }
    }, [isFullScreen]);

    function pad(string) {
        return ("0" + string).slice(-2)
    }

    function formatTime(seconds) {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds();

        if (hh) {
            return `${hh}:${pad(mm)}:${pad(ss)}`
        }
        return `${mm}:${pad(ss)}`
    }

    const handleClickControl = (e) => {
        if (playerContainerRef.current) {
            const { width, left } = playerContainerRef.current.getBoundingClientRect();
            const clickPosition = e.clientX - left;

            if (clickPosition < width / 2) {
                // Left side clicked - rewind
                handleRewind();
            } else {
                // Right side clicked - forward
                handleForward();
            }
        }
    };

    useEffect(() => {
        if (played === 1 && typeof onProgressUpdate === 'function') {
            onProgressUpdate({
                ...progressData,
                progressValue: played
            })
        }
    }, [played])

    useEffect(() => {
        if (url) {
            // Keep the video playing when the URL changes
            setPlaying(!play?play:true);
        }
    }, [url]);

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleFullScreenChange)

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange)
        }
    }, [])


    return (
        <div
            ref={playerContainerRef}
            className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out
                ${isFullScreen ? 'w-screen h-screen' : 'w-full'}`
            }
            style={{ width, height }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTimeout(() => setShowControls(false), 2500)}
            onDoubleClick={handleClickControl}
        >
            {isValidYouTubeURL(url) ? (
                <iframe
                    className='absolute top-0 left-0 w-full h-full'
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${(new URL(url).searchParams.get('v'))||(new URL(url).pathname.split('/')[1])}?rel=0&modestbranding=1&showinfo=0`}
                    // src={`https://www.youtube.com/embed/${new URL(url).pathname.split('/')[1]}?rel=0&modestbranding=1&showinfo=0`}
                    allowFullScreen
                ></iframe>
            ) : (
                <ReactPlayer
                    ref={playerRef}
                    className='absolute top-0 left-0'
                    width={'100%'}
                    height={'100%'}
                    url={url}
                    light={thumbnail || false}
                    playing={playing}
                    volume={volume}
                    muted={muted}
                    onProgress={handleProgress}
                    onClickPreview={() => setPlaying(true)}
                    onEnded={() => setPlaying(false)}
                />
            )}
            {
                showControls && <div className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration-300 
                    ${showControls ? 'opacity-100' : 'opacity-0'}
                `}>
                    <Slider
                        value={[played * 100]}
                        max={100}
                        step={0.1}
                        onValueChange={(value) => handleSeekChange([value[0] / 100])}
                        onValueCommit={handleSeekMouseUp}
                        className='w-full mb-4 cursor-pointer'
                    />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={handlePlayAndPause}
                                className='text-white bg-transparent hover:text-white hover:bg-gray-700'
                            >
                                {playing ? <Pause className='h-6 w-6' /> : <Play className='h-6 w-6' />}
                            </Button>
                            <Button
                                variant="ghost"
                                size='icon'
                                onClick={handleRewind}
                                className='text-white bg-transparent hover:text-white hover:bg-gray-700'
                            >
                                <RotateCcw className='h-6 w-6' />
                            </Button>
                            <Button
                                variant="ghost"
                                size='icon'
                                onClick={handleForward}
                                className='text-white bg-transparent hover:text-white hover:bg-gray-700'
                            >
                                <RotateCw className='h-6 w-6' />
                            </Button>
                            <Button
                                variant="ghost"
                                size='icon'
                                onClick={handleToggleMute}
                                className='text-white bg-transparent hover:text-white hover:bg-gray-700'
                            >
                                {muted ? <VolumeX className='h-6 w-6' /> : <Volume2 className='h-6 w-6' />}
                            </Button>
                            <Slider
                                value={[volume * 100]}
                                max={100}
                                step={1}
                                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                                className='md:flex hidden  w-24 cursor-pointer'
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="text-white">
                                {
                                    formatTime(played * (playerRef?.current?.getDuration() || 0))
                                }/{
                                    formatTime(playerRef?.current?.getDuration() || 0)
                                }
                            </div>
                            <Button
                                variant="ghost"
                                size='icon'
                                onClick={handleFullScreen}
                                className='text-white bg-transparent mr-2 hover:text-white hover:bg-gray-700'
                            >
                                {isFullScreen ? <Minimize className='h-6 w-6' /> : <Maximize className='h-6 w-6' />}
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}

export default VideoPlayer;
