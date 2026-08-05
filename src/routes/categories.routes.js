// bv-backend/src/routes/categories.routes.js

import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { isAuthenticated, isAdmin } from '../middlewares/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { cars: true } // opcional, para ver cuántos autos tiene
    })
    res.json(categories)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error obteniendo categorías' })
  }
})

router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'El nombre de la categoría es requerido' })
    }

    const category = await prisma.category.create({
      data: { name: name.trim() }
    })

    res.status(201).json(category)
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'La categoría ya existe' })
    }
    console.error(error)
    res.status(500).json({ message: 'Error creando categoría' })
  }
})

router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params

    const category = await prisma.category.delete({
      where: { id: Number(id) }
    })

    res.json({ message: 'Categoría eliminada', category })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'No se puede eliminar una categoría en uso' })
    }
    console.error(error)
    res.status(500).json({ message: 'Error eliminando categoría' })
  }
})

export default router