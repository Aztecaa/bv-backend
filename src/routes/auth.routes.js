// bv-backend/src/routes/auth.routes.js

import { Router } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router = Router()

/* --------------------------
   LOGIN
--------------------------- */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        // Validación de campos vacíos antes de consultar la BD
        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' })
        }

        const user = await prisma.user.findUnique({
            where: { username }
        })

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' })
        }

        if (!req.session) {
            return res.status(500).json({ message: 'Sesión no disponible' })
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role
        }

        res.json({
            message: `Bienvenido ${user.username}`,
            role: user.role
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error en login' })
    }
})

/* --------------------------
   LOGOUT
--------------------------- */
router.get('/logout', (req, res) => {
    if (!req.session) {
        return res.status(500).json({ message: 'Sesión no disponible' })
    }

    req.session.destroy(() => {
        res.json({ message: 'Sesión cerrada' })
    })
})

/* --------------------------
   ME — verificar sesión activa
   El frontend llama esto al recargar la app
   para saber si la sesión del servidor sigue viva
--------------------------- */
router.get('/me', isAuthenticated, (req, res) => {
    res.json({ user: req.session.user })
})

export default router