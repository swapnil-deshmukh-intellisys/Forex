import React, { useEffect, useRef } from "react";

const TickerTape = () => {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup first to avoid multiple widgets
    containerRef.current.innerHTML = "";

    // Create container for the widget
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";

    // Create script element
    const script = document.createElement("script");
    scriptRef.current = script;
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

    // Set script content
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
        { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "in",
    });

    // Append elements
    try {
      containerRef.current.appendChild(widgetContainer);
      containerRef.current.appendChild(script);
    } catch (error) {
      console.warn('Failed to append TradingView widget:', error);
    }

    // Add error handling for script loading
    script.onerror = () => {
      console.warn('TradingView TickerTape widget failed to load');
    };

    return () => {
      // Enhanced cleanup on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      scriptRef.current = null;
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-copyright">
        <a
          href="https://in.tradingview.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default TickerTape;