import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Globe, Trash2 } from 'lucide-react';

export function GeneralSettings() {
  const [workspaceName, setWorkspaceName] = useState('Nexus Workspace');
  const [url, setUrl] = useState('nexus-workspace.app.nexus.com');

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-zinc-900">General Workspace Settings</h3>
        <p className="text-sm text-zinc-500">Manage your workspace identity and basic configuration.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Workspace Name</label>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Workspace URL</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-zinc-100">
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
          <h4 className="text-rose-900 font-bold mb-1">Danger Zone</h4>
          <p className="text-rose-700 text-sm mb-4">Once you delete a workspace, there is no going back. Please be certain.</p>
          <Button variant="danger" size="sm">
            <Trash2 className="w-4 h-4" />
            Delete Workspace
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
