import React from 'react';
import './styles/landing.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Maps from './components/Maps';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main role="main">

  <Hero />

  <Mission />

  <Features />

        <section id="visualizations">
          <Maps />
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
