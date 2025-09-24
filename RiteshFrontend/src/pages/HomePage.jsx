import React, { useState, useRef } from 'react';
import MiniChartUsd from '../widgets/MiniChartUsd';
import MiniChartGold from '../widgets/MiniChartGold';
import Squares from '../backgrounds/Square.jsx';
import { 
  FaChartLine, 
  FaGlobe, 
  FaRupeeSign, 
  FaShieldAlt,
  FaBolt,
  FaCheck
} from 'react-icons/fa';


const HomePage = ({ onSignUpClick }) => {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const carouselRef = useRef(null);

  const features = [
    { icon: FaChartLine, title: "Ultra-Low Spreads", desc: "on XAU₹ EUR₹" },
    { icon: FaGlobe, title: "200+ Instruments", desc: "Forex, Crypto & More" },
    { icon: FaRupeeSign, title: "₹50 Minimum", desc: "Start with just ₹50" },
    { icon: FaShieldAlt, title: "24/7 Support", desc: "Round-the-clock assistance" }
  ];



  const promotions = [
    {
      bonus: "Standard",
      description: "Start trading with standard account",
      minDeposit: "$50",
      features: ["Instant credit", "No hidden fees", "Trade immediately"],
      popular: true
    },
    {
      bonus: "Premium",
      description: "Advanced features for serious traders",
      minDeposit: "$100",
      features: ["Priority support", "Advanced analytics", "Lower spreads"],
      popular: false
    },
    {
      bonus: "Platinum",
      description: "Premium trading experience with exclusive benefits",
      minDeposit: "$200",
      features: ["Personal account manager", "VIP support", "Exclusive market insights"],
      popular: false
    }
  ];

  const handlePreviousPromo = () => {
    setCurrentPromoIndex((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
  };

  const handleNextPromo = () => {
    setCurrentPromoIndex((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
  };


  return (
    <div className="pt-24 bg-bg-primary min-h-screen overflow-hidden">
        

      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-color/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary-blue/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-accent-color/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bg-primary to-bg-secondary py-20 relative">
      
        <div className="absolute top-10 right-10 w-20 h-20 bg-accent-color/10 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-accent-color/10 rounded-full animate-bounce delay-300"></div>
        
        <div className="container-custom relative z-10">
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              
              <div className="inline-flex items-center bg-gradient-to-r SCALPER MODEfrom-accent-color/20 to-primary-blue/20 text-accent-color px-4 py-2 rounded-full shadow-lg animate-pulse">
                <FaBolt className="mr-2" />
                <span>Trusted by 12,400+ Traders</span>
            </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="text-text-primary">Trade Smarter</span>
                <br />
                <span className="text-accent-color bg-gradient-to-r from-accent-color to-primary-blue bg-clip-text text-transparent bg-300% animate-gradient">Trade Faster</span>
            </h1>
              <p className="text-xl text-text-secondary">
                Experience the fastest deposit and withdrawal fastest trade execution fastest support services.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={onSignUpClick}
                  className="bg-accent-color text-text-quaternary font-semibold px-8 py-4 rounded-xl hover:bg-accent-color/90 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-accent-color/30"
                >
                  Register Live
                </button>
                <button className="bg-transparent border-2 border-accent-color text-accent-color font-semibold px-8 py-4 rounded-xl hover:bg-accent-color/10 transition-all duration-300 transform hover:-translate-y-1">
                  Register Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card-bg backdrop-blur-sm border border-border-color p-6 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-28 h-28 bg-accent-color/10 rounded-full blur-xl"></div>
                <div className="relative z-10">
                  
                  <div className="w-full h-full">
                    <MiniChartUsd />
            </div>
          </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-bg-secondary relative">
        <div className="absolute -top-10 left-1/2 w-24 h-24 bg-accent-color/5 rounded-full blur-2xl"></div>
        
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-text-primary">
              Why Choose <span className="text-accent-color bg-gradient-to-r from-accent-color to-primary-blue bg-clip-text text-transparent">Express Forex</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-card-bg backdrop-blur-sm border border-border-color p-8 rounded-2xl text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent-color/10 group relative overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-color/10 to-primary-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300 text-accent-color">
                      <feature.icon />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-text-primary text-center">{feature.title}</h3>
                  <p className="text-text-secondary text-center">{feature.desc}</p>
          </div>
          </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Exclusive Bonuses Section */}
      <section className="py-20 bg-bg-secondary relative">
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-accent-color/5 rounded-full blur-2xl"></div>
        
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-text-primary">Account</span> <span className="text-accent-color bg-gradient-to-r from-accent-color to-primary-blue bg-clip-text text-transparent">Types</span>
            </h2>
            <p className="text-xl text-text-secondary">Choose the account that fits your trading style</p>
          </div>
          
          {/* Horizontal Carousel Container */}
          <div className="relative">
            {/* Navigation Arrows */}
            <button 
              onClick={handlePreviousPromo}
              className="absolute -left-2 sm:left-0 top-1/2 transform -translate-y-1/2 z-10 text-accent-color hover:text-accent-color/80 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={handleNextPromo}
              className="absolute -right-2 sm:right-0 top-1/2 transform -translate-y-1/2 z-10 text-accent-color hover:text-accent-color/80 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Content */}
            <div className="flex justify-center px-8 sm:px-12">
              <div 
                ref={carouselRef}
                className="bg-card-bg backdrop-blur-sm border border-border-color p-6 sm:p-8 rounded-2xl relative transition-all duration-500 hover:-translate-y-3 max-w-sm sm:max-w-lg mx-auto"
                style={{
                  minHeight: '480px',
                  width: '100%',
                  maxWidth: '420px'
                }}
              >
                {promotions[currentPromoIndex].popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-pulse">
                    <span className="bg-gradient-to-r from-accent-color to-primary-blue text-text-quaternary px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-accent-color mb-2 transform hover:scale-110 transition-transform duration-300">{promotions[currentPromoIndex].bonus}</div>
                </div>
                <p className="text-text-secondary mb-6 text-center">{promotions[currentPromoIndex].description}</p>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-2 border-b border-border-color">
                    <span className="text-text-secondary">Min Deposit</span>
                    <span className="font-semibold text-accent-color">{promotions[currentPromoIndex].minDeposit}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-8">
                  {promotions[currentPromoIndex].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 transition-transform duration-300 hover:translate-x-1">
                      <FaCheck className="text-success-color" />
                      <span className="text-text-secondary text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-accent-color text-text-quaternary font-semibold px-6 py-3 rounded-xl hover:bg-accent-color/90 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-accent-color/30">
                  Claim Bonus
                </button>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {promotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromoIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPromoIndex 
                      ? 'bg-accent-color scale-125' 
                      : 'bg-border-color hover:bg-accent-color/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20 bg-bg-primary relative">
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-accent-color/5 rounded-full blur-2xl"></div>
        
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-text-primary">
              <span className="text-accent-color bg-gradient-to-r from-accent-color to-primary-blue bg-clip-text text-transparent">Special Offers</span>
            </h2>
            <p className="text-xl text-text-secondary">Discover our latest promotions and trading opportunities</p>
          </div>
          
          <div className="flex flex-wrap gap-8 justify-center">
            {/* Card 1 - Scalper Mode */}
            <div className="bg-gradient-to-br from-card-bg to-card-bg/80 backdrop-blur-sm border border-border-color/50 shadow-2xl rounded-3xl p-6 w-96 h-80 transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl hover:shadow-accent-color/30 group relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-color/20 via-primary-blue/20 to-accent-color/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm rounded-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-color/10 to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-color to-primary-blue bg-clip-text text-transparent mb-2">SCALPER MODE</h2>
                  <h3 className="text-lg font-bold text-text-primary mb-2">FASTEST</h3>
                  <p className="text-text-secondary text-sm">Trade execution • Withdrawal • Deposit</p>
                </div>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-accent-color/20 to-primary-blue/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-accent-color/10 to-primary-blue/10 rounded-full p-4">
                      <FaBolt className="text-4xl text-accent-color animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-extrabold bg-gradient-to-r from-accent-color to-primary-blue bg-clip-text text-transparent mb-2">SCALPER</h3>
                  <p className="text-accent-color/80 font-semibold">Now catch small moves</p>
                </div>
              </div>
            </div>

            {/* Card 2 - Zero Spread */}
            <div className="bg-gradient-to-br from-card-bg to-card-bg/80 backdrop-blur-sm border border-border-color/50 shadow-2xl rounded-3xl p-6 w-96 h-80 text-center transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl hover:shadow-accent-color/30 group relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-color/20 via-primary-blue/20 to-accent-color/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm rounded-3xl"></div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-blue/10 to-transparent rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="mb-4">
                  <h3 className="text-sm uppercase tracking-widest text-text-secondary mb-3 font-semibold">Lowest Spread</h3>
                  <div className="relative">
                    <h2 className="text-5xl font-extrabold bg-gradient-to-r from-accent-color to-primary-blue bg-clip-text text-transparent mb-2">0%</h2>
                    <div className="absolute -inset-4 bg-gradient-to-r from-accent-color/5 to-primary-blue/5 rounded-full blur-xl"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-4">SPREAD</h3>
                </div>
                <div className="bg-gradient-to-r from-accent-color/10 to-primary-blue/10 rounded-xl p-4">
                  <p className="text-text-secondary font-semibold text-lg">XAUUSD • EURUSD • BITCOIN</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Referral */}
            <div className="bg-gradient-to-br from-card-bg to-card-bg/80 backdrop-blur-sm border border-border-color/50 shadow-2xl rounded-3xl p-6 w-96 h-80 transition-all duration-700 hover:-translate-y-3 hover:shadow-2xl hover:shadow-accent-color/30 group relative overflow-visible flex flex-col justify-center">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-color/20 via-primary-blue/20 to-accent-color/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm rounded-3xl"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-color/10 to-transparent rounded-full blur-2xl"></div>
              
              {/* INVITE Badge - positioned like "Most Popular" */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-pulse">
                <span className="bg-gradient-to-r from-accent-color to-primary-blue text-text-quaternary px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  INVITE
                </span>
              </div>
              
              <div className="relative z-10">
                <p className="text-center mb-4 text-text-secondary leading-relaxed">
                  Refer your friend and earn 
                  <span className="text-accent-color font-bold text-lg"> $20 per lot </span> 
                  and <span className="font-bold text-accent-color text-lg">10% bonus</span> of referral deposit
                </p>
                <div className="bg-gradient-to-r from-accent-color/10 to-primary-blue/10 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-accent-color text-center mb-4">SHARE REFERRAL LINK</h3>
                  <ul className="space-y-3 text-text-secondary">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent-color rounded-full"></div>
                      <span>Share your referral link</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent-color rounded-full"></div>
                      <span>Earn 10% referral deposit directly</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent-color rounded-full"></div>
                      <span>Receive $20 per lot as your referral trade</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-20 bg-bg-secondary relative">
        <div className="absolute bottom-10 left-1/4 w-28 h-28 bg-accent-color/5 rounded-full blur-2xl"></div>
        
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-text-primary">
              Live <span className="text-accent-color bg-gradient-to-r from-accent-color to-primary-blue bg-clip-text text-transparent">Market Overview</span>
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-card-bg backdrop-blur-sm border border-border-color p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent-color/10"> 
              <MiniChartUsd />
              </div>
            <div className="bg-card-bg backdrop-blur-sm border border-border-color p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent-color/10">
              <MiniChartGold />
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default HomePage;