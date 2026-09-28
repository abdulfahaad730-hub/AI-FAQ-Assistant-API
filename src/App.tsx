import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HackathonProvider } from './context/HackathonContext';
import { ThemeProvider } from './context/ThemeContext';
import { CyberBackground } from './components/common/CyberBackground';
import { CursorGlow } from './components/common/CursorGlow';
import { CyberThemeHUD } from './components/common/CyberThemeHUD';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AIChatbot } from './components/chat/AIChatbot';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Problems } from './pages/Problems';
import { Admin } from './pages/Admin';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Dynamic Animated Glowing Curves & Particles Canvas Background */}
      <CyberBackground />

      {/* Interactive GPU Cursor Spotlight */}
      <CursorGlow />

      {/* Floating Cyber Theme Matrix Switcher */}
      <CyberThemeHUD />

      {/* Floating AI FAQ Assistant Chatbot */}
      <AIChatbot />

      {/* Main Navbar (hidden on /register since Register has dedicated navbar matching reference) */}
      {!isRegisterPage && <Navbar />}

      {/* App Routes */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      {/* Footer (shown on all pages except register) */}
      {!isRegisterPage && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HackathonProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ThemeProvider>
    </HackathonProvider>
  );
};

export default App;
