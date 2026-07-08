// bv-backend/src/routes/users.routes.js

import { Router } from 'express'
import { getUsersData } from '../lib/simpleStore.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const users = await getUsersData()
        res.json(users)
    } catch (error) {
        console.error('Error obteniendo usuarios:', error)
        res.status(500).json({ message: 'Error obteniendo usuarios' })
    }
})

export default router
