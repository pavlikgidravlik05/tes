# NestJS Tasks — все три задания в одном проекте

В проекте одновременно реализованы:

1. CRUD задач через TypeORM.
2. Связь User–Task один-ко-многим через TypeORM.
3. Аналогичная работа с пользователями и задачами через Prisma ORM.

Обе ORM работают в одном NestJS-приложении, но используют **разные базы данных**:

| Реализация | База |
|---|---|
| TypeORM (задания 1 и 2) | `nest_tasks` |
| Prisma (задание 3) | `nest_tasks_prisma` |

## Требования

- Node.js 20.19+ (рекомендуется Node.js 22 или 24)
- npm
- PostgreSQL 14+
- Созданные базы данных `nest_tasks` и `nest_tasks_prisma`

Создать базы можно в pgAdmin или SQL-командой:

```sql
CREATE DATABASE nest_tasks;
CREATE DATABASE nest_tasks_prisma;
```

## Установка

1. Распакуйте архив.
2. Откройте CMD в папке проекта.
3. Установите зависимости:

```cmd
npm install
```

Установятся также Passport, bcrypt и JWT-зависимости для ЛР №17.

4. Скопируйте `.env.example` в `.env`:

```cmd
copy .env.example .env
```

5. Откройте `.env` и замените `YOUR_POSTGRES_PASSWORD` на пароль PostgreSQL.
   Если пароль содержит специальные символы (`@`, `#`, `%`, `/` и т. п.),
   в DATABASE_URL их нужно URL-кодировать.

6. Создайте Prisma-таблицы и сгенерируйте клиент:

```cmd
npx prisma db push
npx prisma generate
```

7. Запустите приложение:

```cmd
npm run start:dev
```

Укажите собственный длинный случайный `JWT_SECRET` в `.env`.

TypeORM автоматически создаст/синхронизирует таблицы в `nest_tasks`
(`synchronize: true`, режим учебной разработки). Prisma синхронизирует схему с базой `nest_tasks_prisma` командой `db push`.

## API TypeORM — задания 1 и 2

Базовый адрес: `http://localhost:3000`

| Метод | URL | Назначение |
|---|---|---|
| POST | `/users` | Создать пользователя |
| GET | `/users` | Получить всех пользователей |
| GET | `/users/:id` | Получить пользователя с задачами |
| POST | `/tasks/user/:userId` | Создать задачу пользователя |
| GET | `/tasks` | Получить все задачи |
| GET | `/tasks/:id` | Получить задачу |
| GET | `/tasks/user/:userId` | Получить задачи пользователя |
| PUT | `/tasks/:id` | Изменить задачу |
| DELETE | `/tasks/:id` | Удалить задачу |

## API Prisma — задание 3

| Метод | URL | Назначение |
|---|---|---|
| POST | `/prisma/users` | Создать пользователя |
| GET | `/prisma/users` | Получить всех пользователей |
| GET | `/prisma/users/:id` | Получить пользователя с задачами |
| POST | `/prisma/tasks/user/:userId` | Создать задачу пользователя |
| GET | `/prisma/tasks` | Получить все задачи |
| GET | `/prisma/tasks/:id` | Получить задачу |
| GET | `/prisma/tasks/user/:userId` | Получить задачи пользователя |
| PUT | `/prisma/tasks/:id` | Изменить задачу |
| DELETE | `/prisma/tasks/:id` | Удалить задачу |

## Примеры проверки через CMD

### TypeORM

Создать пользователя:

```cmd
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"username\":\"student\",\"email\":\"student@example.com\"}"
```

Создать задачу. Подставьте `id` пользователя из ответа:

```cmd
curl -X POST http://localhost:3000/tasks/user/1 -H "Content-Type: application/json" -d "{\"title\":\"Задача TypeORM\",\"description\":\"Проверка первой и второй лабораторных\"}"
```

Получить пользователя вместе с задачами:

```cmd
curl http://localhost:3000/users/1
```

### Prisma

Создать пользователя:

```cmd
curl -X POST http://localhost:3000/prisma/users -H "Content-Type: application/json" -d "{\"username\":\"prisma_student\",\"email\":\"prisma@example.com\"}"
```

Создать задачу. Подставьте `id` пользователя из ответа:

