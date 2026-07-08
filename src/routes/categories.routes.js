// bv-backend/src/routes/categories.routes.js

import { Router } from 'express'
import {
    getCategoriesData,
    createCategoryData,
    deleteCategoryData
} from '../lib/simpleStore.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const categories = await getCategoriesData()
        res.json(categories)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error obteniendo categorías' })
    }
})

router.post('/', async (req, res) => {
    try {
        const { name } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido' })
        }

        const category = await createCategoryData(name)
        res.status(201).json(category)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error creando categoría' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const category = await deleteCategoryData(id)
        res.json({ message: 'Categoría eliminada', category })
    } catch (error) {
        console.error(error)
        if (error.message === 'CATEGORY_NOT_FOUND') {
            return res.status(404).json({ message: 'Categoría no encontrada' })
        }
        if (error.message === 'CATEGORY_IN_USE') {
            return res.status(400).json({ message: 'No se puede eliminar una categoría en uso' })
        }
        res.status(500).json({ message: 'Error eliminando categoría' })
    }
})

export default router