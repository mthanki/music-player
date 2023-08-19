import React from "react";
import { useSongContext } from "../SongContext";

const NowPlaying: React.FC<{}> = () => {
    const { state } = useSongContext();
    const { songs, currentSongIndex } = state;
    const currentSong = songs[currentSongIndex];

    if (!currentSong) {
        return null; // No song is currently playing
    }

    const { name } = currentSong;

    return (
        <h2>{name}</h2>
    );
};

export default NowPlaying;
