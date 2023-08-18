import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import "./MusicPlayer.css";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi";

interface MusicPlayerProps {}

interface Song {
    file: File;
    name: string;
    duration: number;
}

const MusicPlayer = ({}: MusicPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [files, setFiles] = useState<FileList | null>();
    const [audioFiles, setAudioFiles] = useState<File[]>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
            audioRef.current.addEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );
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
                }
            };
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            // audioRef.current.load();
            // setIsPlaying(true);
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

        console.log(`SONGS- ${songs}`);

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
        setCurrentSongIndex(audioFiles.length);

        console.log(`SONGS- ${songs}`);

        if (audioRef.current) {
            audioRef.current.load();
            setIsPlaying(true);
        }
    };

    const playNextSong = () => {
        if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
        } else {
            setCurrentSongIndex(0);
        }
        if (audioRef.current) {
            audioRef.current.load();
            setIsPlaying(true);
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
        <>
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
                        className="highlighted-item"
                        style={{
                            padding: "10px",
                        }}
                        key={index}
                    >
                        {song.name} - {formatTime(song.duration)}
                    </li>
                ))}
            </ul>
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
                            flexDirection: "column",
                            flex: 1,
                            width: "100%",
                        }}
                    >
                        <input
                            type="range"
                            min={0}
                            max={duration}
                            value={currentTime}
                            onChange={(e) => handleSeek(Number(e.target.value))}
                        />
                        <span>
                            {formatTime(currentTime)} / {formatTime(duration)}
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
        </>
    );
};

export default MusicPlayer;
