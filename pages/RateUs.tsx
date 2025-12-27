
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';

const RateUs: React.FC = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`rating_${user.id}`);
      if (saved) {
        setRating(parseInt(saved));
        setSubmitted(true);
      }
    }
  }, [user]);

  const handleSubmit = () => {
    if (!user || rating === 0) return;
    
    // In real app, send to Cloudflare Worker
    localStorage.setItem(`rating_${user.id}`, rating.toString());
    
    // Add to global ratings for admin view
    const allRatings = JSON.parse(localStorage.getItem('oryn_ratings') || '[]');
    allRatings.push({
      userId: user.id,
      username: user.username,
      stars: rating,
      timestamp: Date.now()
    });
    localStorage.setItem('oryn_ratings', JSON.stringify(allRatings));
    
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold font-mono neon-text mb-2 uppercase">RATE THE EXPERIENCE</h1>
      <p className="text-gray-400 mb-12">Your feedback helps us build the ultimate arena for editors.</p>

      <div className="bg-white/5 border border-white/10 p-12 rounded-3xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent"></div>
        
        {submitted ? (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-12 h-12 ${star <= rating ? 'text-[#39FF14]' : 'text-gray-700'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-2xl font-bold font-mono neon-text mb-4 tracking-tighter uppercase italic">“ Thank You For Rating! ”</p>
            <p className="text-gray-500 text-sm">Your feedback has been logged in our system.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`transition-all duration-200 transform hover:scale-125 ${
                    (hover || rating) >= star ? 'text-[#39FF14] drop-shadow-[0_0_10px_#39FF14]' : 'text-gray-700'
                  }`}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            {!user ? (
              <p className="text-red-500 font-bold uppercase text-xs tracking-widest animate-pulse">Login with GitHub to rate</p>
            ) : (
              <button
                disabled={rating === 0}
                onClick={handleSubmit}
                className="w-full py-4 neon-button rounded-xl font-bold font-mono text-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#39FF14] disabled:hover:shadow-none"
              >
                SUBMIT REVIEW
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RateUs;
