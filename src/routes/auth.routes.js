// bv-backend/src/routes/auth.routes.js

import { Router } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' })
    }

    const user = await prisma.user.findUnique({
      where: { username: username.trim() }
    })

    if (!user) {
      console.log('[auth] usuario no encontrado', username)
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      console.log('[auth] contraseña inválida para', username)
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // Solo admins
    if (user.role !== 'admin' && user.role !== 'isAdmin') {
      return res.status(403).json({ message: 'Solo administradores pueden acceder' })
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: 'admin'
    }

    console.log(`✅ Login ADMIN exitoso: ${user.username}`)

    res.json({
      message: `Bienvenido ${user.username}`,
      user: {
        id: user.id,
        username: user.username,
        role: 'admin'
      },
      role: 'admin'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en login' })
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Sesión cerrada' })
  })
})

router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user })
  } else {
    res.status(401).json({ message: 'No autenticado' })
  }
})

export default router