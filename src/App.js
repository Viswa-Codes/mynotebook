import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './componenets/Navbar';
import { Home } from './componenets/Home';
import { About } from './componenets/About';
import NoteState from './context/notes/Notestate';

function App() {
  return (
    <>
    <NoteState>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
      </Routes>
    </NoteState>
    </>
  );
}

export default App;
