import { Text, View } from 'react-native';
import { Flex } from './Flex';
import TextC from './TextC';
import { FC } from 'react';

type Props = {
  color: string;
  textColor?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

const Badge: FC<Props> = ({ color, children, textColor = '#fff', icon }) => {
  return (
    <Flex
      align="center"
      style={{ backgroundColor: `${color}80`, borderColor: color, borderWidth: 1 }}
      className="px-3 py-1 rounded-2xl"
      gap={4}
    >
      {icon && icon}
      {children}
    </Flex>
  );
};

export default Badge;
