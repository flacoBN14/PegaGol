import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';

import Splash from './pages/Splash';
import Register from './pages/Register';
import Album from './pages/Album';
import Search from './pages/Search';
import Trades from './pages/Trades';
import Chat from './pages/Chat';
import Mundial from './pages/Mundial';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/registro" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/album" element={<Album />} />
            <Route path="/buscar" element={<Search />} />
            <Route path="/mundial" element={<Mundial />} />
            <Route path="/cambios" element={<Trades />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
