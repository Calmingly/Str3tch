import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { RoutineDetail } from './pages/RoutineDetail';
import { Player } from './pages/Player';
import { Progress } from './pages/Progress';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/routine/:routineId" element={<RoutineDetail />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/session/:routineId" element={<Player />} />
      </Routes>
    </HashRouter>
  );
}
