import { Song } from "./music-player/MusicPlayer";

// utils.ts
export const getRandomSongIndex = (currentIndex: number, totalSongs: number): number => {
    const remainingSongs = Array.from({ length: totalSongs }, (_, index) => index).filter(index => index !== currentIndex);
    const randomIndex = Math.floor(Math.random() * remainingSongs.length);
    return remainingSongs[randomIndex];
};

export const createSongsFromFiles = async (files: File[]): Promise<Song[]> => {
    const songPromises = files.map(async (file) => {
        const duration = await getAudioDuration(file);
        return {
            file,
            name: file.name,
            duration,
        };
    });

    const songs = await Promise.all(songPromises);
    return songs;
};

export const getAudioDuration = async (file: File): Promise<number> => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);

    return new Promise<number>((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
            resolve(audio.duration);
        });
    });
};

export const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};