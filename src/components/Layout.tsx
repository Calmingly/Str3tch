import { NavLink, Outlet } from 'react-router-dom';
import { useReminderSettings } from '../hooks/useReminderSettings';
import { useReminderScheduler } from '../hooks/useReminderScheduler';

const navItems = [
  { to: '/', label: 'Routines', icon: '🧘' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Layout() {
  const { settings } = useReminderSettings();
  useReminderScheduler(settings);

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100">
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="mx-auto w-full max-w-md px-4 pt-6">
          <Outlet />
        </div>
      </main>
      <nav className="fixed bottom-0 inset-x-0 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-md flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                  isActive ? 'text-sky-400' : 'text-slate-500'
                }`
              }
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
