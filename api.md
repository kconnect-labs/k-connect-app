Документация API К-Коннект
Здесь вы найдете документацию по API К-Коннект с примерами запросов и ответов. API позволяет взаимодействовать с системой программно для разработки собственных интеграций.

API доступ и безопасность
API К-Коннект защищено от несанкционированного доступа с помощью CORS и механизма проверки API-ключей. Для использования API из внешних приложений или скриптов необходимо получить API-ключ.

Ограничения CORS
По умолчанию API доступно только для запросов с домена k-connect.ru и локальных разработочных сред. Для доступа из внешних приложений используйте API-ключ.

Использование API-ключа
Для обхода ограничений CORS и получения доступа к API из любого приложения, необходимо добавить специальный заголовок X-API-Key ко всем запросам.

// Пример запроса с API-ключом
fetch('https://k-connect.ru/api/posts', {
  method: 'GET',
  headers: {
    'X-API-Key': 'ваш-api-ключ-здесь'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Ошибка:', error));
Получение API-ключа
API-ключ можно получить у администрации К-Коннект. Для получения ключа необходимо:

Быть зарегистрированным пользователем К-Коннект
Отправить запрос администрации с описанием цели использования API
После одобрения запроса вам будет выдан персональный API-ключ
Важно: Храните ваш API-ключ в безопасности и не передавайте его третьим лицам. Ключ может быть отозван в случае нарушения правил использования API.

Способы авторизации
К-Коннект поддерживает несколько способов авторизации для максимальной гибкости и безопасности.

1. Session Key (рекомендуется)
Используйте session_key из LocalStorage для авторизации. Это наиболее безопасный и удобный способ для веб-приложений.

// Получение session_key из LocalStorage
const sessionKey = localStorage.getItem('session_key');

// Использование в заголовке Authorization
fetch('/api/auth/check', {
  headers: {
    'Authorization': `Bearer ${sessionKey}`
  }
});

// Или в куки (автоматически)
document.cookie = `session_key=${sessionKey}; path=/`;
2. Email/Password
Классическая авторизация с логином и паролем. Поддерживает remember me функциональность.

3. Telegram
Авторизация через Telegram Bot API. Пользователь авторизуется через Telegram и получает доступ к системе.

4. Element (Matrix)
Авторизация через Element клиент. Создает пользователя автоматически при первом входе.

Безопасность
Session Key хранится в LocalStorage и автоматически отправляется с запросами
Поддержка HTTP-only cookies для дополнительной защиты
Автоматическая проверка источника запроса (CORS)
Rate limiting для предотвращения брутфорс атак
Блокировка IP при подозрительной активности
Основные эндпоинты авторизации
POST
/api/auth/register

Регистрация нового пользователя с email и паролем. Включает защиту от ботов и ограничения по IP.

Пример запроса:
POST /api/auth/register
Content-Type: application/json
{
  "username": "string (3-30 символов, только буквы, цифры, _)",
  "email": "string (валидный email)",
  "password": "string (минимум 8 символов)",
  "name": "string (опционально, по умолчанию = username)"
}
Пример ответа:
{
  "success": true,
  "message": "Регистрация успешна. Проверьте email для подтверждения."
}

// Ошибки:
{
  "error": "Слишком много попыток регистрации. Повторите через X секунд.",
  "retry_after": number
}

{
  "error": "Ваш IP временно заблокирован из-за подозрительной активности.",
  "blocked": true,
  "retry_after": number
}
POST
/api/auth/login

Вход в систему с email/username и паролем. Поддерживает remember me.

Пример запроса:
POST /api/auth/login
Content-Type: application/json
{
  "usernameOrEmail": "string (email или username)",
  "password": "string",
  "remember": boolean (опционально, по умолчанию false)
}
Пример ответа:
{
  "success": true,
  "message": "Вход выполнен успешно",
  "user": {
    "id": number,
    "name": "string",
    "username": "string",
    "photo": "string"
  }
}

// Ошибки:
{
  "success": false,
  "error": "Неверный логин или пароль."
}

{
  "success": false,
  "error": "Слишком много попыток входа. Повторите через X секунд.",
  "retry_after": number
}
GET
/api/auth/check

Проверка статуса авторизации пользователя. Поддерживает session_key из LocalStorage.

Пример запроса:
GET /api/auth/check

// Варианты авторизации:
// 1. Session Key в заголовке:
Authorization: Bearer <session_key>

// 2. Session Key в куки:
Cookie: session_key=<session_key>

// 3. Обычная сессия (устаревший способ)
Пример ответа:
{
  "isAuthenticated": true,
  "user": {
    "id": number,
    "name": "string",
    "username": "string",
    "photo": "string,
    "banner": "string",
    "about": "string",
    "avatar_url": "string",
    "banner_url": "string",
    "hasCredentials": boolean,
    "account_type": "string",
    "main_account_id": number
  }
}

// Не авторизован:
{
  "isAuthenticated": false,
  "sessionExists": boolean
}

// Нужна настройка профиля:
{
  "isAuthenticated": true,
  "sessionExists": true,
  "needsProfileSetup": true,
  "user_id": number,
  "hasAuthMethod": boolean
}

// Забаненный пользователь:
{
  "isAuthenticated": false,
  "sessionExists": false,
  "error": "Аккаунт заблокирован",
  "ban_info": object
}
POST
/api/auth/logout

Требуется авторизация
Выход из системы. Удаляет сессию и куки.

Пример запроса:
POST /api/auth/logout
Пример ответа:
{
  "success": true,
  "message": "Выход выполнен успешно"
}
Альтернативные способы авторизации
POST
/api/auth/telegram

Авторизация через Telegram Bot API. Создает или находит пользователя по chat_id.

Пример запроса:
POST /api/auth/telegram
Content-Type: application/json
{
  "chat_id": "string (Telegram chat_id)",
  "username": "string (опционально, Telegram username)"
}
Пример ответа:
{
  "status": "success",
  "redirect": "/",
  "user": {
    "id": number,
    "username": "string",
    "name": "string",
    "photo": "string"
  }
}

// Для новых пользователей:
{
  "status": "success",
  "redirect": "/register/profile",
  "needs_profile_setup": true,
  "chat_id": "string"
}
POST
/api/auth/element

Авторизация через Element (Matrix) клиент. Создает пользователя автоматически.

Пример запроса:
POST /api/auth/element
Content-Type: application/json
{
  "chat_id": "string (Element chat_id)"
}
Пример ответа:
{
  "success": true,
  "user": {
    "id": number,
    "name": "string",
    "username": "string",
    "photo": "string"
  },
  "needsProfileSetup": true
}
Управление сессиями
GET
/api/auth/sessions

Требуется авторизация
Получение списка активных сессий пользователя.

Пример запроса:
GET /api/auth/sessions
Пример ответа:
{
  "sessions": [
    {
      "id": "string",
      "created_at": "string",
      "expires_at": "string",
      "ip_address": "string",
      "user_agent": "string",
      "is_current": boolean
    }
  ]
}
DELETE
/api/auth/sessions/{session_id}

Требуется авторизация
Удаление конкретной сессии пользователя.

Пример запроса:
DELETE /api/auth/sessions/{session_id}
Пример ответа:
{
  "success": true,
  "message": "Сессия удалена"
}
Восстановление пароля
POST
/api/auth/forgot-password

Запрос на восстановление пароля. Отправляет email с токеном.

Пример запроса:
POST /api/auth/forgot-password
Content-Type: application/json
{
  "email": "string"
}
Пример ответа:
{
  "success": true,
  "message": "Инструкции отправлены на email"
}
POST
/api/auth/reset-password

Сброс пароля по токену из email.

Пример запроса:
POST /api/auth/reset-password
Content-Type: application/json
{
  "token": "string (токен из email)",
  "password": "string (новый пароль, минимум 8 символов)"
}
Пример ответа:
{
  "success": true,
  "message": "Пароль успешно изменен"
}
Настройка учетных данных
POST
/api/auth/setup-credentials

Требуется авторизация
Настройка email/пароля для пользователей, зарегистрированных через Telegram/Element.

Пример запроса:
POST /api/auth/setup-credentials
Content-Type: application/json
{
  "email": "string",
  "password": "string"
}
Пример ответа:
{
  "success": true,
  "message": "Учетные данные настроены"
}
Ограничения и безопасность
Rate Limiting:
• Регистрация: максимум 3 попытки в минуту с одного IP
• Вход: максимум 3 попытки в минуту с одного IP
• Максимум 1 регистрация с одного IP в неделю

Блокировки:
• IP блокируется на 24 часа при подозрительной активности
• Пользователи блокируются на 15 минут после 5 неудачных попыток входа

Валидация:
• Username: 3-30 символов, только буквы, цифры, подчеркивание
• Email: валидный формат, проверка домена
• Password: минимум 8 символов

Session Key:
• Используйте session_key из LocalStorage для авторизации
• Отправляйте в заголовке: Authorization: Bearer <session_key>
• Или в куки: session_key=<session_key>