import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { DashboardSkeleton } from './ui/Skeleton';
import { ArrowUpRight, ArrowDownRight, Users, CheckCircle2, Clock, AlertCircle, MessageSquare, Zap, Target, TrendingUp, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService, DashboardStats, VelocityData, HealthData, ActivityItem } from '../services/dashboardService';

export function Dashboard() {
  const { user } = useAuth();
  const [range, setRange] = useState('7');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [velocityData, setVelocityData] = useState<VelocityData[]>([]);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsData, velocityResponse, healthResponse, activityResponse] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getVelocity(parseInt(range)),
        dashboardService.getHealth(),
        dashboardService.getActivity(),
      ]);

      setStats(statsData);
      setVelocityData(velocityResponse);
      setHealthData(healthResponse);
      setActivityData(activityResponse);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [range]);

  const firstName = user?.name?.split(' ')[0] || 'User';

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-600 mb-2">Failed to load dashboard</p>
          <p className="text-xs text-zinc-500 mb-4">{error}</p>
          <Button onClick={loadDashboardData} size="sm">Try Again</Button>
        </div>
      </div>
    );
  }

  const statsCards = stats ? [
    { label: 'Total Tasks', value: stats.totalTasks.value.toString(), icon: CheckCircle2, trend: stats.totalTasks.trend, trendUp: stats.totalTasks.trendUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'In Progress', value: stats.inProgress.value.toString(), icon: Clock, trend: stats.inProgress.trend, trendUp: stats.inProgress.trendUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Team Members', value: stats.teamMembers.value.toString(), icon: Users, trend: stats.teamMembers.trend, trendUp: stats.teamMembers.trendUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Overdue', value: stats.overdue.value.toString(), icon: AlertCircle, trend: stats.overdue.trend, trendUp: stats.overdue.trendUp, color: 'text-rose-600', bg: 'bg-rose-50' },
  ] : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Good morning, {firstName}</h2>
          <p className="text-zinc-500 text-sm">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">Share</Button>
          <Button size="sm">Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
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
            {velocityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
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
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                No velocity data available
              </div>
            )}
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
                <span className="text-sm font-bold text-emerald-600">
                  {healthData?.efficiency?.value != null ? `${Number(healthData.efficiency.value) > 0 ? '+' : ''}${Number(healthData.efficiency.value).toFixed(1)}%` : 'N/A'}
                </span>
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
                <span className="text-sm font-bold text-indigo-600">
                  {healthData?.velocity?.value != null ? Number(healthData.velocity.value).toFixed(1) : 'N/A'}
                </span>
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
              {activityData.length > 0 ? (
                activityData.slice(0, 3).map((activity) => {
                  const userName = activity.user?.name || 'Unknown User';
                  const avatarUrl = activity.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4F46E5&color=fff`;
                  return (
                    <div key={activity.id} className="flex gap-3">
                      <img src={avatarUrl} className="w-8 h-8 rounded-full shrink-0" alt="" />
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-600">
                          <span className="font-bold text-zinc-900">{userName}</span> {activity.action} <span className="font-bold text-indigo-600">{activity.target}</span>
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-zinc-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
