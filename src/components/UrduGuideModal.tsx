import React from 'react';
import { X, HelpCircle, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';

interface UrduGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UrduGuideModal: React.FC<UrduGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Wingo AI Period Matching & Urdu Guide</h2>
            <p className="text-xs text-slate-400">92PKR, 92Jeeto, 92R aur Daman/BJ Game se period kaise milaayein</p>
          </div>
        </div>

        {/* Content in Roman Urdu */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-emerald-400 text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> 1. Period Number Matching (Period Kaise Match Karein)
            </h3>
            <p>
              App mein top par har platform (92PKR, 92Jeeto, 92R etc.) ki realtime clock chal rahi hoti hai. Period Number match karne ke do tareeqay hain:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li><strong>Automatic Mode:</strong> Jab aap platform select karte hain, app automatically PST (Pakistan Standard Time) ke hisaab se live period Calculate karti hai.</li>
              <li><strong>Custom Mode:</strong> Agar aapki game app par period ID different dikh rahi ho, toh aap input box mein game app se Period ID copy karke yahan paste ya write kar sakte hain.</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-cyan-400 text-sm mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> 2. Independent Size & Color Logic
            </h3>
            <p>
              Is Version 9.8 mein Size (BIG / SMALL) aur Color (GREEN / RED / VIOLET) dono alag-alag server seed algorithms se calculate hote hain. Tabhi prediction mein BIG ke saath GREEN ya RED koi bhi independent result ho sakta hai.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-amber-400 text-sm mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> 3. Money Management Strategy (Sarmaya Kari Rule)
            </h3>
            <p>
              Game kheltay waqt hamesha **3-Level Money Management Plan** follow karein:
            </p>
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-500">Level 1</span>
                <span className="font-bold text-emerald-400">1x Bet</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-500">Level 2</span>
                <span className="font-bold text-amber-400">3x Bet</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <span className="block text-[10px] text-slate-500">Level 3</span>
                <span className="font-bold text-rose-400">8x Bet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
          >
            Samajh Aa Gaya (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
