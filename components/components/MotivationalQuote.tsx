
import React, { useState, useEffect } from 'react';
import { fetchMotivationalQuote } from '../services/geminiService';
import QuoteIcon from './icons/QuoteIcon';

const MotivationalQuote = () => {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getQuote = async () => {
      setLoading(true);
      const fetchedQuote = await fetchMotivationalQuote();
      setQuote(fetchedQuote);
      setLoading(false);
    };
    getQuote();
  }, []);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl mx-4 shadow-lg border border-gray-700">
      <div className="flex items-start space-x-3">
        <QuoteIcon className="h-5 w-5 text-indigo-400 mt-1 flex-shrink-0" />
        {loading ? (
          <div className="animate-pulse flex-1">
             <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
             <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          </div>
        ) : (
          <p className="text-gray-300 italic text-sm md:text-base">
            {quote}
          </p>
        )}
      </div>
    </div>
  );
};

export default MotivationalQuote;
