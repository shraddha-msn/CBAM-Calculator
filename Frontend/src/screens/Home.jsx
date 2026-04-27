import React from 'react';
import Navbar from '../components/shared/Navbar';
import './Home.css';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-overlay"></div>

        <div className="home-content">
          <h1 className="home-title">CBAM Calculator</h1>
          <p className="home-subtitle">~Generate your report now~</p>
        </div>
      </div>
    </>
  );
}
