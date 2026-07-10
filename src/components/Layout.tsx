import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  RiHomeLine,
  RiHomeFill,
  RiBarChartLine,
  RiBarChartFill,
  RiTrophyLine,
  RiTrophyFill,
  RiSettings3Line,
  RiSettings3Fill,
} from '@remixicon/react';
import { useReminderSettings } from '../hooks/useReminderSettings';
import { useReminderScheduler } from '../hooks/useReminderScheduler';

const navItems = [
  { to: '/', label: 'Routines', Icon: RiHomeLine, IconActive: RiHomeFill },
  { to: '/progress', label: 'Progress', Icon: RiBarChartLine, IconActive: RiBarChartFill },
  { to: '/awards', label: 'Awards', Icon: RiTrophyLine, IconActive: RiTrophyFill },
  { to: '/settings', label: 'Settings', Icon: RiSettings3Line, IconActive: RiSettings3Fill },
];

export function Layout() {
  const { settings } = useReminderSettings();
  useReminderScheduler(settings);
  const location = useLocation();

  return (
    <div
      className="min-h-full flex flex-col text-slate-900 transition-colors dark:text-slate-100"
      style={{ background: 'var(--app-bg)' }}
    >
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="mx-auto w-full max-w-md px-4 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <nav
        className="fixed inset-x-0 bottom-0 border-t bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:bg-black/85"
        style={{ borderColor: 'var(--surface-border)' }}
      >
        <div className="mx-auto flex max-w-md px-1">
          {navItems.map(({ to, label, Icon, IconActive }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium text-slate-400"
              style={({ isActive }) => (isActive ? { color: 'var(--accent)' } : undefined)}
            >
              {({ isActive }) => (
                <motion.span whileTap={{ scale: 0.85 }} className="flex flex-col items-center gap-0.5">
                  <motion.span
                    key={isActive ? 'active' : 'inactive'}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, duration: 0.4 }}
                    className="text-xl leading-none"
                  >
                    {isActive ? <IconActive size="1.2em" /> : <Icon size="1.2em" />}
                  </motion.span>
                  <span>{label}</span>
                </motion.span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