```cmd
curl -X POST http://localhost:3000/prisma/tasks/user/1 -H "Content-Type: application/json" -d "{\"title\":\"Задача Prisma\",\"description\":\"Проверка третьей лабораторной\"}"
```

Получить пользователя вместе с задачами:

```cmd
curl http://localhost:3000/prisma/users/1
```

**Важно:** ID в двух базах независимы. Для каждого POST используйте ID, полученный именно из соответствующей реализации.

## Prisma Studio

Для просмотра Prisma-базы в графическом интерфейсе:

```cmd
npx prisma studio
```

## Важные замечания

- Не удаляйте TypeORM-файлы в `src/tasks` и `src/users`: они нужны для заданий 1 и 2.
- Prisma-реализация находится отдельно в `src/prisma`.
- Не используйте одну и ту же базу для обеих ORM.
- `synchronize: true` подходит для учебной разработки, но не рекомендуется для production.
- Для TypeORM связь обязательная: задачу можно создать только для существующего пользователя.


## Лабораторная работа №17 — Passport, JWT и роли

Коллекция запросов Postman находится в `postman/LR16-LR17.postman_collection.json`. Импортируйте её через Postman → Import; базовый адрес и токен заданы переменными коллекции. После запроса входа JWT автоматически сохраняется в переменную `token`.

Аутентификация и роли реализованы на TypeORM в базе `nest_tasks`. Предыдущие TypeORM- и Prisma-маршруты сохранены.

### Маршруты аутентификации

| Метод | URL | Назначение |
|---|---|---|
| POST | `/auth/register` | Регистрация с хешированием пароля bcrypt |
| POST | `/auth/login` | Вход через Passport Local Strategy, выдача JWT |
| GET | `/auth/profile` | Профиль текущего пользователя (JWT) |
| GET | `/auth/admin` | Проверка доступа только для administrator (JWT + RolesGuard) |
| GET | `/tasks` | Получение задач (требуется JWT) |

Регистрация принимает `username`, `email`, `password`. Минимальная длина пароля — 8 символов. Новому пользователю автоматически назначается роль `user`. Роли `user` и `administrator` создаются при старте приложения. Пароль хранится только в виде bcrypt-хеша.

### Проверка через Postman

1. Регистрация: `POST http://localhost:3000/auth/register`, Body → raw → JSON:

```json
{
  "username": "student",
  "email": "student@example.com",
  "password": "Student123!"
}
```

2. Вход: `POST http://localhost:3000/auth/login`, Body → raw → JSON:

```json
{
  "email": "student@example.com",
  "password": "Student123!"
}
```

Скопируйте `access_token` из ответа.

3. Проверка защищённого списка задач: `GET http://localhost:3000/tasks`. В Postman откройте Authorization → Bearer Token и вставьте токен. Без токена ожидается `401 Unauthorized`.

4. Проверка профиля: `GET http://localhost:3000/auth/profile` с тем же Bearer Token.

5. Проверка роли: `GET http://localhost:3000/auth/admin`. Обычный пользователь получит `403 Forbidden`. Для назначения administrator выполните в pgAdmin Query Tool (замените email на зарегистрированный):

```sql
INSERT INTO roles (name) VALUES ('administrator')
ON CONFLICT (name) DO NOTHING;

INSERT INTO user_roles ("userId", "roleId")
SELECT u.id, r.id
FROM users u CROSS JOIN roles r
WHERE u.email = 'student@example.com'
  AND r.name = 'administrator'
ON CONFLICT DO NOTHING;
```

После этого повторите `GET /auth/admin` с токеном. RolesGuard проверяет роли пользователя, загруженные из БД при каждом запросе.

### Важные замечания

- Для регистрации и входа используйте `/auth/register` и `/auth/login`. Старый `POST /users` оставлен для предыдущей лабораторной работы и не создаёт пароль.
- Защищён только `GET /tasks` из прежних маршрутов; остальные маршруты ЛР №16 сохранены для совместимости.
- Таблица `user_roles` реализует ManyToMany между `users` и `roles`.
- Если таблицы уже существуют, `synchronize: true` добавит новые столбцы/таблицы при запуске. Перед изменением существующей учебной БД сделайте резервную копию.

---

# Лабораторная работа №18 — Docker

