/**
 * NetVision Hyper-Theme & HUD Shader Engine (Version 4.3)
 * Dynamic theme manager with real-time CSS variable injection,
 * HUD CRT scanlines, glassmorphic refraction, and WCAG AAA accessibility.
 */

export interface ThemePreset {
  id: string;
  name: string;
  category: 'CYBER' | 'DARK' | 'LIGHT' | 'MINIMAL';
  description: string;
  colors: {
    accent: string;
    accentHover: string;
    surface0: string;
    surface1: string;
    surface2: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    glow: string;
  };
}

export interface HudShaderSettings {
  crtScanlines: boolean;
  scanlineOpacity: number; // 0 to 0.4
  glassmorphismBlur: number; // 0 to 24px
  glowIntensity: number; // 0 to 1.5
  wcagHighContrast: boolean;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    category: 'CYBER',
    description: 'Electric cyan, neon rose, and deep obsidian with high-energy glowing laser accents.',
    colors: {
      accent: '#00f0ff',
      accentHover: '#38bdf8',
      surface0: '#06070a',
      surface1: '#0d1017',
      surface2: '#161b26',
      border: '#242b3d',
      textPrimary: '#ffffff',
      textSecondary: '#94a3b8',
      glow: 'rgba(0, 240, 255, 0.4)',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    category: 'CYBER',
    description: 'Moody indigo navy, soft lavender, and electric magenta inspired by Tokyo skylines.',
    colors: {
      accent: '#a78bfa',
      accentHover: '#c084fc',
      surface0: '#0a0a14',
      surface1: '#121224',
      surface2: '#1c1c36',
      border: '#2e2e54',
      textPrimary: '#f8fafc',
      textSecondary: '#a5b4fc',
      glow: 'rgba(167, 139, 250, 0.35)',
    },
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    category: 'DARK',
    description: 'Soothing pastel palette with warm dark slate, lavender, and emerald highlights.',
    colors: {
      accent: '#cdd6f4',
      accentHover: '#b4befe',
      surface0: '#11111b',
      surface1: '#181825',
      surface2: '#1e1e2e',
      border: '#313244',
      textPrimary: '#cdd6f4',
      textSecondary: '#a6adc8',
      glow: 'rgba(180, 190, 254, 0.3)',
    },
  },
  {
    id: 'nord-frost',
    name: 'Nord Frost',
    category: 'DARK',
    description: 'Arctic polar night palette with crisp icy blue and auroral accents.',
    colors: {
      accent: '#88c0d0',
      accentHover: '#81a1c1',
      surface0: '#0f141c',
      surface1: '#161e2b',
      surface2: '#242f42',
      border: '#3b4252',
      textPrimary: '#eceff4',
      textSecondary: '#d8dee9',
      glow: 'rgba(136, 192, 208, 0.35)',
    },
  },
  {
    id: 'obsidian-matrix',
    name: 'Obsidian Matrix',
    category: 'MINIMAL',
    description: 'Pure pitch black OLED background with tactical phosphor green terminal lasers.',
    colors: {
      accent: '#10b981',
      accentHover: '#34d399',
      surface0: '#000000',
      surface1: '#09090b',
      surface2: '#121215',
      border: '#202025',
      textPrimary: '#f4f4f5',
      textSecondary: '#a1a1aa',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
  },
];

class ThemeEngine {
  private currentThemeId: string = 'cyberpunk-neon';
  private shaderSettings: HudShaderSettings = {
    crtScanlines: false,
    scanlineOpacity: 0.15,
    glassmorphismBlur: 12,
    glowIntensity: 1.0,
    wcagHighContrast: false,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('nv_theme_id');
      if (storedTheme) this.currentThemeId = storedTheme;

      const storedShaders = localStorage.getItem('nv_shader_settings');
      if (storedShaders) {
        try {
          this.shaderSettings = { ...this.shaderSettings, ...JSON.parse(storedShaders) };
        } catch {
          // Ignore
        }
      }
      this.applyTheme(this.currentThemeId);
    }
  }

  public getTheme(): ThemePreset {
    return THEME_PRESETS.find((t) => t.id === this.currentThemeId) || THEME_PRESETS[0];
  }

  public getShaderSettings(): HudShaderSettings {
    return this.shaderSettings;
  }

  public setTheme(themeId: string) {
    this.currentThemeId = themeId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('nv_theme_id', themeId);
      this.applyTheme(themeId);
    }
  }

  public setShaderSettings(settings: Partial<HudShaderSettings>) {
    this.shaderSettings = { ...this.shaderSettings, ...settings };
    if (typeof window !== 'undefined') {
      localStorage.setItem('nv_shader_settings', JSON.stringify(this.shaderSettings));
      this.applyShaders();
    }
  }

  public applyTheme(themeId: string) {
    if (typeof window === 'undefined') return;
    const theme = THEME_PRESETS.find((t) => t.id === themeId) || THEME_PRESETS[0];
    const root = document.documentElement;

    root.style.setProperty('--color-brand-cyan', theme.colors.accent);
    root.style.setProperty('--color-brand-hover', theme.colors.accentHover);
    root.style.setProperty('--color-surface-0', theme.colors.surface0);
    root.style.setProperty('--color-surface-1', theme.colors.surface1);
    root.style.setProperty('--color-surface-2', theme.colors.surface2);
    root.style.setProperty('--color-border-subtle', theme.colors.border);
    root.style.setProperty('--color-text-primary', theme.colors.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-theme-glow', theme.colors.glow);

    this.applyShaders();
  }

  private applyShaders() {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;

    root.style.setProperty('--hud-blur', `${this.shaderSettings.glassmorphismBlur}px`);
    root.style.setProperty('--hud-glow-multiplier', String(this.shaderSettings.glowIntensity));

    if (this.shaderSettings.crtScanlines) {
      document.body.classList.add('nv-crt-scanlines');
    } else {
      document.body.classList.remove('nv-crt-scanlines');
    }

    if (this.shaderSettings.wcagHighContrast) {
      document.body.classList.add('nv-high-contrast');
    } else {
      document.body.classList.remove('nv-high-contrast');
    }
  }
}

export const GlobalThemeEngine = new ThemeEngine();
