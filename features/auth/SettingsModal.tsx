import AsyncStorage from '@react-native-async-storage/async-storage';
import TextC from '@ui/TextC';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Modal, Portal, Switch, TextInput } from 'react-native-paper';

interface SettingsModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onDismiss }) => {
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      const storedApiUrl = await AsyncStorage.getItem('apiUrl');
      const storedApiKey = await AsyncStorage.getItem('apiKey');
      const storedDebugMode = await AsyncStorage.getItem('debugMode');

      setApiUrl(storedApiUrl || 'https://k-connect.ru');
      setApiKey(storedApiKey || 'liquide-gg-v2');
      setDebugMode(storedDebugMode === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('apiUrl', apiUrl);
      await AsyncStorage.setItem('apiKey', apiKey);
      await AsyncStorage.setItem('debugMode', debugMode.toString());
      Alert.alert('Success', 'Settings saved successfully');
      onDismiss();
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const clearStorage = async () => {
    Alert.alert(
      'Clear Storage',
      'Are you sure you want to clear all stored data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('user');
              await SecureStore.deleteItemAsync('authToken');
              await SecureStore.deleteItemAsync('sessionKey');
              await SecureStore.deleteItemAsync('needsProfileSetup');
              await SecureStore.deleteItemAsync('chatId');
              await AsyncStorage.clear();
              Alert.alert('Success', 'Storage cleared successfully');
              onDismiss();
            } catch (error) {
              console.error('Error clearing storage:', error);
              Alert.alert('Error', 'Failed to clear storage');
            }
          },
        },
      ]
    );
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={{
        backgroundColor: '#1e1e2e',
        padding: 20,
        margin: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
      }}>
        <TextC size={20} weight="bold" color="#ffffff" className="mb-4 text-center">
          Developer Settings
        </TextC>

        <TextInput
          label="API URL"
          value={apiUrl}
          onChangeText={setApiUrl}
          mode="outlined"
          style={{ marginBottom: 16 }}
          theme={{ colors: { primary: '#6366f1', background: '#1e1e2e' } }}
        />

        <TextInput
          label="API Key"
          value={apiKey}
          onChangeText={setApiKey}
          mode="outlined"
          style={{ marginBottom: 16 }}
          theme={{ colors: { primary: '#6366f1', background: '#1e1e2e' } }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <TextC size={16} color="#ffffff" className="flex-1">
            Debug Mode
          </TextC>
          <Switch value={debugMode} onValueChange={setDebugMode} color="#6366f1" />
        </View>

        <Button
          mode="contained"
          onPress={saveSettings}
          style={{ marginBottom: 16 }}
          buttonColor="#6366f1"
        >
          Save Settings
        </Button>

        <Button
          mode="outlined"
          onPress={clearStorage}
          textColor="#ff6b6b"
          style={{ borderColor: '#ff6b6b' }}
        >
          Clear Storage
        </Button>
      </Modal>
    </Portal>
  );
};

export default SettingsModal;
