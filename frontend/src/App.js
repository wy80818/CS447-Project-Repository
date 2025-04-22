import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import TherapistDashboard from "./TherapistDashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/therapistdashboard" element={<TherapistDashboard />} />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
