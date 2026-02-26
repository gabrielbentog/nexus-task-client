import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Cookies from 'js-cookie';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            user: {
              name,
              email,
              password,
              password_confirmation: password,
            },
          }),
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        // Pega o token do header Authorization (ou access-token, client, uid, etc)
        const authToken = response.headers.get('Authorization') || response.headers.get('authorization') || response.headers.get('access-token');
        if (authToken) {
          Cookies.set('Authorization', authToken, { path: '/' });
        } else {
          // Para Devise Token Auth, pode ser múltiplos headers
          const accessToken = response.headers.get('access-token');
          const client = response.headers.get('client');
          const uid = response.headers.get('uid');
          if (accessToken && client && uid) {
            Cookies.set('access-token', accessToken, { path: '/' });
            Cookies.set('client', client, { path: '/' });
            Cookies.set('uid', uid, { path: '/' });
          }
        }
        // Salva user no sessionStorage
        if (data && (data.user || data.id)) {
          sessionStorage.setItem('user', JSON.stringify(data.user || data));
        }
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
        window.location.reload();
      } else {
        alert((data && (data.errors?.join(', ') || data.error)) || 'Erro ao criar conta');
      }
    } catch (err) {
      setIsLoading(false);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900">Create account</h1>
          <p className="text-zinc-500 mt-2">Join Nexus and start managing your projects</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-3" isLoading={isLoading}>
              Create Account
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
