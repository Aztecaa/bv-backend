//server backend
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import session from 'express-session'
import FileStore from "session-file-store";
import { isAuthenticated, isSupervisor } from "./middlewares/auth.js"
import autosRoutes from "./routes/cars.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";

// # Cargamos variables de entorno desde .env
dotenv.config()

// # Middleware para parsear JSON en requests
const app = express()

const FileStoreSession = FileStore(session);

app.set("trust proxy", 1);

// # Elegimos la URL del frontend según entorno
const allowedOrigins = [
    process.env.FRONTEND_DEV,
    process.env.FRONTEND_PROD,
    'http://localhost:5173'
];

// # Middleware para permitir CORS (comunicación entre frontend y backend)
app.use(cors({
    origin: function (origin, callback) {
        
        // permitir requests sin origin (Postman/mobile)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        return callback(new Error(`CORS bloqueado para ${origin}`));
    },
    
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// # Esto permite que Express entienda body en formato JSON sin necesidad de usar body-parser
app.use(express.json())


// # Configuración de sesiones
// * Esto crea un objeto req.session que podemos usar en cualquier ruta
app.use(session({
    store: new FileStoreSession({ path: "./sessions" }),
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production'
            ? 'none'
            : 'lax'
    }
}));

// # Usar rutas de auth
app.use("/categories", categoriesRoutes);
app.use("/upload", uploadRoutes);
app.use('/auth', authRoutes)
app.use("/autos", autosRoutes);

// # Leemos los usuarios del .env USERS=[JSON]
let users = []
try {
    users = JSON.parse(process.env.USERS || "[]")
} catch (error) {
    console.error("Error al parsear USERS en .env:", error)
}

// # Endpoint GET /users → devuelve todos los usuarios cargados / TEST
app.get('/users', (req, res) => {
    res.json(users)
})

// Ruta protegida
app.get("/protect-route", isAuthenticated, (req, res) => {
    res.json({ message: "Bienvenido la ruta para usuarios logueados", user: req.session.user })
})

// Ruta protegida para admin
app.get("/admin", isSupervisor, (req, res) => {
    res.json({ message: "Sección solo para supervisores" })
})

// # Definimos el puerto de la app (por defecto 4000 o el de Render)
const PORT = process.env.PORT || 4000

// # Iniciamos el servidor en el puerto definido
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`))
