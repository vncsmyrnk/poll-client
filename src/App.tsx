import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { PollDetail } from './pages/PollDetail';
import { Login } from './pages/Login';
import { AppBar } from './components/AppBar';

const Layout = () => {
  const location = useLocation();
  const hideAppBar = location.pathname === '/login';

  return (
    <>
      {!hideAppBar && <AppBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/polls/:id" element={<PollDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
