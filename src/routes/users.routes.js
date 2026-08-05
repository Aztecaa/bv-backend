// bv-backend/src/routes/users.routes.js

import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { isAuthenticated, isAdmin } from '../middlewares/auth.js'

const router = Router()

router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true
            }
        })
        res.json(users)
    } catch (error) {
        console.error('Error obteniendo usuarios:', error)
        res.status(500).json({ message: 'Error obteniendo usuarios' })
    }
})

export default router