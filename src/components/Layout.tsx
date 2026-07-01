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
    <div className="min-h-full flex flex-col bg-slate-50 text-slate-900">
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="mx-auto w-full max-w-md px-4 pt-6">
          <Outlet />
        </div>
      </main>
      <nav className="fixed bottom-0 inset-x-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-md flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
                  isActive ? 'text-sky-600' : 'text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none transition-colors ${
                      isActive ? 'bg-sky-100' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
