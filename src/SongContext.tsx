import React, { ReactNode, createContext, useContext, useReducer } from 'react';
import { getRandomSongIndex } from './utils';

interface Song {
    file: File;
    name: string;
    duration: number;
    albumArt?: string;
}

type SongAction =
    | { type: 'SET_SONGS'; payload: Song[] }
    | { type: 'SET_CURRENT_SONG_INDEX'; payload: number }
    | { type: 'TOGGLE_PLAY_PAUSE'; payload?: boolean } // Updated action type
    | { type: 'PLAY_NEXT_SONG' }
    | { type: 'PLAY_PREVIOUS_SONG' }
    | { type: 'TOGGLE_SHUFFLE' }
    | { type: 'TOGGLE_REPEAT' }
    | { type: 'UPDATE_CURRENT_TIME'; payload: number }
    | { type: 'UPDATE_DURATION'; payload: number };


interface SongState {
    songs: Song[];
    currentSongIndex: number;
    isPlaying: boolean;
    shuffleMode: boolean;
    repeatMode: 'none' | 'song' | 'all';
    currentTime: number;
    duration: number;
}

interface SongContextType {
    state: SongState;
    dispatch: React.Dispatch<SongAction>;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

const songReducer = (state: SongState, action: SongAction): SongState => {
    switch (action.type) {
        case 'SET_SONGS':
            return { ...state, songs: action.payload };
        case 'SET_CURRENT_SONG_INDEX':
            return { ...state, currentSongIndex: action.payload };
        case 'TOGGLE_PLAY_PAUSE':
            return {
                ...state,
                isPlaying: action.payload !== undefined ? action.payload : !state.isPlaying,
            };
        case 'PLAY_NEXT_SONG':
            const nextSongIndex = state.shuffleMode
                ? getRandomSongIndex(state.currentSongIndex, state.songs.length)
                : (state.currentSongIndex + 1) % state.songs.length;
            return { ...state, currentSongIndex: nextSongIndex };
        case 'PLAY_PREVIOUS_SONG':
            return {
                ...state,
                currentSongIndex: (state.currentSongIndex - 1 + state.songs.length) % state.songs.length,
            };
        case 'TOGGLE_SHUFFLE':
            return { ...state, shuffleMode: !state.shuffleMode };
        case 'TOGGLE_REPEAT':
            return {
                ...state,
                repeatMode: state.repeatMode === 'none' ? 'all' : state.repeatMode === 'all' ? 'song' : 'none',
            };
        case 'UPDATE_CURRENT_TIME':
            return { ...state, currentTime: action.payload };
        case 'UPDATE_DURATION':
            return { ...state, duration: action.payload };
        default:
            return state;
    }
};

export const SongProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(songReducer, {
        songs: [], // Initial songs array
        currentSongIndex: -1,
        isPlaying: false,
        shuffleMode: false,
        repeatMode: 'none',
        currentTime: 0,
        duration: 0,
    });

    return (
        <SongContext.Provider value={{ state, dispatch }}>
            {children}
        </SongContext.Provider>
    );
};

export const useSongContext = () => {
    const context = useContext(SongContext);
    if (!context) {
        throw new Error('useSongContext must be used within a SongProvider');
    }
    return context;
};