В проект добавлены два Dockerfile и Docker Compose. Проект содержит TypeORM, Prisma, Passport Local, JWT и роли из предыдущей лабораторной работы.

## 1. Подготовка

1. Установите Docker Desktop и убедитесь, что Docker Engine запущен.
2. В корне проекта находится учебный файл `.env`. Для собственной конфигурации можно скопировать `.env.example` в `.env`.
3. В учебной конфигурации используются логин/пароль PostgreSQL `postgres`/`postgres`. Для реального использования замените пароль и `JWT_SECRET`.
4. Для запуска через Compose используется имя хоста БД `db`. Не заменяйте его на `localhost`: приложение работает внутри отдельного контейнера.

## 2. Задание 1 — базовый Dockerfile

Файл: `Dockerfile.basic`.

Сборка образа:

```bash
docker build -f Dockerfile.basic -t nest-app:basic .
```

Для проверки приложения отдельно запустите PostgreSQL и подключите оба контейнера к одной сети. Команды приведены для CMD, PowerShell и Bash (каждая команда — отдельная строка):

```bash
docker network create nest-basic-net
docker run -d --name nest-postgres-basic --network nest-basic-net -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nest_tasks -p 5433:5432 postgres:16-bookworm
docker exec nest-postgres-basic psql -U postgres -c "CREATE DATABASE nest_tasks_prisma;"
```

Дождитесь готовности PostgreSQL, затем запустите приложение:

```bash
docker run -d --name nest-app-basic --network nest-basic-net -p 3000:3000 -e NODE_ENV=production -e PORT=3000 -e POSTGRES_HOST=nest-postgres-basic -e POSTGRES_PORT=5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e TYPEORM_DATABASE=nest_tasks -e DATABASE_URL=postgresql://postgres:postgres@nest-postgres-basic:5432/nest_tasks_prisma?schema=public -e JWT_SECRET=development_only_change_this_secret_2026 -e JWT_EXPIRES_IN=1h nest-app:basic
```

Создайте таблицы Prisma:

```bash
docker exec nest-app-basic npx prisma db push
```

Проверка:

```bash
docker ps
docker logs nest-app-basic
```

В Postman проверьте, например, `GET http://localhost:3000/users` или `POST http://localhost:3000/auth/register`.

## 3. Задание 2 — многоступенчатая сборка

Файл: `Dockerfile`. Этап `build` устанавливает все зависимости, генерирует Prisma Client и собирает NestJS. Этап `production-deps` устанавливает только production-зависимости. Финальный этап переносит `dist`, production `node_modules` и сгенерированный Prisma Client.

Сборка:

```bash
docker build -t nest-app:optimized .
```

Запуск оптимизированной версии на порту 3001 (используется PostgreSQL-контейнер из предыдущего задания):

```bash
docker run -d --name nest-app-optimized --network nest-basic-net -p 3001:3000 -e NODE_ENV=production -e PORT=3000 -e POSTGRES_HOST=nest-postgres-basic -e POSTGRES_PORT=5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e TYPEORM_DATABASE=nest_tasks -e DATABASE_URL=postgresql://postgres:postgres@nest-postgres-basic:5432/nest_tasks_prisma?schema=public -e JWT_SECRET=development_only_change_this_secret_2026 -e JWT_EXPIRES_IN=1h nest-app:optimized
```

Сравните размеры образов:

```bash
docker images nest-app
```

Для отчёта сохраните вывод команды и сравните столбец `SIZE` у `nest-app:basic` и `nest-app:optimized`. Фактическая разница зависит от набора зависимостей и платформы сборки.

Проверка оптимизированной версии: `http://localhost:3001/users`.

## 4. Задание 3 — Docker Compose

`docker-compose.yml` поднимает следующие сервисы:

- `db` — PostgreSQL 16. База `nest_tasks` создаётся при инициализации контейнера.
- `prisma-init` — одноразовый контейнер на build-этапе. Он ждёт готовности PostgreSQL и выполняет `prisma db push` для базы `nest_tasks_prisma`.
- `app` — production-образ NestJS. Запускается после успешной инициализации базы Prisma; TypeORM создаёт свои таблицы благодаря `synchronize: true`.

Дополнительная база Prisma создаётся SQL-файлом `docker/postgres/init/01-init.sql`.

Запуск:

```bash
docker compose up --build -d
```

