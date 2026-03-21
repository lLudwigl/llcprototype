// Root component — sets up routing and wraps all pages in the persistent Layout.
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import LinePage from './pages/LinePage';
import ReportPage from './pages/ReportPage';

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="linie/:lineId" element={<LinePage />} />
          <Route path="melden" element={<ReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
