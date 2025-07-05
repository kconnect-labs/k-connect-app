import { Ionicons } from '@expo/vector-icons';
import useMessengerStore from '@stores/useMessengerStore';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import TGSSticker from './TGSSticker';

const { width: screenWidth } = Dimensions.get('window');
const API_BASE = "https://k-connect.ru";
const API_MESSENGER = "https://k-connect.ru/apiMes";

// Кеширование для статичных стикеров происходит на уровне Image компонента
// TGS стикеры кешируются в TGSSticker компоненте

// Функция для определения типа стикера
const getStickerType = async (sticker: any): Promise<'tgs' | 'static' | 'unknown'> => {
  if (!sticker.url) return 'unknown';
  
  // Сначала проверяем данные стикера, если есть
  if (sticker.mime_type) {
    if (sticker.mime_type === 'application/x-tgsticker') return 'tgs';
    if (sticker.mime_type === 'video/webm') return 'static'; // webm пока не поддерживаем
    return 'static';
  }
  
  // Если данных нет, проверяем URL (менее надежно)
  const url = sticker.url.toLowerCase();
  if (url.includes('.tgs') || url.includes('tgsticker')) return 'tgs';
  if (url.includes('.webm')) return 'static'; // webm пока не поддерживаем
  
  // Для API эндпоинтов делаем асинхронную проверку
  if (url.includes('/api/messenger/stickers/')) {
    try {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      
      if (contentType === 'application/json') {
        const jsonData = await response.json();
        if (jsonData.file_url) {
          const fileResponse = await fetch(jsonData.file_url);
          const fileContentType = fileResponse.headers.get('content-type');
          
          if (fileContentType === 'application/x-tgsticker') {
            return 'tgs';
          }
        }
      } else if (contentType === 'application/x-tgsticker') {
        return 'tgs';
      }
    } catch (error) {
      console.error('Error checking sticker type:', error);
    }
  }
  
  return 'static'; // webp, png, jpeg
};

