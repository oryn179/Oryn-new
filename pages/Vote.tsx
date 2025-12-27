
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Editor } from '../types';

const Vote: React.FC = () => {
  const { user } = useAuth();
  const [editors, setEditors] = useState<Editor[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedId, setVotedId] = useState<string | null>(null);

  useEffect(() => {
    // Load state from localStorage for demo
    const savedEditors = localStorage.getItem('oryn_editors');
    if (savedEditors) {
      setEditors(JSON.parse(savedEditors));
    } else {
      const initialEditors: Editor[] = [
        { id: '1', name: 'Zade Edits', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/1/400/225', votes: 142 },
        { id: '2', name: 'Nexus VFX', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/2/400/225', votes: 98 },
        { id: '3', name: 'Kyro AfterEffects', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/3/400/225', votes: 215 },
        { id: '4', name: 'Solar Motion', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/4/400/225', votes: 67 },
      ];
      setEditors(initialEditors);
      localStorage.setItem('oryn_editors', JSON.stringify(initialEditors));
    }

    const savedVotes = localStorage.getItem(`voted_${user?.id}`);
    if (savedVotes) {
      setHasVoted(true);
      setVotedId(savedVotes);
    }
  }, [user]);

  const handleVote = (id: string) => {
    if (!user) return;
    if (hasVoted) return;

    const updatedEditors = editors.map(e => 
      e.id === id ? { ...e, votes: e.votes + 1 } : e
    );
    setEditors(updatedEditors);
    setHasVoted(true);
    setVotedId(id);
    localStorage.setItem('oryn_editors', JSON.stringify(updatedEditors));
    localStorage.setItem(`voted_${user.id}`, id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono neon-text mb-4">EDITOR VOTING</h1>
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-gray-400 text-sm">
            <p className="font-bold text-[#39FF14] mb-1 uppercase tracking-widest">Rules:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Must be logged in via GitHub</li>
              <li>One vote per user only</li>
              <li>Cannot change vote once submitted</li>
            </ul>
          </div>
          {!user && (
            <div className="p-3 border border-red-500/50 bg-red-500/10 rounded text-red-500 text-sm font-bold animate-pulse">
              LOGIN REQUIRED TO VOTE
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {editors.map((editor) => (
          <div key={editor.id} className={`group bg-white/5 border transition-all duration-300 rounded-xl overflow-hidden ${
            votedId === editor.id ? 'border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.2)]' : 'border-white/10 hover:border-[#39FF14]/50'
          }`}>
            <div className="relative aspect-video bg-black">
              <img src={editor.thumbnailUrl} alt={editor.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-16 h-16 bg-[#39FF14] rounded-full flex items-center justify-center text-black transform scale-90 group-hover:scale-100 transition-transform shadow-lg">
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold font-mono text-white truncate mr-2">{editor.name}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold neon-text">{editor.votes}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-tighter">VOTES</div>
                </div>
              </div>

              <button
                disabled={!user || hasVoted}
                onClick={() => handleVote(editor.id)}
                className={`w-full py-3 rounded font-mono font-bold transition-all ${
                  votedId === editor.id 
                    ? 'bg-[#39FF14] text-black shadow-[0_0_15px_#39FF14]' 
                    : hasVoted || !user
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                      : 'border-2 border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black'
                }`}
              >
                {votedId === editor.id ? 'VOTED ✓' : hasVoted ? 'DISABLED' : 'CAST VOTE'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vote;
