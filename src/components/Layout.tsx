import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MdSelfImprovement, MdShowChart, MdEmojiEvents, MdSettings } from 'react-icons/md';
import { useReminderSettings } from '../hooks/useReminderSettings';
import { useReminderScheduler } from '../hooks/useReminderScheduler';

const navItems = [
  { to: '/', label: 'Routines', Icon: MdSelfImprovement },
  { to: '/progress', label: 'Progress', Icon: MdShowChart },
  { to: '/awards', label: 'Awards', Icon: MdEmojiEvents },
  { to: '/settings', label: 'Settings', Icon: MdSettings },
];

export function Layout() {
  const { settings } = useReminderSettings();
  useReminderScheduler(settings);
  const location = useLocation();

  return (
    <div className="min-h-full flex flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
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
      <nav className="fixed bottom-0 inset-x-0 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto max-w-md flex">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold text-slate-400 transition-colors"
              style={({ isActive }) => (isActive ? { color: 'var(--accent)' } : undefined)}
            >
              {({ isActive }) => (
                <>
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none transition-colors"
                    style={isActive ? { backgroundColor: 'var(--accent-soft)' } : undefined}
                  >
                    <Icon />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
