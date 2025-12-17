import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './componenets/Navbar';
import { Home } from './componenets/Home';
import { About } from './componenets/About';
import NoteState from './context/notes/Notestate';
import Alert from './componenets/Alert';
import Signup from './componenets/Signup';
import Login from './componenets/Login';
import { useState } from 'react';

function App() {
  const [alert, setAlert] = useState(null);

    const showAlert = (message, type)=>{
      setAlert({
        msg: message,
        type: type
      })
      setTimeout(() => {
          setAlert(null);
      }, 1500);
  }

  return (
    <>
    <NoteState>
      <Navbar />
      <Alert alert={alert}/>
      <div className="container">
      <Routes>
        <Route exact path="/" element={<Home showAlert={showAlert} />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
        <Route exact path="/login" element={<Login showAlert={showAlert} />} />
      </Routes>
      </div>
    </NoteState>
    </>
  );
}

export default App;
