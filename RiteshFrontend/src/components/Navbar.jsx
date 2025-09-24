import React, { useState, useEffect } from 'react';
import TickerTape from '../widgets/TickerTape';
import LogoPng from '../assets/Logo.png';

const Navbar = ({ onSignInClick, onAboutUsClick, onContactUsClick, onHomeClick, onAdminClick, onAccountsClick, currentPage, userEmail, adminEmail }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const marketData = [
    { instrument: 'US 100', value: '18,234.50', change: '+0.45%', isPositive: true },
    { instrument: 'EUR/₹', value: '1.0856', change: '-0.12%', isPositive: false },
    { instrument: 'Bitcoin', value: '₹43,250', change: '+2.34%', isPositive: true },
    { instrument: 'Gold', value: '₹2,045', change: '+0.78%', isPositive: true },
  ];

  const handleHomeClick = () => {
    if (currentPage !== 'home') {
      onHomeClick();
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
    }`}>
      {/* Market Data Ticker */}
      <div className="bg-black">
        <TickerTape />
      </div>

      {/* Main Navigation */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center space-x-3  cursor-pointer" onClick={handleHomeClick}>
              <img src={LogoPng} alt="Express Forex" className="w-32 h-auto object-contain" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button 
                onClick={handleHomeClick}
                className={`font-semibold relative ${
                  currentPage === 'home' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                Home
                {currentPage === 'home' && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
              <button 
                onClick={onAboutUsClick}
                className={`font-medium relative ${
                  currentPage === 'aboutus' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                About Us
                {currentPage === 'aboutus' && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
              <button 
                onClick={onContactUsClick}
                className={`font-medium relative ${
                  currentPage === 'contactus' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                Contact
                {currentPage === 'contactus' && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </button>
              {/* Always visible admin link */}
                <button 
                  onClick={onAdminClick}
                  className={`font-medium relative ${
                  currentPage === 'admin' || currentPage === 'adminlogin' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  Admin
                {(currentPage === 'admin' || currentPage === 'adminlogin') && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>
            </div>

            {/* CTA Button - Shows Sign In when logged out, Accounts when logged in */}
            <div className="hidden lg:block">
              <button 
                onClick={userEmail ? onAccountsClick : onSignInClick}
                className={`font-semibold px-6 py-3 rounded-xl transition-colors ${
                  userEmail 
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' 
                    : 'bg-accent-color text-text-quaternary hover:bg-accent-color/90'
                }`}
              >
                {userEmail ? 'Accounts' : 'Sign In'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => {
                    handleHomeClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left font-semibold ${
                    currentPage === 'home' ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    onAboutUsClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left font-medium ${
                    currentPage === 'aboutus' ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  About Us
                </button>
                <button 
                  onClick={() => {
                    onContactUsClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left font-medium ${
                    currentPage === 'contactus' ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  Contact
                </button>
                {/* Always visible admin link */}
                  <button 
                    onClick={() => {
                      onAdminClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left font-medium ${
                    currentPage === 'admin' || currentPage === 'adminlogin' ? 'text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    Admin
                  </button>
                <button 
                  onClick={() => {
                    if (userEmail) {
                      onAccountsClick();
                    } else {
                      onSignInClick();
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`font-semibold px-6 py-3 rounded-xl transition-colors w-full mt-4 ${
                    userEmail 
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {userEmail ? 'Accounts' : 'Sign In'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;