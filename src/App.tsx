import "./App.css";
import Container from "./Container/Container";
import MusicPlayer from "./music-player/MusicPlayer";
import { SongProvider } from './SongContext'; // Import the SongProvider
import SongList from "./SongList/SongList";

function App() {
    return (
        <section className="App">
            <SongProvider>
                <Container>
                    <SongList />
                    <MusicPlayer />
                </Container>
            </SongProvider>
        </section>
    );
}

export default App;
