'use client';

import { motion } from 'framer-motion';
import { Bell, Search, User } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-zinc-900"
        >
          {title}
        </motion.h1>
        {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="search"
            placeholder="Buscar paciente..."
            className="w-64 pl-10"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-zinc-600" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <div className="flex items-center gap-3 rounded-full bg-zinc-100 px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="hidden text-sm font-medium text-zinc-700 md:block">
            Dr(a). Administrador
          </span>
        </div>
      </div>
    </header>
  );
}