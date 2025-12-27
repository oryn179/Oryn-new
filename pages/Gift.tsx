
import React, { useState } from 'react';
import { TELEGRAM_USERNAME } from '../constants';

const Gift: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const packages = [
    { stars: 1, votes: 2, price: 'Small Boost' },
    { stars: 15, votes: 35, price: 'Elite Package', popular: true },
    { stars: 50, votes: 120, price: 'Champion Stack' },
  ];

  if (showConfirmation) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-[#39FF14] rounded-full flex items-center justify-center shadow-[0_0_30px_#39FF14]">
            <svg className="w-12 h-12 text-[#050505]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold font-mono mb-4 neon-text tracking-tighter uppercase">DONE</h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          If your transaction is not applied within 24 hours, please DM us directly on Telegram.
        </p>
        <div className="flex flex-col gap-4">
          <a 
            href={`https://t.me/${TELEGRAM_USERNAME.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#39FF14] text-[#050505] font-bold font-mono rounded text-lg hover:shadow-[0_0_20px_#39FF14] transition-shadow"
          >
            INBOX ADMIN
          </a>
          <button 
            onClick={() => setShowConfirmation(false)}
            className="text-gray-500 hover:text-white transition-colors uppercase font-mono text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-mono neon-text mb-4">GIFT VOTES</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Support your favorite editors with extra vote packages. 
          Boost their rankings and help them reach the finals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {packages.map((pkg) => (
          <div key={pkg.stars} className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
            pkg.popular ? 'border-[#39FF14] bg-[#39FF14]/5 scale-105 shadow-2xl' : 'border-white/10 bg-white/5 hover:border-[#39FF14]/50'
          }`}>
            {pkg.popular && (
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#39FF14] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                Most Popular
              </div>
            )}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold font-mono text-white mb-2">{pkg.votes}</div>
              <div className="text-[#39FF14] uppercase text-sm font-mono tracking-widest">Extra Votes</div>
            </div>
            <div className="mt-auto space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-gray-500">Requirements:</span>
                <span className="text-white font-mono">{pkg.stars} Stars</span>
              </div>
              <p className="text-xs text-center text-gray-500 italic">"Send the number of stars you want via Telegram"</p>
              <button 
                onClick={() => {
                  window.open(`https://t.me/${TELEGRAM_USERNAME.replace('@', '')}`, '_blank');
                  setShowConfirmation(true);
                }}
                className={`w-full py-4 rounded font-mono font-bold uppercase transition-all ${
                  pkg.popular ? 'bg-[#39FF14] text-black shadow-[0_0_15px_#39FF14]' : 'border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10'
                }`}
              >
                PAY HERE
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#39FF14]/5 border-l-4 border-[#39FF14] p-6 rounded-r-lg max-w-2xl mx-auto">
        <h4 className="font-bold font-mono neon-text mb-2 uppercase">Payment Instructions</h4>
        <ol className="list-decimal list-inside text-gray-400 text-sm space-y-2">
          <li>Choose your desired vote package from above.</li>
          <li>Click 'PAY HERE' to open a chat with @Oryn179 on Telegram.</li>
          <li>Send the required number of Telegram Stars to the admin.</li>
          <li>Votes will be added to your account/chosen editor within 24 hours.</li>
        </ol>
      </div>
    </div>
  );
};

export default Gift;
