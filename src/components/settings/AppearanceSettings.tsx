import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Moon, Sun, Monitor, Check } from 'lucide-react';

export function AppearanceSettings() {
  const [theme, setTheme] = useState('light');
  const [accent, setAccent] = useState('indigo');

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  const accents = [
    { id: 'indigo', color: 'bg-indigo-600' },
    { id: 'blue', color: 'bg-blue-600' },
    { id: 'emerald', color: 'bg-emerald-600' },
    { id: 'rose', color: 'bg-rose-600' },
    { id: 'amber', color: 'bg-amber-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-zinc-900">Appearance</h3>
        <p className="text-sm text-zinc-500">Customize how Nexus looks on your screen.</p>
      </div>

      <section className="space-y-4">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Interface Theme</h4>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                theme === t.id 
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600' 
                  : 'border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200'
              }`}
            >
              <t.icon className="w-6 h-6" />
              <span className="text-sm font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Accent Color</h4>
        <div className="flex gap-4">
          {accents.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              className={`w-10 h-10 rounded-full ${a.color} flex items-center justify-center transition-transform hover:scale-110 active:scale-95`}
            >
              {accent === a.id && <Check className="w-5 h-5 text-white" />}
            </button>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
        <Button variant="outline">Reset</Button>
        <Button>Apply Changes</Button>
      </div>
    </div>
  );
}
