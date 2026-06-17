// bv-backend/src/server.js

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import FileStore from 'session-file-store'

import authRoutes from './routes/auth.routes.js'
import autosRoutes from './routes/cars.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import prisma from './lib/prisma.js'

// Cargamos variables de entorno desde .env
dotenv.config()

const app = express()
const FileStoreSession = FileStore(session)

app.set('trust proxy', 1)

// Elegimos la URL del frontend según entorno
const allowedOrigins = [
    process.env.FRONTEND_DEV,
    process.env.FRONTEND_PROD
].filter(Boolean)

// Middleware CORS — comunicación entre frontend y backend
app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin origin (Postman / apps mobile)
        if (!origin) return callback(null, true)
        if (allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error(`CORS bloqueado para ${origin}`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

// Conexión a la base de datos
const PORT = process.env.PORT || 4000

try {
    await prisma.$connect()
    console.log('✅ Prisma conectado')
} catch (e) {
    console.error('❌ Error conectando a la base de datos:', e)
    process.exit(1)
}

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
