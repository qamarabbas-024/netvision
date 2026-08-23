'use client';

import React, { useState, useEffect } from 'react';
import {
  Palette,
  Sparkles,
  Tv,
  Sliders,
  Check,
  Eye,
  Zap,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  GlobalThemeEngine,
  THEME_PRESETS,
  ThemePreset,
  HudShaderSettings,
} from '@/lib/themeEngine';
import { SoundFx } from '@/lib/soundFx';

interface HyperThemeStudioProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const HyperThemeStudio: React.FC<HyperThemeStudioProps> = ({
  isOpen = true,
  onClose,
}) => {
  const [activeTheme, setActiveTheme] = useState<ThemePreset>(() => GlobalThemeEngine.getTheme());
  const [shaders, setShaders] = useState<HudShaderSettings>(() => GlobalThemeEngine.getShaderSettings());

  useEffect(() => {
    setActiveTheme(GlobalThemeEngine.getTheme());
    setShaders(GlobalThemeEngine.getShaderSettings());
  }, [isOpen]);

  const selectTheme = (theme: ThemePreset) => {
    SoundFx.playTerminalKeyPress();
    setActiveTheme(theme);
    GlobalThemeEngine.setTheme(theme.id);
  };

  const updateShader = (newSettings: Partial<HudShaderSettings>) => {
    const updated = { ...shaders, ...newSettings };
    setShaders(updated);
    GlobalThemeEngine.setShaderSettings(newSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full rounded-3xl bg-[#090a0f] border border-[#222533] shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-[#10121a] border-b border-[#222533] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00f0ff] font-bold uppercase tracking-wider">
                Version 4.3 Studio
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 text-[10px] font-mono font-bold">
                Hyper-Theme & Shaders
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Theme Engine & CRT Optics</h2>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#181a26] border border-[#222533] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#222533]">
        {/* Left 7 Cols: Theme Preset Cards */}
        <div className="lg:col-span-7 p-5 flex flex-col gap-4 bg-[#0c0d14]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" /> Available Pro Themes
            </span>
            <span className="text-[10px] font-mono text-zinc-500">{THEME_PRESETS.length} Curated Palettes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEME_PRESETS.map((preset) => {
              const isSelected = activeTheme.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => selectTheme(preset)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col gap-2 ${
                    isSelected
                      ? 'border-[#00f0ff] bg-[#141824] shadow-glow-cyan'
                      : 'border-[#222533] bg-[#10121a] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#00f0ff] text-black flex items-center justify-center text-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>

                  {/* Color Swatch Dots */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: preset.colors.accent }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: preset.colors.surface0 }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: preset.colors.surface2 }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: preset.colors.textPrimary }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: HUD Shaders & Live Component Preview */}
        <div className="lg:col-span-5 p-5 bg-[#090a0f] flex flex-col gap-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#222533]">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#00f0ff]" /> HUD Optics & Shaders
            </span>
          </div>

          {/* Shaders Controls */}
          <div className="space-y-4">
            {/* CRT Scanlines Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#10121a] border border-[#222533]">
              <div className="flex items-center gap-2.5">
                <Tv className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs font-bold text-white">CRT Retro Scanlines</div>
                  <div className="text-[10px] text-zinc-400">Phosphor tube scanlines overlay</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={shaders.crtScanlines}
                onChange={(e) => updateShader({ crtScanlines: e.target.checked })}
                className="w-4 h-4 accent-[#00f0ff] rounded cursor-pointer"
              />
            </div>

            {/* Glassmorphism Blur Slider */}
            <div className="p-3 rounded-2xl bg-[#10121a] border border-[#222533] space-y-2">
              <div className="flex justify-between text-xs font-bold text-zinc-300">
                <span>Glassmorphic Refraction</span>
                <span className="text-[#00f0ff] font-mono">{shaders.glassmorphismBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={shaders.glassmorphismBlur}
                onChange={(e) => updateShader({ glassmorphismBlur: Number(e.target.value) })}
                className="w-full accent-[#00f0ff]"
              />
            </div>

            {/* Glow Intensity Slider */}
            <div className="p-3 rounded-2xl bg-[#10121a] border border-[#222533] space-y-2">
              <div className="flex justify-between text-xs font-bold text-zinc-300">
                <span>Laser Glow Luminescence</span>
                <span className="text-[#00f0ff] font-mono">{shaders.glowIntensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={shaders.glowIntensity}
                onChange={(e) => updateShader({ glowIntensity: Number(e.target.value) })}
                className="w-full accent-purple-400"
              />
            </div>

            {/* High-Contrast WCAG Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#10121a] border border-[#222533]">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">WCAG AAA High Contrast</div>
                  <div className="text-[10px] text-zinc-400">Maximize readability and sharpness</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={shaders.wcagHighContrast}
                onChange={(e) => updateShader({ wcagHighContrast: e.target.checked })}
                className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl border border-[#222533] bg-[#0e1017] space-y-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
              Live Paletted Elements
            </span>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm" leftIcon={<Zap className="w-3 h-3" />}>
                Primary Action
              </Button>
              <Button variant="secondary" size="sm">
                Secondary
              </Button>
              <Button variant="outline" size="sm">
                Outline
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
