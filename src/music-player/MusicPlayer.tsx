import "./MusicPlayer.css";
import { useEffect, useRef } from "react";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi";
import NowPlaying from "../NowPlaying/NowPLaying";
import { useSongContext } from "../SongContext";
import { formatTime, getRandomSongIndex } from "../utils";

export interface Song {
    file: File;
    name: string;
    duration: number;
}

const MusicPlayer = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { state, dispatch } = useSongContext();
    const { songs, currentSongIndex, isPlaying, shuffleMode, repeatMode, duration, currentTime } = state;

    useEffect(() => {
        console.log('songindexchange', currentSongIndex)
        if (audioRef.current) {
            audioRef.current.load();
            dispatch({ type: 'TOGGLE_PLAY_PAUSE', payload: true });
        }
    }, [currentSongIndex]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        console.log('metadata has been loaded duration is', duration)
    }, [duration]);

    const togglePlayPause = () => {
        dispatch({ type: 'TOGGLE_PLAY_PAUSE' });
    };

    const playNextSong = () => {
        dispatch({ type: 'PLAY_NEXT_SONG' });
    };

    const playPreviousSong = () => {
        dispatch({ type: 'PLAY_PREVIOUS_SONG' });
    };

    const toggleShuffleMode = () => {
        dispatch({ type: 'TOGGLE_SHUFFLE' });
    };

    const toggleRepeatMode = () => {
        dispatch({ type: 'TOGGLE_REPEAT' });
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            dispatch({ type: 'UPDATE_CURRENT_TIME', payload: audioRef.current.currentTime });
        }
    };

    const handleSongEnd = () => {
        if (audioRef.current && repeatMode === 'song') {
            audioRef.current.currentTime = 0;
            dispatch({ type: 'UPDATE_CURRENT_TIME', payload: 0 });
            audioRef.current?.play();
        } else if (shuffleMode) {
            const nextSongIndex = getRandomSongIndex(currentSongIndex, songs.length);
            dispatch({ type: 'SET_CURRENT_SONG_INDEX', payload: nextSongIndex });
        } else if (repeatMode === 'all') {
            dispatch({ type: 'PLAY_NEXT_SONG' });
        } else {
            if (currentSongIndex === songs.length - 1) {
                audioRef.current?.pause();
                dispatch({ type: 'SET_CURRENT_SONG_INDEX', payload: 0 });
                dispatch({ type: 'UPDATE_CURRENT_TIME', payload: 0 });
                dispatch({ type: 'TOGGLE_PLAY_PAUSE', payload: false });
            } else {
                dispatch({ type: 'PLAY_NEXT_SONG' });
            }
        }
    };

    const handleLoadedMetadata: React.ReactEventHandler<HTMLAudioElement> = (event) => {
        const newDuration = event.currentTarget.duration;
        console.log('METADATA LOADED', newDuration, songs[currentSongIndex].file);
        dispatch({ type: 'UPDATE_DURATION', payload: newDuration });
    };

    const handleSeek: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const newCurrentTime = parseFloat(event.target.value);

        // Update the currentTime property of the audio player
        if (audioRef.current) {
            audioRef.current.currentTime = newCurrentTime;
        }

        dispatch({ type: 'UPDATE_CURRENT_TIME', payload: newCurrentTime });
    };

    return (
        <div>
            <div className="control-panel">
                <NowPlaying />
                <div>
                    {/* Hidden audio player */}
                    <audio
                        autoPlay
                        style={{ display: "none" }}
                        ref={audioRef}
                        controls
                        onEnded={handleSongEnd}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                    >
                        <source
                            src={
                                songs[currentSongIndex] &&
                                URL.createObjectURL(
                                    songs[currentSongIndex].file
                                )
                            }
                        />
                        Your browser does not support the audio element.
                    </audio>
                </div>
                {/* Progress and Controls */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                    }}
                >
                    {/* Progress display */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            flex: 1,
                            width: "100%",
                            marginBottom: '10px',
                        }}
                    >
                        <span>
                            {formatTime(currentTime)}
                        </span>
                        <input
                            style={{
                                width: "100%",
                            }}
                            type="range"
                            min={0}
                            max={duration}
                            value={currentTime}
                            onChange={(e) => handleSeek(e)}
                        />
                        <span>
                            {formatTime(duration)}
                        </span>
                    </div>
                    {/* Player controls */}
                    <div
                        style={{
                            flexDirection: "row",
                            display: "flex",
                            flex: 1,
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}
                    >
                        <button
                            onClick={toggleShuffleMode}
                            className="control-button small"
                        >
                            {shuffleMode ? 'ON' : 'OFF'}
                        </button>
                        <button
                            onClick={playPreviousSong}
                            className="control-button small"
                        >
                            <BiSkipPreviousCircle size={30} />
                        </button>
                        <button
                            onClick={togglePlayPause}
                            className="control-button"
                        >
                            {isPlaying ? (
                                <BsPauseFill size={30} />
                            ) : (
                                <BsPlayFill size={30} />
                            )}
                        </button>
                        <button
                            onClick={playNextSong}
                            className="control-button small"
                        >
                            <BiSkipNextCircle size={30} />
                        </button>
                        <button
                            onClick={toggleRepeatMode}
                            className="control-button small"
                        >
                            {repeatMode}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
