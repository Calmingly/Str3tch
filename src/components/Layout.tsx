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
      <main className="flex-1 overflow-y-auto pb-28">
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
      <nav className="fixed inset-x-4 bottom-4 mx-auto max-w-md rounded-full bg-white/90 shadow-lg shadow-black/5 ring-1 ring-slate-900/5 backdrop-blur-lg dark:bg-white/[0.06] dark:ring-white/10">
        <div className="flex px-1.5 py-1.5">
          {navItems.map(({ to, label, Icon, IconActive }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="relative flex-1 flex flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-semibold text-slate-400 transition-colors"
              style={({ isActive }) => (isActive ? { color: 'var(--accent)' } : undefined)}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: 'var(--accent-soft)' }}
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <motion.span
                    whileTap={{ scale: 0.85 }}
                    className="relative z-10 flex flex-col items-center gap-0.5"
                  >
                    <motion.span
                      key={isActive ? 'active' : 'inactive'}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', bounce: 0.5, duration: 0.4 }}
                      className="text-lg leading-none"
                    >
                      {isActive ? <IconActive size="1.2em" /> : <Icon size="1.2em" />}
                    </motion.span>
                    <span>{label}</span>
                  </motion.span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
