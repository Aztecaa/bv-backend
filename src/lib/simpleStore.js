import fs from 'fs/promises'
import path from 'path'
import bcrypt from 'bcrypt'

const DATA_FILE = path.resolve(process.cwd(), 'src/data/store.json')

function createDefaultState() {
  const now = new Date().toISOString()

  return {
    categories: [
      { id: 1, name: 'Auto' },
      { id: 2, name: 'Pickup' },
      { id: 3, name: 'SUV' },
      { id: 4, name: 'Deportivo' }
    ],
    cars: [
      {
        id: 1,
        brand: 'Toyota',
        model: 'Corolla',
        version: 'GLi',
        year: 2022,
        price: 18000,
        offerPrice: 16500,
        kilometers: 35000,
        transmission: 'Automática',
        fuelType: 'Nafta',
        condition: 'USADO',
        description: 'Auto confiable para uso diario.',
        shortDesc: 'Ideal para ciudad y viajes.',
        location: 'Córdoba',
        uniqueOwner: true,
        transferable: true,
        acceptsTrade: false,
        saleType: 'CONTADO',
        featured: true,
        visible: true,
        sold: false,
        reserved: false,
        categoryId: 1,
        images: [{ url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', isCover: true }],
        createdAt: now
      },
      {
        id: 2,
        brand: 'Ford',
        model: 'Ranger',
        version: 'XLT',
        year: 2021,
        price: 28000,
        offerPrice: 26000,
        kilometers: 42000,
        transmission: 'Automática',
        fuelType: 'Diésel',
        condition: 'USADO',
        description: 'Pickup robusta y cómoda.',
        shortDesc: 'Perfecta para trabajo y paseo.',
        location: 'Mendoza',
        uniqueOwner: false,
        transferable: true,
        acceptsTrade: true,
        saleType: 'FINANCIADO',
        featured: true,
        visible: true,
        sold: false,
        reserved: false,
        categoryId: 2,
        images: [{ url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', isCover: true }],
        createdAt: now
      }
    ],
    users: [
      {
        id: 1,
        username: 'iñaki',
        password: bcrypt.hashSync('a1b2c3d4', 10),
        role: 'admin',
        createdAt: now
      },
      {
        id: 2,
        username: 'nacho',
        password: bcrypt.hashSync('1a2b3c4d', 10),
        role: 'admin',
        createdAt: now
      },
      {
        id: 3,
        username: 'cliente',
        password: bcrypt.hashSync('cliente', 10),
        role: 'cliente',
        createdAt: now
      }
    ]
  }
}

function mergeWithDefaults(parsed = {}) {
  const defaults = createDefaultState()
  const users = Array.isArray(parsed.users) ? parsed.users : []
  const existingUsernames = new Set(users.map((user) => String(user.username || '').toLowerCase()))
  const missingUsers = defaults.users.filter((user) => !existingUsernames.has(String(user.username || '').toLowerCase()))

  return {
    categories: Array.isArray(parsed.categories) && parsed.categories.length ? parsed.categories : defaults.categories,
    cars: Array.isArray(parsed.cars) ? parsed.cars : [],
    users: [...users, ...missingUsers]
  }
}

async function ensureStoreFile() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.access(DATA_FILE)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, JSON.stringify(createDefaultState(), null, 2))
    } else {
      throw error
    }
  }
}

async function readStore() {
  await ensureStoreFile()
  const raw = await fs.readFile(DATA_FILE, 'utf8')
  const parsed = JSON.parse(raw)
  const merged = mergeWithDefaults(parsed)

  if (JSON.stringify(merged) !== raw) {
    await writeStore(merged)
  }

  return merged
}

async function writeStore(state) {
  await ensureStoreFile()
  await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2))
}

function normalizeImages(images) {
  if (!Array.isArray(images) || !images.length) {
    return []
  }

  return images.map((image, index) => {
    if (typeof image === 'string') {
      return { url: image, isCover: index === 0 }
    }

    if (image && typeof image === 'object') {
      return {
        url: image.url || 'https://via.placeholder.com/800x500?text=Sin+imagen',
        isCover: image.isCover ?? index === 0
      }
    }

    return { url: 'https://via.placeholder.com/800x500?text=Sin+imagen', isCover: index === 0 }
  })
}

function attachCategory(car, categories) {
  const category = categories.find((item) => item.id === Number(car.categoryId)) || null
  return {
    ...car,
    category: category ? { id: category.id, name: category.name } : null
  }
}

export async function getCarsData() {
  const state = await readStore()
  return state.cars
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .map((car) => attachCategory(car, state.categories))
}

