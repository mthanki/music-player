import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./MusicPlayer.css";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi";
import NowPlaying from "../NowPlaying/NowPLaying";

interface MusicPlayerProps { }

export interface Song {
    file: File;
    name: string;
    duration: number;
}

const MusicPlayer = ({ }: MusicPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [repeatMode, setRepeatMode] = useState<'none' | 'song' | 'all'>('none');
    const [shuffleMode, setShuffleMode] = useState<boolean>(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
            audioRef.current.addEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );
            audioRef.current.addEventListener('ended', handleSongEnd); // Add this line
            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener(
                        "timeupdate",
                        handleTimeUpdate
                    );
                    audioRef.current.removeEventListener(
                        "loadedmetadata",
                        handleLoadedMetadata
                    );
                    audioRef.current.removeEventListener('ended', handleSongEnd); // Add this line
                }
            };
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            setIsPlaying(true);
        }
    }, [currentSongIndex]);

    const createSongsFromFiles = (files: File[]): Song[] => {
        return files.map((file) => ({
            file,
            name: file.name,
            duration: 0,
        }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newFiles = [...event.target.files!];

        const newSongs = createSongsFromFiles(newFiles);
        setSongs((prevSongs) => [...prevSongs, ...newSongs]);

        setCurrentSongIndex(songs.length - 1);
        if (audioRef.current) {
            audioRef.current.load();
            setIsPlaying(true);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const newFiles = [...event.dataTransfer.files];
        const newSongs = createSongsFromFiles(newFiles);

        setSongs((prevSongs) => [...prevSongs, ...newSongs]);
        setCurrentSongIndex(songs.length);
        console.log(`SONGS- ${JSON.stringify(songs)}`);

        if (audioRef.current) {
            audioRef.current.load();
            setIsPlaying(true);
        }
    };

    const handleSongClick = (index: number) => {
        setCurrentSongIndex(index);

        if (audioRef.current) {
            audioRef.current.load();
            setIsPlaying(true);
        }
    };

    const playNextSong = () => {
        if (shuffleMode) {
            const nextSongIndex = getRandomSongIndex();
            setCurrentSongIndex(nextSongIndex);
        } else {
            setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
        }
    };

    const playPreviousSong = () => {
        if (currentSongIndex > 0) {
            setCurrentSongIndex(currentSongIndex - 1);
        } else {
            setCurrentSongIndex(songs.length - 1);
        }

        if (audioRef.current) {
            audioRef.current.load();
            setIsPlaying(true);
        }
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleShuffleMode = () => {
        setShuffleMode(!shuffleMode);
    };

    const toggleRepeatMode = () => {
        const modes: ('none' | 'song' | 'all')[] = ['none', 'song', 'all'];
        const currentIndex = modes.indexOf(repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setRepeatMode(modes[nextIndex]);
    };

    const getRandomSongIndex = () => {
        const remainingSongs = songs.filter((_, index) => index !== currentSongIndex);
        const randomIndex = Math.floor(Math.random() * remainingSongs.length);
        const nextSongIndex = songs.indexOf(remainingSongs[randomIndex]);
        return nextSongIndex;
    }

    const handleSongEnd = () => {
        if (currentSongIndex === songs.length - 1) {
            // Reached the end of the playlist, stop playing
            audioRef.current?.pause();
            setIsPlaying(false);
            setCurrentTime(0);
        } else {
            // Play the next song
            setCurrentSongIndex(currentSongIndex + 1);
        }
    };

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (newTime: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleOpenFilePicker = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div>
            {/* drag and drop area */}
            <div
                onClick={handleOpenFilePicker}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                    width: "99%",
                    height: "100px",
                    border: "3px dashed #ccc",
                    textAlign: "center",
                    lineHeight: "100px",
                    cursor: "pointer",
                    borderRadius: "5px",
                }}
            >
                Click or Drop Audio Files Here
            </div>
            {/* Songs list */}
            <ul className="songs-list" style={{ overflowX: "hidden" }}>
                {songs.map((song, index) => (
                    <li
                        onClick={() => handleSongClick(index)}
                        className={`highlighted-item ${index === currentSongIndex ? 'playing' : ''}`}
                        key={index}
                    >
                        {song.name} - {formatTime(song.duration)}
                    </li>
                ))}
            </ul>
            {/* Now Playing */}
            {/* <NowPlaying song={songs[currentSongIndex]} /> */}
            {currentSongIndex}
            {/* Main Player */}
            <div className="control-panel">
                <div>
                    {/* Hidden audio player */}
                    <audio
                        style={{ display: "none" }}
                        autoPlay
                        ref={audioRef}
                        controls
                    >
                        <source
                            src={
                                songs[currentSongIndex] &&
                                URL.createObjectURL(
                                    songs[currentSongIndex].file
                                )
                            }
                            type="audio/mp3"
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
                            flex: "1 0 100%",
                            marginBottom: '10px',
                        }}
                    >
                        <span>
                            {formatTime(currentTime)}
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={duration}
                            value={currentTime}
                            onChange={(e) => handleSeek(Number(e.target.value))}
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
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            width: "30%",
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

                {/* hidden file picker */}
                <input
                    type="file"
                    accept="audio/*"
                    multiple
                    style={{ display: "none" }}
                    ref={inputFileRef}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;
