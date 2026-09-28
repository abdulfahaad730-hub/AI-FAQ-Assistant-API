import React, { createContext, useContext, useState, useEffect } from 'react';

export type CyberThemeKey = 'aurora' | 'cyberpunk' | 'matrix' | 'solar';

export interface CyberThemeConfig {
  id: CyberThemeKey;
  name: string;
  tagline: string;
  primary: string;      // main neon color (e.g. cyan or emerald)
  secondary: string;    // companion neon color (e.g. mint or magenta)
  tertiary: string;     // accent depth color (e.g. violet or gold)
  glow: string;         // primary box-shadow / drop-shadow rgba
  glowHex: string;
  badgeBg: string;
  badgeBorder: string;
  accentText: string;
}

export const CYBER_THEMES: Record<CyberThemeKey, CyberThemeConfig> = {
  aurora: {
    id: 'aurora',
    name: 'Quantum Aurora',
    tagline: 'Electric Cyan & Aurora Mint & Hyper Violet',
    primary: '#00F2FE',
    secondary: '#00FF9D',
    tertiary: '#8B5CF6',
    glow: 'rgba(0, 242, 254, 0.4)',
    glowHex: '#00F2FE',
    badgeBg: 'rgba(0, 30, 45, 0.8)',
    badgeBorder: 'rgba(0, 242, 254, 0.4)',
    accentText: 'text-[#00F2FE]',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyberpunk',
    tagline: 'Fuchsia Magenta & Electric Violet & Sky Cyan',
    primary: '#FF007A',
    secondary: '#A855F7',
    tertiary: '#00D9FF',
    glow: 'rgba(255, 0, 122, 0.4)',
    glowHex: '#FF007A',
    badgeBg: 'rgba(40, 10, 30, 0.8)',
    badgeBorder: 'rgba(255, 0, 122, 0.4)',
    accentText: 'text-[#FF007A]',
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Terminal',
    tagline: 'Cyber Emerald & Radiant Lime & Electric Teal',
    primary: '#00FF87',
    secondary: '#10E760',
    tertiary: '#00F2FE',
    glow: 'rgba(0, 255, 135, 0.4)',
    glowHex: '#00FF87',
    badgeBg: 'rgba(5, 35, 20, 0.8)',
    badgeBorder: 'rgba(0, 255, 135, 0.4)',
    accentText: 'text-[#00FF87]',
  },
  solar: {
    id: 'solar',
    name: 'Solar Supernova',
    tagline: 'Solar Gold & Plasma Orange & Crimson Rose',
    primary: '#FBBF24',
    secondary: '#F97316',
    tertiary: '#F43F5E',
    glow: 'rgba(251, 191, 36, 0.4)',
    glowHex: '#FBBF24',
    badgeBg: 'rgba(40, 25, 5, 0.8)',
    badgeBorder: 'rgba(251, 191, 36, 0.4)',
    accentText: 'text-[#FBBF24]',
  },
};

interface ThemeContextType {
  themeKey: CyberThemeKey;
  theme: CyberThemeConfig;
  setThemeKey: (key: CyberThemeKey) => void;
  cycleTheme: () => void;
  themesList: CyberThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeKey, setThemeKeyState] = useState<CyberThemeKey>(() => {
    const saved = localStorage.getItem('pcas_cyber_theme') as CyberThemeKey | null;
    return saved && CYBER_THEMES[saved] ? saved : 'aurora';
  });

  const theme = CYBER_THEMES[themeKey];

  useEffect(() => {
    localStorage.setItem('pcas_cyber_theme', themeKey);
    document.documentElement.setAttribute('data-theme', themeKey);

    // Set root CSS variables for dynamic styling
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-tertiary', theme.tertiary);
    root.style.setProperty('--theme-glow', theme.glow);
    root.style.setProperty('--theme-glow-hex', theme.glowHex);
  }, [themeKey, theme]);

  const setThemeKey = (key: CyberThemeKey) => {
    if (CYBER_THEMES[key]) {
      setThemeKeyState(key);
    }
  };

  const cycleTheme = () => {
    const keys: CyberThemeKey[] = ['aurora', 'cyberpunk', 'matrix', 'solar'];
    const currentIndex = keys.indexOf(themeKey);
    const nextIndex = (currentIndex + 1) % keys.length;
    setThemeKey(keys[nextIndex]);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeKey,
        theme,
        setThemeKey,
        cycleTheme,
        themesList: Object.values(CYBER_THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useCyberTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useCyberTheme must be used within a ThemeProvider');
  }
  return ctx;
};
