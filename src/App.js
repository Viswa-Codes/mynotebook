import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './componenets/Navbar';
import { Home } from './componenets/Home';
import { About } from './componenets/About';
import NoteState from './context/notes/Notestate';
import Alert from './componenets/Alert';
import Signup from './componenets/Signup';
import Login from './componenets/Login';

function App() {
  return (
    <>
    <NoteState>
      <Navbar />
      <Alert message="This is an alert message"/>
      <div className="container">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
      </div>
    </NoteState>
    </>
  );
}

export default App;
