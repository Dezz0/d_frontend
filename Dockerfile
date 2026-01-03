# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости для Expo
RUN apk add --no-cache python3 make g++

# Копируем package.json и package-lock.json
COPY package*.json ./
COPY app.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Создаем необходимые директории
RUN mkdir -p assets .expo

# Устанавливаем правильные права
RUN chown -R node:node /app
USER node

# Открываем порты для Expo
EXPOSE 19000 19001 19002

# Запускаем приложение с LAN хостом (используем только --lan)
CMD ["npx", "expo", "start", "--port", "19000", "--lan"]