Проверка состояния:

```bash
docker compose ps
docker compose logs app
docker compose logs prisma-init
```

Проверка баз данных:

```bash
docker compose exec db psql -U postgres -d nest_tasks -c "\\dt"
docker compose exec db psql -U postgres -d nest_tasks_prisma -c "\\dt"
```

Проверка API: `GET http://localhost:3000/users`, затем регистрацию и вход через `/auth/register` и `/auth/login`. Для защищённых маршрутов используйте JWT из ответа `/auth/login` как Bearer Token.

Остановка контейнеров без удаления данных:

```bash
docker compose down
```

Полный сброс, включая том PostgreSQL (удалит данные обеих баз):

```bash
docker compose down -v
```

Важно: SQL-скрипты из `docker-entrypoint-initdb.d` выполняются PostgreSQL только при первой инициализации пустого тома. Если том уже существует и база `nest_tasks_prisma` не создана, выполните полный сброс `docker compose down -v`, затем повторите `docker compose up --build -d`.

## 5. Очистка контейнеров задания 1 и 2

Если проверка заданий 1 и 2 завершена, контейнеры можно удалить:

```bash
docker rm -f nest-app-basic nest-app-optimized nest-postgres-basic
docker network rm nest-basic-net
```

## 6. Файлы ЛР №18

- `Dockerfile.basic` — базовая сборка.
- `Dockerfile` — многоступенчатая сборка.
- `.dockerignore` — исключение локальных файлов из контекста сборки.
- `docker-compose.yml` — запуск приложения и PostgreSQL.
- `docker/postgres/init/01-init.sql` — создание отдельной базы Prisma.
- `.env` и `.env.example` — пример переменных окружения.


# ЛР №19 — CI/CD и деплой

## Что добавлено

- `Procfile` — production-команда запуска `node dist/main.js`.
- `src/tasks/tasks.service.spec.ts` — unit-тесты сервиса задач.
- `vitest` и команды `npm run test` / `npm run test:watch`.
- `.github/workflows/deploy.yml` — GitHub Actions: установка зависимостей, генерация Prisma Client, тестирование, сборка NestJS, сборка и публикация Docker-образа в Docker Hub, опциональный деплой на Heroku.
- `TYPEORM_DATABASE_URL` — отдельная строка подключения TypeORM. В Docker Compose она указывает на `nest_tasks`; Prisma продолжает использовать `DATABASE_URL` и `nest_tasks_prisma`. На Heroku можно указать обе переменные на одну подключённую PostgreSQL-базу.

## Локальная проверка

```bash
npm install
npx prisma generate
npm run test
npm run build
```

## Настройка GitHub Actions

1. Создайте репозиторий на Docker Hub с именем `nest-tasks`.
2. В GitHub откройте `Settings -> Secrets and variables -> Actions`.
3. Добавьте secrets:
   - `DOCKERHUB_USERNAME` — имя пользователя Docker Hub;
   - `DOCKERHUB_TOKEN` — Docker Hub Access Token;
   - `HEROKU_API_KEY` — API key Heroku;
   - `HEROKU_APP_NAME` — имя приложения Heroku.
4. Для автоматического деплоя на Heroku добавьте Repository variable `ENABLE_HEROKU_DEPLOY` со значением `true`.
5. В Heroku настройте Config Vars:
   - `DATABASE_URL` — PostgreSQL URL, предоставленный Heroku Postgres;
   - `TYPEORM_DATABASE_URL` — тот же PostgreSQL URL для TypeORM;
   - `JWT_SECRET` — длинный случайный секрет;
   - `JWT_EXPIRES_IN` — например, `1h`.

Если `ENABLE_HEROKU_DEPLOY` не установлена в `true`, job деплоя будет пропущен, но тестирование, сборка и публикация Docker-образа всё равно выполнятся.

Workflow запускается при `push` в ветку `main` и вручную через `workflow_dispatch`. Если тесты завершаются с ошибкой, GitHub Actions останавливает job до сборки и публикации Docker-образа.

**Важно:** для Docker Hub secrets должны быть настроены до push в `main`. Для Heroku также нужен созданный Heroku app и доступный PostgreSQL addon. Procfile добавлен для выполнения требования задания; при container deployment Heroku запускает команду из Docker image.
