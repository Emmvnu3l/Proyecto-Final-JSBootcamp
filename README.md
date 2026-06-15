# Blog de Noticias - Full Stack JavaScript

Proyecto final del curso **Desarrollo de Aplicaciones Full Stack JavaScript Trainee** (Sustantiva).

Aplicación completa de un blog de noticias con registro/login de usuarios, creación de noticias con imagen, sistema de likes/dislikes, comentarios, filtrado por categoría y ordenamiento por fecha.

## Demo en vivo

**URL del despliegue:** [https://proyecto-final-jsbootcamp-production.up.railway.app/](https://proyecto-final-jsbootcamp-production.up.railway.app/)

---

## Tecnologías

- **Backend:** Node.js, Express, JWT, Multer
- **Base de datos:** PostgreSQL
- **Frontend:** HTML5, Bootstrap 5, JavaScript (ES modules)
- **Herramientas:** dotenv, bcryptjs, cors

---

## Requisitos previos

- Node.js instalado (v18 o superior)
- PostgreSQL y PgAdmin 4 instalados

---

## Instalación

### 1. Clonar o descargar el proyecto

```bash
cd "Proyecto Final JSBootcamp/backend"
```

### 2. Instalar dependencias del backend

```bash
npm install
```

### 3. Configurar variables de entorno

Renombra `.env.example` a `.env` y completa tus credenciales de PostgreSQL:

```env
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD
DB_NAME=blog_noticias
DB_HOST=localhost
DB_PORT=5432
PORT=3000
JWT_SECRET=mi_clave_secreta_super_segura
```

### 4. Crear la base de datos y tablas

```bash
node create-db.js
node run-sql.js
```

### 5. Iniciar el servidor

```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`.

### 6. Abrir el frontend

Abre el archivo `frontend/index.html` directamente en el navegador, o usa Live Server en VS Code.

---

## Endpoints API

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Verificar estado | No |
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/categories` | Listar categorías | No |
| GET | `/api/news` | Listar noticias | No |
| GET | `/api/news?category=1&order=asc` | Filtrar y ordenar | No |
| GET | `/api/news/:id` | Ver noticia | No |
| POST | `/api/news` | Crear noticia | Sí |
| PUT | `/api/news/:id` | Editar noticia | Sí |
| DELETE | `/api/news/:id` | Eliminar noticia | Sí |
| GET | `/api/comments/news/:news_id` | Ver comentarios | No |
| POST | `/api/comments` | Comentar | Sí |
| GET | `/api/likes/news/:news_id` | Ver likes/dislikes | No |
| POST | `/api/likes` | Dar/quitar voto | Sí |

---

## Funcionalidades

- **Registro y Login** de usuarios con JWT
- **Crear noticias** con título (máx. 60), autor (máx. 40), contenido (máx. 4000), imagen (máx. 2 MB) y categoría
- **Listado de noticias** con filtrado por categoría y ordenamiento ascendente/descendente por fecha
- **Detalle de noticia** con contenido completo, imagen, comentarios y likes/dislikes
- **Sistema de likes/dislikes** con conteo y listado de usuarios que votaron
- **Comentarios** en cada noticia
- **Navbar dinámico** que muestra usuario logueado y opciones según autenticación

---

## Estructura del proyecto

```
Proyecto Final JSBootcamp/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── commentController.js
│   │   ├── likeController.js
│   │   └── newsController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── init.sql
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── likeRoutes.js
│   │   └── newsRoutes.js
│   ├── utils/
│   │   └── validation.js
│   ├── uploads/
│   ├── app.js
│   ├── create-db.js
│   ├── run-sql.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── css/
│   │   └── custom.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── detail.js
│   │   └── home.js
│   ├── index.html
│   ├── detalle.html
│   ├── login.html
│   ├── register.html
│   └── crear-noticia.html
└── README.md
```

---

## Despliegue

### Backend (Render / Railway / Glitch)

1. Subir el código a GitHub.
2. Crear nuevo servicio web en Render o Railway.
3. Configurar variables de entorno (`DATABASE_URL` para PostgreSQL, `JWT_SECRET`, `PORT`).
4. En Render usar `npm start` como comando de inicio.
5. En Railway conectar una base de datos PostgreSQL interna.

### Frontend (GitHub Pages)

1. Subir la carpeta `frontend/` a un repositorio de GitHub.
2. Ir a **Settings** → **Pages**.
3. Seleccionar la rama `main` y carpeta `/ (root)` o `/docs`.
4. Actualizar `API_BASE` en `frontend/js/api.js` con la URL del backend desplegado.

---

## Autor

Desarrollado como proyecto de certificación del curso Full Stack JavaScript Trainee - Sustantiva.
