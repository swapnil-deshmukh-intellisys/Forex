import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Header = ({ 
  userEmail, 
  onSignOut, 
  onProfileClick, 
  onBack, 
  showBackButton = false,
  isAdmin = false,
  onHomeClick,
  onAccountsClick
}) => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ENGLISH');
  const [showEmail, setShowEmail] = useState(false);
  const languageButtonRef = useRef(null);
  const hamburgerButtonRef = useRef(null);

  const languages = [
    { code: 'ENGLISH', name: 'ENGLISH', flag: '🇺🇸' },
    { code: 'DEUTSCH', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ESPAÑOL', name: 'Español', flag: '🇪🇸' },
    { code: 'ITALIANO', name: 'Italiano', flag: '🇮🇹' },
    { code: 'TÜRKÇE', name: 'TÜRKÇE', flag: '🇹🇷' },
    { code: 'РУССКИЙ', name: 'Русский язык', flag: '🇷🇺' },
    { code: '中文', name: '中文', flag: '🇨🇳' },
    { code: '日本語', name: '日本語', flag: '🇯🇵' },
    { code: '한국어', name: '한국어', flag: '🇰🇷' },
    { code: 'ไทย', name: 'ภาษาไทย', flag: '🇹🇭' },
    { code: 'العربية', name: 'اللغة العربية', flag: '🇸🇦' },
    { code: 'فارسی', name: 'فارسی', flag: '🇮🇷' },
    { code: 'TIẾNG VIỆT', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'NEDERLANDS', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'ROMÂNĂ', name: 'Română', flag: '🇷🇴' },
    { code: 'MAGYAR', name: 'Magyar', flag: '🇭🇺' },
    { code: 'ΕΛΛΗΝΙΚΆ', name: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'SLOVENSKÝ', name: 'Slovenský', flag: '🇸🇰' },
    { code: 'PORTUGUÊS', name: 'Português', flag: '🇵🇹' }
  ];

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    // Check if click is outside language dropdown
    if (isLanguageDropdownOpen && languageButtonRef.current && !languageButtonRef.current.contains(event.target)) {
      const languageDropdown = document.querySelector('[data-dropdown="language"]');
      if (!languageDropdown || !languageDropdown.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    }
    
    // Check if click is outside hamburger menu
    if (isHamburgerMenuOpen && hamburgerButtonRef.current && !hamburgerButtonRef.current.contains(event.target)) {
      const hamburgerDropdown = document.querySelector('[data-dropdown="hamburger"]');
      if (!hamburgerDropdown || !hamburgerDropdown.contains(event.target)) {
        setIsHamburgerMenuOpen(false);
      }
    }

    // Close email popup when clicking outside
    if (showEmail) {
      const userInfoContainer = event.target.closest('.text-center.flex-1.px-2');
      if (!userInfoContainer) {
        setShowEmail(false);
      }
    }
  };

  // Add event listener for clicking outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageDropdownOpen, isHamburgerMenuOpen, showEmail]);

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-accent-color/20 via-accent-color/10 to-accent-color/5 backdrop-blur-md border-b border-border-color shadow-lg">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Left - Back Button and User Info */}
            <div className="flex items-center space-x-3">
              {showBackButton && (
                <button 
                  onClick={onBack}
                  className="group bg-accent-color/10 hover:bg-accent-color/20 p-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* User Info */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowEmail(!showEmail)}
                  className="bg-gradient-to-r from-accent-color to-primary-blue p-1 rounded-full hover:scale-105 transition-transform duration-200"
                >
                  <svg className="w-3 h-3 text-text-quaternary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="hidden sm:flex items-center space-x-2">
                  <button 
                    onClick={onProfileClick}
                    className={`font-semibold text-sm transition-colors cursor-pointer ₹{
                      isAdmin 
                        ? 'text-accent-color hover:text-primary-blue' 
                        : 'text-text-primary hover:text-accent-color'
                    }`}
                  >
                    {userEmail}
                  </button>
                  <div className={`rounded-full px-1.5 py-0.5 flex items-center ₹{
                    isAdmin 
                      ? 'bg-accent-color/10 border border-accent-color/20' 
                      : 'bg-danger-color/10 border border-danger-color/10'
                  }`}>
                    <span className={`text-[0.6rem] font-medium ₹{
                      isAdmin ? 'text-accent-color' : 'text-danger-color'
                    }`}>
                      {isAdmin ? 'ADMIN' : 'UNVERIFIED'}
                    </span>
                  </div>
                </div>
                {/* Mobile email display */}
                {showEmail && (
                  <div className="sm:hidden absolute top-full left-0 mt-2 bg-card-bg/95 backdrop-blur-md border border-border-color rounded-lg p-2 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => {
                        onProfileClick();
                        setShowEmail(false);
                      }}
                      className={`text-xs font-medium mb-1 transition-colors cursor-pointer w-full text-left ₹{
                        isAdmin 
                          ? 'text-accent-color hover:text-primary-blue' 
                          : 'text-text-primary hover:text-accent-color'
                      }`}
                    >
                      {userEmail}
                    </button>
                    <div className={`rounded-full px-1.5 py-0.5 flex items-center justify-center ₹{
                      isAdmin 
                        ? 'bg-accent-color/10 border border-accent-color/20' 
                        : 'bg-danger-color/10 border border-danger-color/10'
                    }`}>
                      <span className={`text-[0.5rem] font-medium ₹{
                        isAdmin ? 'text-accent-color' : 'text-danger-color'
                      }`}>
                        {isAdmin ? 'ADMIN' : 'UNVERIFIED'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center - Empty Space */}
            <div className="flex-1"></div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button className="group bg-accent-color/10 hover:bg-accent-color/20 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-1 sm:space-x-2">
                <svg className="w-3 h-3 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-text-secondary group-hover:text-text-primary transition-colors text-xs font-medium hidden sm:inline">BECOME AN IB</span>
              </button>

              <button 
                onClick={() => window.location.reload()}
                className="group bg-accent-color/10 hover:bg-accent-color/20 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-1 sm:space-x-2"
              >
                <svg className="w-3 h-3 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-text-secondary group-hover:text-text-primary transition-colors text-xs font-medium hidden sm:inline">REFRESH</span>
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  ref={languageButtonRef}
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="group bg-accent-color/10 hover:bg-accent-color/20 px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <svg className="w-3 h-3 text-text-secondary group-hover:text-text-primary transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  <span className="text-text-secondary group-hover:text-text-primary transition-colors text-xs font-medium">{selectedLanguage}</span>
                  <svg className={`w-2.5 h-2.5 transition-transform ₹{isLanguageDropdownOpen ? 'rotate-180' : ''} text-text-secondary group-hover:text-text-primary`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Hamburger Menu */}
              <div className="relative">
                <button
                  ref={hamburgerButtonRef}
                  onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
                  className="group bg-accent-color/10 hover:bg-accent-color/20 p-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Portal Dropdowns */}
      {isLanguageDropdownOpen && languageButtonRef.current && createPortal(
        <div 
          data-dropdown="language"
          className="fixed z-[999999] w-56 sm:w-64 bg-gradient-to-br from-card-bg to-card-bg/95 rounded-2xl shadow-2xl border border-border-color max-h-80 overflow-y-auto backdrop-blur-md"
          style={{
            top: languageButtonRef.current.getBoundingClientRect().bottom + 12,
            left: Math.max(8, languageButtonRef.current.getBoundingClientRect().right - 256),
            right: Math.max(8, window.innerWidth - languageButtonRef.current.getBoundingClientRect().left - 56),
          }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLanguage(language.code);
                setIsLanguageDropdownOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-accent-color/20 transition-all duration-300 ₹{selectedLanguage === language.code ? 'bg-gradient-to-r from-accent-color/30 to-primary-blue/30 text-accent-color' : 'text-text-secondary hover:text-text-primary'
                } ₹{language.code === languages[0].code ? 'rounded-t-2xl' : ''} ₹{language.code === languages[languages.length - 1].code ? 'rounded-b-2xl' : ''}`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {selectedLanguage === language.code && (
                <svg className="w-4 h-4 ml-auto text-accent-color" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}

      {isHamburgerMenuOpen && hamburgerButtonRef.current && createPortal(
        <div 
          data-dropdown="hamburger"
          className="fixed z-[999999] w-48 sm:w-56 bg-card-bg rounded-2xl shadow-2xl border border-border-color backdrop-blur-md"
          style={{
            top: hamburgerButtonRef.current.getBoundingClientRect().bottom + 12,
            left: Math.max(8, hamburgerButtonRef.current.getBoundingClientRect().right - 224),
            right: Math.max(8, window.innerWidth - hamburgerButtonRef.current.getBoundingClientRect().left - 48),
          }}
        >
          <div className="py-3">
            {/* User-only options */}
            {!isAdmin && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onProfileClick();
                    setIsHamburgerMenuOpen(false);
                  }}
                  className="w-full text-left px-6 py-3 text-text-primary hover:bg-hover-bg transition-all duration-300 hover:scale-105 rounded-xl"
                >
                  Profile
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAccountsClick && onAccountsClick();
                    setIsHamburgerMenuOpen(false);
                  }}
                  className="w-full text-left px-6 py-3 text-text-primary hover:bg-hover-bg transition-all duration-300 hover:scale-105 rounded-xl"
                >
                  Accounts
                </button>
              </>
            )}
            
            {/* Common options for both admin and user */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onHomeClick && onHomeClick();
                setIsHamburgerMenuOpen(false);
              }}
              className="w-full text-left px-6 py-3 text-text-primary hover:bg-hover-bg transition-all duration-300 hover:scale-105 rounded-xl"
            >
              Home
            </button>
            <button className="w-full text-left px-6 py-3 text-text-primary hover:bg-hover-bg transition-all duration-300 hover:scale-105 rounded-xl flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Restart application</span>
            </button>
            <div className="border-t border-border-color my-2 mx-4"></div>
            <button
              onClick={onSignOut}
              className={`w-full text-left px-6 py-3 transition-all duration-300 hover:scale-105 rounded-xl flex items-center space-x-2 ₹{
                isAdmin 
                  ? 'text-accent-color hover:bg-accent-color/10' 
                  : 'text-text-primary hover:bg-danger-color/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>{isAdmin ? 'Admin Logout' : 'Sign Out'}</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Header;
