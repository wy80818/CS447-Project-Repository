import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import TherapistScheduler from "./TherapistScheduler";
import TherapistDashboard from './TherapistDashboard';
import APatientDashboard from './APatientDashboard';
import UPatientDashboard from './UPatientDashboard';
import AdminDashboard from './AdminDashboard'; // ✅ NEW IMPORT

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/therapistscheduler" element={<TherapistScheduler />} />
            <Route path="/therapistdashboard" element={<TherapistDashboard />} />
            <Route path="/patientdashboard" element={<APatientDashboard />} />
            <Route path="/minordashboard" element={<UPatientDashboard />} />
            <Route path="/patientdashboard/:id" element={<APatientDashboard />} />
            <Route path="/minordashboard/:id" element={<UPatientDashboard />} />
            <Route path="/admindashboard" element={<AdminDashboard />} /> {/* ✅ NEW ROUTE */}
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
