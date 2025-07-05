import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Кеш для TGS стикеров
const tgsCache = new Map();
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 дней

// Функция для получения кешированного TGS
const getCachedTGS = (url: string) => {
  const cached = tgsCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Функция для сохранения TGS в кеш
const setCachedTGS = (url: string, data: any) => {
  tgsCache.set(url, {
    data,
    timestamp: Date.now()
  });
};

interface TGSStickerProps {
  src: string;
  style: any;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

const TGSSticker: React.FC<TGSStickerProps> = ({ src, style, onLoad, onError }) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadTGS = async () => {
      try {
        setLoading(true);
        setError(false);
        
        console.log('TGSSticker: Loading TGS file from:', src);
        
        // Проверяем кеш
        const cachedData = getCachedTGS(src);
        if (cachedData) {
          console.log('TGSSticker: Using cached TGS data');
          setAnimationData(cachedData);
          setLoading(false);
          onLoad?.(); // Вызываем onLoad для кешированных данных
          return;
        }
        
        const response = await fetch(src);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        console.log('TGSSticker: Content-Type:', contentType);
        
        let fileUrl = src;
        let arrayBuffer;
        
        // Если это JSON, значит сервер вернул метаданные стикера
        if (contentType === 'application/json') {
          const jsonData = await response.json();
          console.log('TGSSticker: Received JSON data:', jsonData);
          
          // Проверяем, есть ли URL файла в ответе
          if (jsonData.file_url) {
            fileUrl = jsonData.file_url;
            console.log('TGSSticker: Loading file from:', fileUrl);
            
            const fileResponse = await fetch(fileUrl);
            if (!fileResponse.ok) {
              throw new Error(`File HTTP ${fileResponse.status}`);
            }
            
            arrayBuffer = await fileResponse.arrayBuffer();
          } else {
            // Если нет file_url, пробуем использовать данные из JSON
            console.log('TGSSticker: No file_url in JSON, trying to use JSON data directly');
            const textEncoder = new TextEncoder();
            arrayBuffer = textEncoder.encode(JSON.stringify(jsonData)).buffer;
          }
        } else {
          // Прямая загрузка файла
          arrayBuffer = await response.arrayBuffer();
        }
        
        let jsonData;
        
        try {
          // Пробуем распаковать как gzip
          const pako = require('pako');
          const decompressed = pako.inflate(new Uint8Array(arrayBuffer));
          const textDecoder = new TextDecoder();
          jsonData = JSON.parse(textDecoder.decode(decompressed));
          console.log('TGSSticker: Successfully decompressed TGS file');
        } catch (gzipError) {
          // Если не gzip, пробуем как обычный JSON
          const textDecoder = new TextDecoder();
          jsonData = JSON.parse(textDecoder.decode(new Uint8Array(arrayBuffer)));
          console.log('TGSSticker: Successfully parsed TGS file as JSON');
        }
        
        // Проверяем валидность данных для Lottie
        if (!jsonData || !jsonData.v || !jsonData.fr) {
          console.error('TGSSticker: Invalid TGS data for Lottie:', jsonData);
          setError(true);
          onError?.(new Error('Invalid TGS data'));
          return;
        }
        
        // Сохраняем в кеш
        setCachedTGS(src, jsonData);
        setAnimationData(jsonData);
        console.log('TGSSticker: TGS data loaded successfully and cached');
        onLoad?.(); // Вызываем onLoad после установки данных
      } catch (error) {
        console.error('TGSSticker: Error loading TGS:', error);
        setError(true);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      loadTGS();
    }
  }, [src, onError, onLoad]);

  // Вызываем onLoad когда animationData загружен
  useEffect(() => {
    if (animationData && !loading) {
      console.log('TGSSticker: Animation data ready, calling onLoad');
      onLoad?.();
    }
  }, [animationData, loading, onLoad]);

  if (loading) {
    return (
      <View style={[style, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#D0BCFF" />
      </View>
    );
  }

  if (error || !animationData) {
    // Fallback to error state
    return (
      <View style={[style, styles.errorContainer]}>
        <ActivityIndicator size="small" color="#ff6b6b" />
      </View>
    );
  }

  return (
    <View style={style}>
      <LottieView
        source={animationData}
        autoPlay
        loop
        style={styles.lottieAnimation}
        onAnimationFinish={() => {
          console.log('TGSSticker: Animation finished');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
});

export default TGSSticker; 