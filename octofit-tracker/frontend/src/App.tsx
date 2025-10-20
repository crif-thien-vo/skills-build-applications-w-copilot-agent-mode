import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">OctoFit Tracker</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/activities">Activities</Link>
              <Link className="nav-link" to="/workouts">Workouts</Link>
              <Link className="nav-link" to="/users">Users</Link>
              <Link className="nav-link" to="/teams">Teams</Link>
              <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
            </div>
          </div>
        </nav>
        
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={
              <div className="bg-primary text-white rounded p-5 mb-4">
                <div className="container-fluid py-5">
                  <h1 className="display-4 fw-bold">Welcome to OctoFit Tracker</h1>
                  <p className="col-md-8 fs-4">Track your fitness activities and compete with your team!</p>
                  <div className="d-flex gap-2 mt-3">
                    <Link className="btn btn-outline-light btn-lg" to="/activities">
                      <i className="bi bi-activity me-2"></i>View Activities
                    </Link>
                    <Link className="btn btn-light btn-lg" to="/leaderboard">
                      <i className="bi bi-trophy me-2"></i>Leaderboard
                    </Link>
                  </div>
                </div>
              </div>
            } />
            <Route path="/activities" element={<Activities />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
