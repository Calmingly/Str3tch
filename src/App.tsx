import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ThemeSettingsContext, useThemeSettingsState } from './hooks/useThemeSettings';

const RoutineDetail = lazy(() =>
  import('./pages/RoutineDetail').then((m) => ({ default: m.RoutineDetail })),
);
const Player = lazy(() => import('./pages/Player').then((m) => ({ default: m.Player })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
        style={{ borderTopColor: 'var(--accent)', borderRightColor: 'var(--accent)' }}
      />
    </div>
  );
}

export default function App() {
  const themeSettings = useThemeSettingsState();

  return (
    <ThemeSettingsContext.Provider value={themeSettings}>
      <MotionConfig reducedMotion="user">
        <HashRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/routine/:routineId" element={<RoutineDetail />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="/session/:routineId" element={<Player />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </MotionConfig>
    </ThemeSettingsContext.Provider>
  );
}
