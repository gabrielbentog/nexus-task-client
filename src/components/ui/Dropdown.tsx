import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, children, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className || ''}`} ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer w-full">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "absolute z-50 mt-2 w-full rounded-xl bg-white shadow-xl border border-zinc-200 py-1 focus:outline-none",
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
          >
            <div onClick={() => setIsOpen(false)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DropdownItemProps<T extends React.ElementType = 'button'> {
  as?: T;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'danger';
}

export function DropdownItem<T extends React.ElementType = 'button'>({
  as,
  onClick,
  children,
  className,
  variant = 'default',
  ...props
}: DropdownItemProps<T> & React.ComponentPropsWithoutRef<T>) {
  const Component = as || 'button';

  return (
    <Component
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2",
        variant === 'danger'
          ? "text-red-600 hover:bg-red-50"
          : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
