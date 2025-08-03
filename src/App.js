// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GeneratorLog from './components/GeneratorLog';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>Generator App</h1>
        <nav>
          <Link to="/">Generator Log</Link>
        </nav>
        <Routes>
          <Route path="/" element={<GeneratorLog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
