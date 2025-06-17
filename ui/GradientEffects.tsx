import { CSSProperties } from 'react';

interface GradientColors {
  start: string;
  end: string;
}

interface GradientOptions {
  position?: 'center' | 'top';
  variant?: 'dark' | 'light';
  customColors?: GradientColors;
}

const baseGradientEffect: CSSProperties = {
  content: '""',
  position: 'absolute',
  width: 180,
  height: 220,
  background: 'linear-gradient(13.89deg, #B69DF8 47.02%, #D0BCFF 97.69%)',
  opacity: 0.25,
  filter: 'blur(18px)',
  borderRadius: '50%',
  zIndex: 1,
  pointerEvents: 'none',
};

const gradientEffects = {
  before: {
    ...baseGradientEffect,
    left: -80,
    top: '50%',
    transform: 'translateY(-50%) rotate(-12deg)',
  },
  after: {
    ...baseGradientEffect,
    right: -80,
    top: '50%',
    transform: 'translateY(-50%) rotate(12deg)',
  },
  beforeTop: {
    ...baseGradientEffect,
    left: -80,
    top: 0,
    transform: 'rotate(-12deg)',
    height: 90,
  },
  afterTop: {
    ...baseGradientEffect,
    right: -80,
    top: 0,
    transform: 'rotate(12deg)',
    height: 90,
  },
};

export const getGradientEffects = (options: GradientOptions = {}) => {
  const {
    position = 'center',
    variant = 'dark',
    customColors = { start: '#B69DF8', end: '#D0BCFF' }
  } = options;

  const opacity = variant === 'dark' ? 0.25 : 0.15;
  const gradient = `linear-gradient(13.89deg, ${customColors.start} 47.02%, ${customColors.end} 97.69%)`;

  if (position === 'top') {
    return {
      '&::before': {
        ...gradientEffects.beforeTop,
        background: gradient,
        opacity,
      },
      '&::after': {
        ...gradientEffects.afterTop,
        background: gradient,
        opacity,
      },
    };
  }

  return {
    '&::before': {
      ...gradientEffects.before,
      background: gradient,
      opacity,
    },
    '&::after': {
      ...gradientEffects.after,
      background: gradient,
      opacity,
    },
  };
};

export const gradientBorder = (variant: 'dark' | 'light' = 'dark'): CSSProperties => ({
  border: `1px solid ${variant === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  background: variant === 'dark' ? '#1c1c1c' : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
  zIndex: 2,
}); 