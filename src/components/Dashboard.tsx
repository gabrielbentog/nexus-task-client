import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { ArrowUpRight, ArrowDownRight, Users, CheckCircle2, Clock, AlertCircle, MessageSquare, Zap, Target, TrendingUp } from 'lucide-react';
import { MOCK_TASKS, MOCK_USERS } from '../mockData';

const data = [
  { name: 'Mon', completed: 4, created: 6 },
  { name: 'Tue', completed: 7, created: 5 },
  { name: 'Wed', completed: 5, created: 8 },
  { name: 'Thu', completed: 10, created: 7 },
  { name: 'Fri', completed: 8, created: 6 },
  { name: 'Sat', completed: 3, created: 2 },
  { name: 'Sun', completed: 2, created: 1 },
];

const stats = [
  { label: 'Total Tasks', value: '42', icon: CheckCircle2, trend: '+12%', trendUp: true, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'In Progress', value: '12', icon: Clock, trend: '+2', trendUp: true, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Team Members', value: '8', icon: Users, trend: '0', trendUp: true, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Overdue', value: '3', icon: AlertCircle, trend: '-1', trendUp: false, color: 'text-rose-600', bg: 'bg-rose-50' },
];

export function Dashboard() {
  const [range, setRange] = useState('7');

  const chartData = useMemo(() => {
    const days = parseInt(range);
    return Array.from({ length: days }).map((_, i) => ({
      name: days <= 7 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7] : `Day ${i + 1}`,
      completed: Math.floor(Math.random() * 10) + 2,
      created: Math.floor(Math.random() * 8) + 3,
    }));
  }, [range]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Good morning, Alex</h2>
          <p className="text-zinc-500 text-sm">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            {MOCK_USERS.slice(0, 4).map(user => (
              <img key={user.id} src={user.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="" />
            ))}
            <div className="w-8 h-8 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-500">+4</div>
          </div>
          <Button variant="outline" size="sm">Share</Button>
          <Button size="sm">Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-2 rounded-xl`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold">Task Velocity</h3>
            <Select
              className="w-40"
              options={[
                { value: '7', label: 'Last 7 days' },
                { value: '30', label: 'Last 30 days' },
                { value: '90', label: 'Last 90 days' },
              ]}
              value={range}
              onChange={(val) => setRange(val)}
            />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94A3B8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94A3B8' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCompleted)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Project Health
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Efficiency</p>
                    <p className="text-[10px] text-zinc-500">Tasks per week</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600">+24%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Velocity</p>
                    <p className="text-[10px] text-zinc-500">Story points</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-indigo-600">8.4</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-100">
              <Button variant="outline" className="w-full text-xs py-2">View Full Audit</Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Recent Activity
            </h3>
            <div className="space-y-6">
              {[
                { user: 'Sarah', action: 'moved', target: 'NEX-42', time: '2m ago' },
                { user: 'John', action: 'commented on', target: 'NEX-15', time: '15m ago' },
                { user: 'Alex', action: 'completed', target: 'NEX-08', time: '1h ago' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <img src={`https://picsum.photos/seed/${activity.user}/32/32`} className="w-8 h-8 rounded-full shrink-0" alt="" />
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-600">
                      <span className="font-bold text-zinc-900">{activity.user}</span> {activity.action} <span className="font-bold text-indigo-600">{activity.target}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
