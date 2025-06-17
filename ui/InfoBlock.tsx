import React, { CSSProperties } from 'react';
import { getGradientEffects, gradientBorder } from './GradientEffects';

interface InfoBlockProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  styleVariant?: 'dark' | 'light';
  className?: string;
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  descriptionStyle?: CSSProperties;
}

const containerStyles = (styleVariant: 'dark' | 'light'): CSSProperties => ({
  width: '100%',
  margin: '0 auto',
  marginBottom: '8px',
  color: styleVariant === 'dark' ? 'white' : '#000',
  textAlign: 'left',
  padding: '14px',
  ...gradientBorder(styleVariant),
  ...getGradientEffects({ variant: styleVariant }),
});

const titleStyles = (styleVariant: 'dark' | 'light'): CSSProperties => ({
  fontWeight: 700,
  margin: 0,
  marginBottom: '4px',
  fontSize: '1.25rem',
  lineHeight: 1.2,
  color: styleVariant === 'dark' ? 'white' : '#000',
});

const descriptionStyles = (styleVariant: 'dark' | 'light'): CSSProperties => ({
  color: styleVariant === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  margin: 0,
});

export const InfoBlock: React.FC<InfoBlockProps> = ({
  title,
  description,
  children,
  styleVariant = 'dark',
  className,
  style,
  titleStyle,
  descriptionStyle,
}) => {
  return (
    <div 
      className={className}
      style={{
        ...containerStyles(styleVariant),
        ...style,
      }}
    >
      {title && (
        <h5 style={{
          ...titleStyles(styleVariant),
          ...titleStyle,
        }}>
          {title}
        </h5>
      )}
      {description && (
        <p style={{
          ...descriptionStyles(styleVariant),
          ...descriptionStyle,
        }}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}; 