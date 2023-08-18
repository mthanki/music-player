import {
    ChangeEvent,
    createContext,
    useContext,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react";
import "./App.css";
import MusicPlayer from "./music-player/MusicPlayer";

function App() {
    return (
        <section className="App">
            <MusicPlayer />
        </section>
    );
}

export default App;
