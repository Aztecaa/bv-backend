// bv-backend/src/routes/categories.routes.js

import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { isAdmin } from '../middlewares/auth.js'

const router = Router()

/* --------------------------
   GET — listar todas las categorías
   Público — el formulario de autos lo necesita
--------------------------- */
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany()
        res.json(categories)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error obteniendo categorías' })
    }
})

/* --------------------------
   POST — crear categoría
   Protegido — solo supervisores
--------------------------- */
router.post('/', isAdmin, async (req, res) => {
    try {
        const { name } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido' })
        }

        const existing = await prisma.category.findUnique({
            where: { name: name.trim() }
        })

        if (existing) {
            return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' })
        }

        const category = await prisma.category.create({
            data: { name: name.trim() }
        })

        res.status(201).json(category)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error creando categoría' })
    }
})

/* --------------------------
   DELETE — eliminar categoría
   Protegido — solo supervisores
--------------------------- */
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params

        const existing = await prisma.category.findUnique({
            where: { id: Number(id) },
            include: { cars: true }
        })

        if (!existing) {
            return res.status(404).json({ message: 'Categoría no encontrada' })
        }

        // No se puede eliminar si tiene autos asociados
        if (existing.cars.length > 0) {
            return res.status(400).json({
                message: `No se puede eliminar: la categoría tiene ${existing.cars.length} auto/s asociado/s`
            })
        }

        await prisma.category.delete({ where: { id: Number(id) } })

        res.json({ message: 'Categoría eliminada' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error eliminando categoría' })
    }
})

export default router