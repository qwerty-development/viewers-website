"use client";

import { useState, useEffect } from 'react';

export default function BitcoinPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        setLoading(true);
        
        // Fetch from CoinGecko API
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch Bitcoin data');
        }
        
        const data = await response.json();
        
        // Update state with fetched data
        setPrice(data.market_data.current_price.usd);
        setChange24h(data.market_data.price_change_percentage_24h);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } catch (err) {
        console.error('Error fetching Bitcoin price:', err);
        setError('Failed to load Bitcoin price. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch data immediately
    fetchBitcoinPrice();
    
    // Set up interval to refresh data every 60 seconds
    const intervalId = setInterval(fetchBitcoinPrice, 60000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-6 border-2 border-qwerty-dark-blue rounded-lg bg-qwerty-white shadow-lg">
      <h3 className="text-lg font-telegraph-bold text-qwerty-dark-blue mb-3 flex items-center">
        <svg className="w-6 h-6 text-yellow-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.52 2.75 2.084v.006z" />
        </svg>
        Live Bitcoin Price
      </h3>
      
      <div className="my-4 text-center">
        {loading ? (
          <div className="animate-pulse flex flex-col items-center justify-center py-4">
            <div className="h-8 w-32 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-3xl font-telegraph-bold text-qwerty-dark-blue">
              ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            
            <div className={`mt-2 px-3 py-1 rounded-full text-white text-sm font-telegraph-medium
              ${change24h && change24h >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
              {change24h ? (change24h >= 0 ? '↑' : '↓') : ''} 
              {change24h?.toFixed(2)}% (24h)
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center mt-4 text-qwerty-gray text-xs">
        <p>Data from CoinGecko API</p>
        <p className="mt-1">Last updated: {lastUpdated || 'Loading...'}</p>
      </div>
      
      <div className="text-center mt-4 border-t border-gray-200 pt-3">
        <p className="text-qwerty-gray text-sm italic">
          Added from CryptoFan&apos;s comment - April 29, 2025
        </p>
      </div>
    </div>
  );
}