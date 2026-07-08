// bv-backend/src/server.js

import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import FileStore from 'session-file-store'

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import authRoutes from './routes/auth.routes.js'
import autosRoutes from './routes/cars.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import usersRoutes from './routes/users.routes.js'

// Cargamos variables de entorno desde .env
dotenv.config()

const app = express()
const FileStoreSession = FileStore(session)

app.set('trust proxy', 1)

// Elegimos la URL del frontend según entorno
const allowedOrigins = [
    process.env.FRONTEND_DEV,
    process.env.FRONTEND_PROD,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
].filter(Boolean)

function isAllowedOrigin(origin) {
    if (!origin) return true

    try {
        const { hostname, protocol } = new URL(origin)
        if (['http:', 'https:'].includes(protocol) && ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname)) {
            return true
        }
    } catch {
        return false
    }

    return allowedOrigins.some((allowed) => {
        if (!allowed) return false
        return allowed.replace(/\/$/, '') === origin.replace(/\/$/, '')
    })
}

// Middleware CORS — comunicación entre frontend y backend
app.use(cors({
    origin: function (origin, callback) {
        callback(null, isAllowedOrigin(origin))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Express entiende body JSON
app.use(express.json())

// Validar que SESSION_SECRET esté definido
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
    console.error('❌ SESSION_SECRET no está definido. Abortando.')
    process.exit(1)
}

// Configuración de sesiones con FileStore
app.use(session({
    store: new FileStoreSession({ path: './sessions' }),
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}))

// Rutas
app.use('/categories', categoriesRoutes)
app.use('/upload', uploadRoutes)
app.use('/auth', authRoutes)
app.use('/autos', autosRoutes)
app.use('/users', usersRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
