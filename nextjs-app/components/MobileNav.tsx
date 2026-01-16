'use client';

import { useState } from 'react';

interface MobileNavProps {
  siteName: string;
}

export default function MobileNav({ siteName }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="mobile-header">
      <nav className="mobile-nav">
        <div className="logo">{siteName}</div>
        <button
          className="hamburger"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        </button>
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li><a href="#home" onClick={closeMenu}>Home</a></li>
          <li><a href="#features" onClick={closeMenu}>Features</a></li>
          <li><a href="#testimonials" onClick={closeMenu}>Testimonials</a></li>
          <li><a href="#faq" onClick={closeMenu}>FAQ</a></li>
          <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}
