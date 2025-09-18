
<div align="center">

# Коннект Апп

![версия](https://img.shields.io/badge/версия-1.5.4-blue)
![лицензия](https://img.shields.io/badge/лицензия-MIT-green)
![статус](https://img.shields.io/badge/статус-в%20разработке-yellow)
![тесты](https://img.shields.io/badge/тесты-85%25-success)
![размер](https://img.shields.io/badge/размер-240KB-informational)

![expogo](https://img.shields.io/badge/Expo%20Go-3.10+-blue?logo=expo)
![ts](https://img.shields.io/badge/TypeScript-4.2-brightgreen?logo=typescript)
![gradle](https://img.shields.io/badge/Gradle-15-informational?logo=gradle)

</div>

## 📱 Описание

Коннект Апп — современное мобильное приложение, построенное на React Native и Expo. Приложение предоставляет интуитивный интерфейс и высокую производительность для решения задач подключения и взаимодействия.

## ✨ Особенности

- ⚡ Быстрая загрузка и отзывчивый интерфейс
- 🔒 Безопасное хранение данных с Expo Secure Store
- 📱 Кроссплатформенность (iOS/Android/Web)
- 🎨 Современный дизайн с анимациями Lottie
- 📋 Работа с буфером обмена
- 🔗 Поддержка deep linking
- 🌐 TypeScript поддержка

## 🔧 Требования

- Node.js 18.0+
- npm или yarn
- Expo CLI
- Git
- GitHub CLI (для клонирования)

## 🚀 Установка

### 1. Клонирование репозиториев

```
gh repo clone kconnect-labs/k-connect-app
gh repo clone kiwinatra/nui-kk-pack
```

### 2. Настройка проекта

```
cd k-connect-app
```

Скопируйте файлы из папки `nui-kk-pack` в корневую папку проекта.

### 3. Установка зависимостей

```
npm install --legacy-peer-deps
```

### 4. Установка дополнительных пакетов

```
npm install @react-native-async-storage/async-storage@2.1.2 \
expo@53.0.22 \
expo-clipboard@~7.1.5 \
expo-constants@~17.1.7 \
expo-font@~13.3.2 \
expo-image@~2.4.0 \
expo-linking@~7.1.7 \
expo-router@~5.1.6 \
expo-secure-store@~14.2.4 \
expo-splash-screen@~0.30.10 \
expo-system-ui@~5.0.11 \
expo-web-browser@~14.2.0 \
lottie-react-native@7.2.2 \
react-native@0.79.5 \
react-native-pager-view@6.7.1 \
react-native-svg@15.11.2 --legacy-peer-deps
```

### 5. Запуск приложения

```
expo start web --clear
```

## 🛠️ Решение проблем

Если возникают ошибки при установке или запуске:

1. **Очистите кэш и зависимости:**
   ```
   rm -rf node_modules .expo
   npm install --legacy-peer-deps
   ```

2. **Переустановите nuitka:**
   ```
   pip uninstall nuitka
   pip install nuitka
   ```

`ВАЖНО! Если у вас не установлен python, удаляйте .nui и запускайте:

```bash
expo start -- --clearcache
```
`

3. **Проверьте версию Node.js:**
   ```
   node --version
   ```

## 📦 Основные зависимости

- **React Native** - Фреймворк для мобильной разработки
- **Expo** - Платформа для React Native приложений
- **TypeScript** - Статическая типизация
- **Lottie** - Анимации
- **Async Storage** - Локальное хранилище
- **React Router** - Навигация

## 🤝 Вклад в проект

1. Создайте fork репозитория
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Зафиксируйте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Отправьте в branch (`git push origin feature/AmazingFeature`)
5. Создайте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.



