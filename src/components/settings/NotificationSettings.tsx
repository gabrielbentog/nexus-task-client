import React, { useState } from 'react';
import { Button } from '../ui/Button';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email_tasks: true,
    email_mentions: true,
    email_updates: false,
    push_tasks: true,
    push_mentions: true,
    push_updates: true,
  });

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-zinc-900">Notifications</h3>
        <p className="text-sm text-zinc-500">Configure how and when you want to be notified.</p>
      </div>

      <div className="space-y-8">
        <section>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 ml-1">Email Notifications</h4>
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-zinc-100">
            {[
              { id: 'email_tasks', label: 'Task Assignments', desc: 'When someone assigns a task to you' },
              { id: 'email_mentions', label: 'Mentions', desc: 'When someone mentions you in a comment' },
              { id: 'email_updates', label: 'Project Updates', desc: 'Weekly summary of project progress' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
                <button 
                  onClick={() => toggle(item.id as keyof typeof notifications)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${notifications[item.id as keyof typeof notifications] ? 'bg-indigo-600' : 'bg-zinc-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.id as keyof typeof notifications] ? 'left-5' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 ml-1">Push Notifications</h4>
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-zinc-100">
            {[
              { id: 'push_tasks', label: 'Task Assignments', desc: 'Real-time alerts for new tasks' },
              { id: 'push_mentions', label: 'Mentions', desc: 'Instant notification for mentions' },
              { id: 'push_updates', label: 'Activity', desc: 'Alerts for any activity in your projects' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
                <button 
                  onClick={() => toggle(item.id as keyof typeof notifications)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${notifications[item.id as keyof typeof notifications] ? 'bg-indigo-600' : 'bg-zinc-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.id as keyof typeof notifications] ? 'left-5' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
        <Button variant="outline">Reset to Default</Button>
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}
