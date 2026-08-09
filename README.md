# BRICKWELL — лендинг кирпича ручной формовки

Готовый одностраничный сайт для контекстной рекламы.

## Состав

```
brickwell/
├── index.html      # разметка
├── styles.css      # премиальный тёмный дизайн + медь
├── script.js       # меню, галерея, форма → Telegram
├── logo.png        # положите ваш логотип сюда
├── images/         # фото
└── videos/         # видео
```

## 1. Добавьте медиа

Положите файлы с такими именами (или поправьте пути в `index.html`):

**images/**
- `hero.jpg` — обложка hero (если нет видео)
- `about-1.jpg`, `about-2.jpg`
- `brick-simple.jpg`, `brick-traditional.jpg`, `brick-classic.jpg`
- `brick-loft.jpg`, `brick-ancient.jpg`, `brick-maestro.jpg`
- `object-1.jpg` … `object-6.jpg`
- `showroom.jpg`, `showroom-video.jpg`, `production.jpg`

**videos/**
- `hero.mp4` (короткий loop, без звука)
- `production.mp4`
- `showroom.mp4`

**Корень**
- `logo.png` — ваш логотип (тёмный фон, как на макете)

## 2. Подключите Telegram (заявки)

1. Откройте Telegram → @BotFather → `/newbot` → получите **TOKEN**
2. Напишите своему боту любое сообщение
3. Откройте в браузере:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Найдите `"chat":{"id": 123456789}` — это **CHAT_ID**
5. В `script.js` замените:

```js
const TELEGRAM_BOT_TOKEN = "123:ABC...";
const TELEGRAM_CHAT_ID = "123456789";
```

6. В `index.html` замените телефон, email, ссылку `t.me/your_manager`, адрес шоурума.

## 3. Цены

Сейчас в каталоге стоят **примерные** цены (BYN/м²). Замените на свои в блоке `#catalog` файла `index.html`.

## 4. Запуск сайта (хостинг)

### Вариант A — Vercel (бесплатно, 2 минуты)
1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. New Project → Upload папку `brickwell`
3. Получите ссылку `xxx.vercel.app`
4. Привяжите домен при необходимости

### Вариант B — Netlify
Аналогично: drag & drop папки на [netlify.com/drop](https://app.netlify.com/drop)

### Вариант C — Beget / Timeweb (РБ/РФ)
1. Купите хостинг + домен
2. Через файловый менеджер загрузите все файлы в `public_html`
3. Сайт откроется на вашем домене

## 5. Для контекстной рекламы

1. Подключите **Яндекс.Метрику** (вставьте счётчик перед `</head>`)
2. Цель: отправка формы (`leadForm` submit)
3. UTM-метки в объявлениях Директа
4. Скорость: сожмите фото (TinyPNG / Squoosh), видео — до 5–15 МБ
5. Проверьте мобильную версию

## 6. Локальный просмотр

Откройте `index.html` в браузере  
или в терминале:

```bash
cd brickwell
python3 -m http.server 8080
```

Откройте http://localhost:8080

---

Дизайн: тёмный премиум + медные акценты под логотип BRICKWELL.
Форма шлёт заявки в Telegram.
