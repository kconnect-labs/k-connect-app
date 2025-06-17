import { Text, TextProps } from 'react-native';
import React, { FC } from 'react';

interface Props extends TextProps {
  className?: string;
  children: React.ReactNode;
  color?: string;
  size?: number;
  weight?: 'normal' | 'bold' | 'semibold' | 'medium';
  numberOfLines?: number;
}

const TextC: FC<Props> = ({
  className,
  children,
  color = 'white',
  size = 14,
  weight = 'normal',
  numberOfLines,
  ...props
}) => {
  const getFontFamily = () => {
    switch (weight) {
      case 'bold':
        return 'SFProDisplay-Bold';
      case 'semibold':
        return 'SFProDisplay-SemiBold';
      case 'medium':
        return 'SFProDisplay-Medium';
      default:
        return 'SFProDisplay-Regular';
    }
  };

  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        fontFamily: getFontFamily(),
        color,
        fontSize: size,
      }}
      className={className}
      {...props}
    >
      {children}
    </Text>
  );
};

export default TextC;
