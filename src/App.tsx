import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { RoutineDetail } from './pages/RoutineDetail';
import { Player } from './pages/Player';
import { Progress } from './pages/Progress';
import { Settings } from './pages/Settings';
import { Awards } from './pages/Awards';
import { BodyMap } from './pages/BodyMap';
import { RoutineBuilder } from './pages/RoutineBuilder';
import { ThemeContext, useThemeModeState } from './hooks/useThemeMode';
import { AccentContext, useAccentThemeState } from './hooks/useAccentTheme';

export default function App() {
  const theme = useThemeModeState();
  const accent = useAccentThemeState();

  return (
    <ThemeContext.Provider value={theme}>
      <AccentContext.Provider value={accent}>
        <HashRouter>
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
        </HashRouter>
      </AccentContext.Provider>
    </ThemeContext.Provider>
  );
}