export async function createCarData(input) {
  const state = await readStore()
  const nextId = state.cars.reduce((max, car) => Math.max(max, Number(car.id) || 0), 0) + 1

  const categoryId = input.categoryId ? Number(input.categoryId) : null
  let category = null

  if (categoryId) {
    category = state.categories.find((item) => item.id === categoryId) || null
  } else {
    const categoryName = input.categoria || input.categoryName || 'General'
    category = state.categories.find((item) => item.name.toLowerCase() === categoryName.toLowerCase()) || null

    if (!category) {
      category = { id: state.categories.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1, name: categoryName }
      state.categories.push(category)
    }
  }

  const newCar = {
    id: nextId,
    brand: input.brand || '',
    model: input.model || '',
    version: input.version || null,
    year: Number(input.year) || 0,
    price: Number(input.price) || 0,
    offerPrice: input.offerPrice ? Number(input.offerPrice) : null,
    kilometers: Number(input.kilometers) || 0,
    transmission: input.transmission || 'Manual',
    fuelType: input.fuelType || 'Nafta',
    condition: input.condition === 'NUEVO' ? 'NUEVO' : 'USADO',
    description: input.description || '',
    shortDesc: input.shortDesc || null,
    location: input.location || null,
    uniqueOwner: Boolean(input.uniqueOwner),
    transferable: input.transferable ?? true,
    acceptsTrade: Boolean(input.acceptsTrade),
    saleType: input.saleType || null,
    featured: Boolean(input.featured),
    visible: input.visible ?? true,
    sold: Boolean(input.sold),
    reserved: Boolean(input.reserved),
    categoryId: category ? Number(category.id) : null,
    images: normalizeImages(input.images),
    createdAt: new Date().toISOString()
  }

  state.cars.unshift(newCar)
  await writeStore(state)
  return attachCategory(newCar, state.categories)
}

export async function updateCarData(id, input) {
  const state = await readStore()
  const index = state.cars.findIndex((car) => Number(car.id) === Number(id))

  if (index === -1) {
    throw new Error('AUTO_NOT_FOUND')
  }

  const existingCar = state.cars[index]
  const categoryId = input.categoryId ? Number(input.categoryId) : existingCar.categoryId
  let category = state.categories.find((item) => item.id === categoryId) || null

  if (!category && (input.categoria || input.categoryName)) {
    const categoryName = input.categoria || input.categoryName
    category = state.categories.find((item) => item.name.toLowerCase() === categoryName.toLowerCase()) || null

    if (!category) {
      category = { id: state.categories.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1, name: categoryName }
      state.categories.push(category)
    }
  }

  const updatedCar = {
    ...existingCar,
    ...input,
    brand: input.brand ?? existingCar.brand,
    model: input.model ?? existingCar.model,
    version: input.version ?? existingCar.version,
    year: input.year !== undefined ? Number(input.year) : existingCar.year,
    price: input.price !== undefined ? Number(input.price) : existingCar.price,
    offerPrice: input.offerPrice !== undefined ? Number(input.offerPrice) : existingCar.offerPrice,
    kilometers: input.kilometers !== undefined ? Number(input.kilometers) : existingCar.kilometers,
    transmission: input.transmission ?? existingCar.transmission,
    fuelType: input.fuelType ?? existingCar.fuelType,
    condition: input.condition ?? existingCar.condition,
    description: input.description ?? existingCar.description,
    shortDesc: input.shortDesc ?? existingCar.shortDesc,
    location: input.location ?? existingCar.location,
    uniqueOwner: input.uniqueOwner !== undefined ? Boolean(input.uniqueOwner) : existingCar.uniqueOwner,
    transferable: input.transferable !== undefined ? Boolean(input.transferable) : existingCar.transferable,
    acceptsTrade: input.acceptsTrade !== undefined ? Boolean(input.acceptsTrade) : existingCar.acceptsTrade,
    saleType: input.saleType ?? existingCar.saleType,
    featured: input.featured !== undefined ? Boolean(input.featured) : existingCar.featured,
    visible: input.visible !== undefined ? Boolean(input.visible) : existingCar.visible,
    sold: input.sold !== undefined ? Boolean(input.sold) : existingCar.sold,
    reserved: input.reserved !== undefined ? Boolean(input.reserved) : existingCar.reserved,
    categoryId: category ? Number(category.id) : existingCar.categoryId,
    images: input.images ? normalizeImages(input.images) : existingCar.images || []
  }

  state.cars[index] = updatedCar
  await writeStore(state)
  return attachCategory(updatedCar, state.categories)
}

export async function deleteCarData(id) {
  const state = await readStore()
  const index = state.cars.findIndex((car) => Number(car.id) === Number(id))

  if (index === -1) {
    throw new Error('AUTO_NOT_FOUND')
  }

  const [deletedCar] = state.cars.splice(index, 1)
  await writeStore(state)
  return attachCategory(deletedCar, state.categories)
}

export async function getCategoriesData() {
  const state = await readStore()
  return state.categories
}

export async function createCategoryData(name) {
  const state = await readStore()
  const trimmed = name.trim()
  const existing = state.categories.find((item) => item.name.toLowerCase() === trimmed.toLowerCase())

  if (existing) {
    return existing
  }

  const newCategory = {
    id: state.categories.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1,
    name: trimmed
  }

  state.categories.push(newCategory)
  await writeStore(state)
  return newCategory
}

export async function deleteCategoryData(id) {
  const state = await readStore()
  const index = state.categories.findIndex((item) => Number(item.id) === Number(id))

  if (index === -1) {
    throw new Error('CATEGORY_NOT_FOUND')
  }

  const category = state.categories[index]
  const hasCars = state.cars.some((car) => Number(car.categoryId) === Number(category.id))

  if (hasCars) {
    throw new Error('CATEGORY_IN_USE')
  }

  state.categories.splice(index, 1)
  await writeStore(state)
  return category
}

export async function getUsersData() {
  const state = await readStore()
  return state.users.map(({ password, ...user }) => user)
}

export async function findUserByUsername(username) {
  const state = await readStore()
  const normalized = String(username || '').trim().toLowerCase()
  return state.users.find((user) => String(user.username || '').trim().toLowerCase() === normalized) || null
}
