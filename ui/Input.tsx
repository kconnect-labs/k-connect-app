import { TextInput } from 'react-native';
import { FC } from 'react';
import TextC from './TextC';
import { Flex } from './Flex';
type BaseInputProps = {
  placeholder: string;
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
};

type PasswordInputProps = BaseInputProps & {
  type: 'password';
  isVisible?: boolean;
};

type TextInputProps = BaseInputProps & {
  type: 'text';
};

type CustomInputProps = PasswordInputProps | TextInputProps;

export const Input: FC<CustomInputProps> = (props) => {
  const { placeholder, className, label, onChangeText, value, type, ...rest } = props;
  const { isVisible } = rest as PasswordInputProps;
  return (
    <Flex direction="column" className="flex-1" gap={0.2}>
      {label && <TextC className="text-[#84828b]">{label}</TextC>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        maxLength={25}
        secureTextEntry={type === 'password' && !isVisible}
        placeholderTextColor={'#84828b'}
        keyboardType="default"
        multiline={false}
        placeholder={placeholder}
        className={`placeholder::text-white w-full rounded-xl bg-[#292929] px-4 py-2 text-white ${className}`}
        style={{ fontFamily: 'Montserrat-SemiBold' }}
      />
    </Flex>
  );
};
