
import React, { useState, useEffect } from 'react';
import { Editor, Rating } from '../types';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editors' | 'users' | 'ratings'>('editors');
  const [editors, setEditors] = useState<Editor[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [newEditor, setNewEditor] = useState({ name: '', thumb: '' });

  useEffect(() => {
    setEditors(JSON.parse(localStorage.getItem('oryn_editors') || '[]'));
    setRatings(JSON.parse(localStorage.getItem('oryn_ratings') || '[]'));
  }, []);

  const addEditor = () => {
    if (!newEditor.name || !newEditor.thumb) return;
    const editor: Editor = {
      id: Date.now().toString(),
      name: newEditor.name,
      videoUrl: '#',
      thumbnailUrl: newEditor.thumb,
      votes: 0
    };
    const updated = [...editors, editor];
    setEditors(updated);
    localStorage.setItem('oryn_editors', JSON.stringify(updated));
    setNewEditor({ name: '', thumb: '' });
  };

  const removeEditor = (id: string) => {
    const updated = editors.filter(e => e.id !== id);
    setEditors(updated);
    localStorage.setItem('oryn_editors', JSON.stringify(updated));
  };

  const updateVotes = (id: string, delta: number) => {
    const updated = editors.map(e => e.id === id ? { ...e, votes: Math.max(0, e.votes + delta) } : e);
    setEditors(updated);
    localStorage.setItem('oryn_editors', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold font-mono neon-text uppercase tracking-tighter">ADMIN_DASHBOARD</h1>
        <div className="flex space-x-4 mt-4 md:mt-0 bg-white/5 p-1 rounded-lg">
          {(['editors', 'users', 'ratings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded font-mono text-sm uppercase transition-all ${
                activeTab === tab ? 'bg-[#39FF14] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        {activeTab === 'editors' && (
          <div className="p-6">
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-lg border border-white/5">
              <input 
                placeholder="Editor Name" 
                value={newEditor.name}
                onChange={e => setNewEditor({...newEditor, name: e.target.value})}
                className="bg-black border border-white/10 p-2 rounded text-white font-mono focus:border-[#39FF14] outline-none"
              />
              <input 
                placeholder="Thumbnail URL" 
                value={newEditor.thumb}
                onChange={e => setNewEditor({...newEditor, thumb: e.target.value})}
                className="bg-black border border-white/10 p-2 rounded text-white font-mono focus:border-[#39FF14] outline-none"
              />
              <button 
                onClick={addEditor}
                className="bg-[#39FF14] text-black font-bold uppercase font-mono rounded hover:bg-[#32e012]"
              >
                ADD EDITOR
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 text-xs">
                    <th className="py-4 px-2 uppercase">Editor</th>
                    <th className="py-4 px-2 uppercase">Votes</th>
                    <th className="py-4 px-2 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {editors.map(editor => (
                    <tr key={editor.id} className="border-b border-white/5 group hover:bg-white/5">
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-3">
                          <img src={editor.thumbnailUrl} className="w-10 h-10 rounded object-cover" />
                          <span className="font-bold">{editor.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-2">
                          <span className="neon-text font-bold text-lg">{editor.votes}</span>
                          <div className="flex flex-col text-[10px]">
                            <button onClick={() => updateVotes(editor.id, 1)} className="hover:text-[#39FF14]">▲</button>
                            <button onClick={() => updateVotes(editor.id, -1)} className="hover:text-red-500">▼</button>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <button 
                          onClick={() => removeEditor(editor.id)}
                          className="text-red-500 hover:underline text-xs"
                        >
                          REMOVE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-12 text-center">
            <div className="text-gray-500 mb-4">User management module is processing audit logs...</div>
            <div className="flex justify-center space-x-4">
               <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                 <div className="w-1/2 h-full bg-[#39FF14] animate-pulse"></div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'ratings' && (
          <div className="p-6">
            <div className="space-y-4">
              {ratings.length === 0 ? (
                <div className="text-gray-500 text-center py-20">No ratings recorded yet.</div>
              ) : (
                ratings.map((r, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded border border-white/5">
                    <div>
                      <div className="font-bold font-mono">@{r.username}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{new Date(r.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="flex text-[#39FF14]">
                      {Array.from({length: r.stars}).map((_, i) => <span key={i}>★</span>)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
