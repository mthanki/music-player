import "./SongList.css";
import React, { useRef, useState } from 'react';
import { useSongContext } from '../SongContext';
import { formatTime } from "../utils";

interface SongListProps { }

const SongList: React.FC<SongListProps> = () => {
    const { state, dispatch } = useSongContext();
    const { songs, currentSongIndex } = state;
    const inputFileRef = useRef<HTMLInputElement | null>(null);

    //for applying class
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const handleClickDown = () => {
        setIsClicked(true);
    };

    const handleClickRelease = () => {
        setIsClicked(false);
    };

    const handleSongClick = (index: number) => {
        dispatch({ type: 'SET_CURRENT_SONG_INDEX', payload: index });
    };

    const handleOpenFilePicker = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleFileEvent = (droppedFiles: FileList | null) => {
        console.log('@1droppedfiles', droppedFiles);
        if (droppedFiles) {
            const newSongs = Array.from(droppedFiles)
                .filter(file => !songs.some(song => song.file.name === file.name)) // Filter out duplicates
                .map(file => ({ file, name: file.name, duration: 0 }));

            console.log('@2droppedfiles newsongs', newSongs);
            if (newSongs.length > 0) {
                const updatedSongs = [...songs, ...newSongs];
                dispatch({ type: 'SET_SONGS', payload: updatedSongs });
                dispatch({ type: 'SET_CURRENT_SONG_INDEX', payload: songs.length }); // Set new song as the current song

                console.log('@3dispatched events', songs.length);
            }
        }
    };

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const droppedFiles = event.target.files;
        handleFileEvent(droppedFiles);
    };

    const handleFileDrop: React.DragEventHandler<HTMLDivElement> = async (event) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        handleFileEvent(droppedFiles);
    };

    return (
        <div onDrop={handleFileDrop} onDragOver={handleDragOver} className="song-list-container">
            <input
                type="file"
                accept="audio/*"
                multiple
                style={{ display: "none" }}
                ref={inputFileRef}
                onChange={handleFileChange}
            />
            <ul className="songs-list">
                {!songs.length && <div
                    onMouseDown={handleClickDown}
                    onMouseUp={handleClickRelease}
                    onMouseLeave={handleClickRelease} // Handle case if mouse leaves while clicking
                    className={`no-songs-message ${isClicked ? 'clicked' : ''}`} onClick={handleOpenFilePicker}>
                    Click or Drop Audio Files Here
                </div>}
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
        </div>
    );
};

export default SongList;