// Компонент для статичных стикеров с кешированием
const StaticSticker = ({ src, style, onPress }: { src: string; style: any; onPress: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        
        // В React Native просто используем оригинальный URL
        // Кеширование происходит на уровне Image компонента
        console.log('StaticSticker: Loading image from:', src);
        
      } catch (error) {
        console.error('Error loading image:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      loadImage();
    }
  }, [src]);

  return (
    <TouchableOpacity
      style={[style, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {loading && (
        <View style={[style, { position: 'absolute', justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="small" color="#D0BCFF" />
        </View>
      )}
      <Image
        source={{ uri: src }}
        style={[style, { opacity: loading ? 0 : 1 }]}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        resizeMode="contain"
      />
      {error && (
        <View style={[style, { position: 'absolute', justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="alert-circle" size={24} color="#ff6b6b" />
        </View>
      )}
    </TouchableOpacity>
  );
};

// Компонент для TGS стикеров с кешированием
const TGSStickerCached = ({ src, style, onPress }: { src: string; style: any; onPress: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    console.log('TGSStickerCached: Animation loaded');
    setLoading(false);
  };

  const handleError = (error: any) => {
    console.error('TGS sticker error:', error);
    setLoading(false);
    setError(true);
  };

  return (
    <TouchableOpacity
      style={[style, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {loading && (
        <View style={[style, { position: 'absolute', justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="small" color="#D0BCFF" />
        </View>
      )}
      <TGSSticker
        src={src}
        style={[style, { opacity: loading ? 0 : 1 }]}
        onLoad={handleLoad}
        onError={handleError}
      />
      {error && (
        <View style={[style, { position: 'absolute', justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="alert-circle" size={24} color="#ff6b6b" />
        </View>
      )}
    </TouchableOpacity>
  );
};

// Компонент для отдельного стикера с асинхронным определением типа
const StickerItem = ({ sticker, pack, onStickerSelect }: { 
  sticker: any; 
  pack: any; 
  onStickerSelect: (pack: any, sticker: any) => void;
}) => {
  const [stickerType, setStickerType] = useState<'tgs' | 'static' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(true);

  const commonStyle = {
    width: (screenWidth - 80) / 4,
    height: (screenWidth - 80) / 4,
  };

  const handleClick = () => onStickerSelect(pack, sticker);

  // Обрабатываем URL стикера
  let stickerUrl = sticker.url;
  if (stickerUrl && !stickerUrl.startsWith('http')) {
    // Если URL относительный, добавляем базовый URL
    stickerUrl = `${API_BASE}${stickerUrl.startsWith('/') ? '' : '/'}${stickerUrl}`;
  }

  // Определяем тип стикера асинхронно
  useEffect(() => {
    const checkType = async () => {
      try {
        setLoading(true);
        const type = await getStickerType(sticker);
        setStickerType(type);
      } catch (error) {
        console.error('Error determining sticker type:', error);
        setStickerType('static');
      } finally {
        setLoading(false);
      }
    };
    checkType();
  }, [sticker]);

  if (loading) {
    return (
      <View style={[commonStyle, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
        <ActivityIndicator size="small" color="#D0BCFF" />
      </View>
    );
  }

  // Рендерим стикер в зависимости от типа
  if (stickerType === 'tgs') {
    return (
      <TGSStickerCached
        src={stickerUrl}
        style={commonStyle}
        onPress={handleClick}
      />
    );
  } else {
    return (
      <StaticSticker
        src={stickerUrl}
        style={commonStyle}
        onPress={handleClick}
      />
    );
  }
};

interface StickerPickerProps {
  onStickerSelect: (stickerData: { pack_id: string; sticker_id: string; name: string; emoji: string }) => void;
  onClose: () => void;
  isOpen: boolean;
}

const StickerPicker: React.FC<StickerPickerProps> = ({ onStickerSelect, onClose, isOpen }) => {
  const { sessionKey } = useMessengerStore();
  const [stickerPacks, setStickerPacks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // Загрузка стикерпаков
  const loadStickerPacks = useCallback(async () => {
    if (!sessionKey) return;
    
    try {
      setLoading(true);
      console.log('StickerPicker: Loading sticker packs from API');
      
      const response = await fetch(`${API_MESSENGER}/messenger/sticker-packs/my`, {
        headers: {
          'Authorization': `Bearer ${sessionKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const packs = data.packs || [];
        setStickerPacks(packs);
        console.log('StickerPicker: Loaded sticker packs:', packs.length);
      }
    } catch (error) {
      console.error('Error loading sticker packs:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить стикеры');
    } finally {
      setLoading(false);
    }
  }, [sessionKey]);

  useEffect(() => {
    if (isOpen) {
      loadStickerPacks();
    }
  }, [isOpen, loadStickerPacks]);

  const handleStickerClick = (pack: any, sticker: any) => {
    onStickerSelect({
      pack_id: pack.id,
      sticker_id: sticker.id,
      name: sticker.name,
      emoji: sticker.emoji
    });
    onClose();
  };

  // Рендерим содержимое только если пикер открыт
  if (!isOpen) {
    return null;
  }

  const activePack = stickerPacks[activeTab];

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Стикеры</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="rgba(255, 255, 255, 0.7)" />
        </TouchableOpacity>
      </View>

      {/* Контент */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D0BCFF" />
          </View>
        ) : stickerPacks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="happy" size={48} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.emptyText}>У вас пока нет стикерпаков</Text>
          </View>
        ) : (
          <>
            {/* Сетка стикеров */}
            <ScrollView style={styles.stickerGrid} showsVerticalScrollIndicator={false}>
              {activePack && activePack.stickers && (
                <View style={styles.gridContainer}>
                  {activePack.stickers.map((sticker: any) => (
                    <StickerItem
                      key={sticker.id}
                      sticker={sticker}
                      pack={activePack}
                      onStickerSelect={handleStickerClick}
                    />
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Вкладки стикерпаков внизу */}
            <View style={styles.tabsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {stickerPacks.map((pack, index) => (
                  <TouchableOpacity
                    key={pack.id}
                    style={[styles.tab, activeTab === index && styles.activeTab]}
                    onPress={() => setActiveTab(index)}
                  >
                    <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
                      {pack.name || `Пачка ${index + 1}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  stickerGrid: {
    flex: 1,
    padding: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  tabsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    backgroundColor: '#D0BCFF',
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabText: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
});

export default StickerPicker; 