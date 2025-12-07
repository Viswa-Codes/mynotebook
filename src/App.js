import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './componenets/Navbar';
import { Home } from './componenets/Home';
import { About } from './componenets/About';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
