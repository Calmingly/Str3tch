import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ThemeContext, useThemeModeState } from './hooks/useThemeMode';
import { AccentContext, useAccentThemeState } from './hooks/useAccentTheme';
import { TextSizeContext, useTextSizeState } from './hooks/useTextSize';
import { CompactModeContext, useCompactModeState } from './hooks/useCompactMode';

const RoutineDetail = lazy(() =>
  import('./pages/RoutineDetail').then((m) => ({ default: m.RoutineDetail })),
);
const Player = lazy(() => import('./pages/Player').then((m) => ({ default: m.Player })));
const Progress = lazy(() => import('./pages/Progress').then((m) => ({ default: m.Progress })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const Awards = lazy(() => import('./pages/Awards').then((m) => ({ default: m.Awards })));
const BodyMap = lazy(() => import('./pages/BodyMap').then((m) => ({ default: m.BodyMap })));
const RoutineBuilder = lazy(() =>
  import('./pages/RoutineBuilder').then((m) => ({ default: m.RoutineBuilder })),
);

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
  const theme = useThemeModeState();
  const accent = useAccentThemeState();
  const textSize = useTextSizeState();
  const compactMode = useCompactModeState();

  return (
    <MotionConfig reducedMotion="user">
      <ThemeContext.Provider value={theme}>
        <AccentContext.Provider value={accent}>
          <TextSizeContext.Provider value={textSize}>
            <CompactModeContext.Provider value={compactMode}>
              <HashRouter>
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route element={<Layout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/routine/:routineId" element={<RoutineDetail />} />
                      <Route path="/progress" element={<Progress />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/awards" element={<Awards />} />
                      <Route path="/body-map" element={<BodyMap />} />
                      <Route path="/build" element={<RoutineBuilder />} />
                      <Route path="/build/:customRoutineId" element={<RoutineBuilder />} />
                    </Route>
                    <Route path="/session/:routineId" element={<Player />} />
                  </Routes>
                </Suspense>
              </HashRouter>
            </CompactModeContext.Provider>
          </TextSizeContext.Provider>
        </AccentContext.Provider>
      </ThemeContext.Provider>
    </MotionConfig>
  );
}
