// bv-backend/src/routes/auth.routes.js

import { Router } from 'express'
import bcrypt from 'bcrypt'
import { isAuthenticated } from '../middlewares/auth.js'
import { findUserByUsername } from '../lib/simpleStore.js'

const router = Router()

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' })
        }

        const user = await findUserByUsername(username)

        if (!user) {
            console.log('[auth] usuario no encontrado', username)
            return res.status(401).json({ message: 'Credenciales inválidas' })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            console.log('[auth] contraseña inválida para', username)
            return res.status(401).json({ message: 'Credenciales inválidas' })
        }

        if (!req.session) {
            return res.status(500).json({ message: 'Sesión no disponible' })
        }

        const normalizedRole = user.role === 'admin' || user.role === 'isAdmin' ? 'admin' : 'cliente'

        req.session.user = {
            id: user.id,
            username: user.username,
            role: normalizedRole
        }

        res.json({
            message: `Bienvenido ${user.username}`,
            user: {
                id: user.id,
                username: user.username,
                role: normalizedRole
            },
            role: normalizedRole
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error en login' })
    }
})

router.get('/logout', (req, res) => {
    if (!req.session) {
        return res.status(500).json({ message: 'Sesión no disponible' })
    }

    req.session.destroy(() => {
        res.json({ message: 'Sesión cerrada' })
    })
})

router.get('/me', isAuthenticated, (req, res) => {
    res.json({ user: req.session.user })
})

export default router