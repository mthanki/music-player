import React from "react";
import { Song } from "../music-player/MusicPlayer";

interface NowPlayingProps {
    song: Song | null;
}

const NowPlaying: React.FC<NowPlayingProps> = ({ song }) => {
    if (!song) {
        return null; // No song is currently playing
    }

    const { name } = song;

    return (
        <div>
            <div>
                <img
                    style={{ height: '200px' }}
                    src="https://via.placeholder.com/200.png/09f/fff"
                    alt="Album Art"
                />
                <h2>{name}</h2>
            </div>
        </div>
    );
};

export default NowPlaying;
