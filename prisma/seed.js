import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed con datos de ejemplo...')

  // Usuario admin
  const hashed = await bcrypt.hash('a1b2c3d4', 10)
  await prisma.user.upsert({
    where: { username: 'iñaki' },
    update: {},
    create: { username: 'iñaki', password: hashed, role: 'admin' }
  })

  // Categorías (deben coincidir con las que usa el panel admin)
  const cats = ['Hatchback', 'Sedán', 'SUV', 'Pickup', 'Deportivo', 'Utilitario']
  for (const name of cats) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } })
  }

  // 10 autos de ejemplo con TODOS los campos completos.
  // Sin imágenes a propósito: cada uno tiene "modelKey" para que sepas
  // exactamente qué modelo/año/versión fotografiar y subir desde el panel.
  const autosEjemplo = [
    {
      modelKey: 'Toyota Corolla XEI 2.0 CVT 2021 (sedán, color blanco)',
      brand: 'Toyota', model: 'Corolla', version: 'XEI 2.0 CVT', year: 2021,
      price: 19500, offerPrice: null, kilometers: 42000,
      transmission: 'Automática', fuelType: 'Nafta', condition: 'USADO',
      shortDesc: 'Único dueño, service oficial al día',
      description: 'Toyota Corolla XEI 2.0 CVT en excelente estado general, siempre en garage. Cuenta con todos los services realizados en concesionario oficial, cubiertas en buen estado y aire acondicionado funcionando perfectamente. Ideal para uso familiar o laboral.',
      location: 'Córdoba Capital', uniqueOwner: true, transferable: true, acceptsTrade: true,
      saleType: 'AMBOS', featured: true, categoryName: 'Sedán'
    },
    {
      modelKey: 'Fiat Cronos Drive 1.3 GSE 2023 (sedán, color gris)',
      brand: 'Fiat', model: 'Cronos', version: 'Drive 1.3 GSE', year: 2023,
      price: 15800, offerPrice: 14900, kilometers: 18500,
      transmission: 'Manual', fuelType: 'Nafta', condition: 'USADO',
      shortDesc: 'Prácticamente 0km, garantía de fábrica vigente',
      description: 'Fiat Cronos Drive con motor 1.3 GSE, muy económico y con garantía de fábrica vigente. Pocos kilómetros, service oficial y libre de deuda. Excelente opción para quien busca un auto reciente sin pagar precio de 0km.',
      location: 'Villa Carlos Paz', uniqueOwner: true, transferable: true, acceptsTrade: false,
      saleType: 'FINANCIADO', featured: false, categoryName: 'Sedán'
    },
    {
      modelKey: 'Volkswagen Gol Trend Trendline 1.6 2019 (hatchback, color rojo)',
      brand: 'Volkswagen', model: 'Gol Trend', version: 'Trendline 1.6', year: 2019,
      price: 10900, offerPrice: null, kilometers: 68000,
      transmission: 'Manual', fuelType: 'Nafta', condition: 'USADO',
      shortDesc: 'Ideal primer auto, bajo consumo',
      description: 'Volkswagen Gol Trend Trendline con motor 1.6, mecánica muy noble y bajo costo de mantenimiento. Cubiertas nuevas, aire acondicionado y dirección asistida. Perfecto como primer auto o para uso diario en la ciudad.',
      location: 'Córdoba Capital', uniqueOwner: false, transferable: true, acceptsTrade: true,
      saleType: 'AMBOS', featured: false, categoryName: 'Hatchback'
    },
    {
      modelKey: 'Chevrolet Onix Joy Plus 1.2 2022 (hatchback, color negro)',
      brand: 'Chevrolet', model: 'Onix', version: 'Joy Plus 1.2', year: 2022,
      price: 13200, offerPrice: null, kilometers: 31000,
      transmission: 'Manual', fuelType: 'Nafta', condition: 'USADO',
      shortDesc: 'Bajo kilometraje, único dueño',
      description: 'Chevrolet Onix Joy Plus con muy bajo kilometraje para su año, siempre andado en asfalto y con mantenimiento al día. Excelente estado de chapa y pintura, interior impecable.',
      location: 'Río Cuarto', uniqueOwner: true, transferable: true, acceptsTrade: false,
      saleType: 'CONTADO', featured: true, categoryName: 'Hatchback'
    },
    {
      modelKey: 'Ford Ranger XLT 3.2 4x2 2020 (pickup, color plata)',
      brand: 'Ford', model: 'Ranger', version: 'XLT 3.2 4x2 AT', year: 2020,
      price: 29500, offerPrice: 27900, kilometers: 75000,
      transmission: 'Automática', fuelType: 'Diésel', condition: 'USADO',
      shortDesc: 'Full equipo, service oficial Ford',
      description: 'Ford Ranger XLT 3.2 automática, full equipo con central multimedia, control de estabilidad y llantas de aleación. Motor diésel de gran torque, ideal para trabajo o uso mixto. Documentación al día.',
      location: 'Córdoba Capital', uniqueOwner: false, transferable: true, acceptsTrade: true,
      saleType: 'AMBOS', featured: true, categoryName: 'Pickup'
    },
    {
      modelKey: 'Toyota Hilux SRV 2.8 4x4 2019 (pickup, color blanco)',
      brand: 'Toyota', model: 'Hilux', version: 'SRV 2.8 4x4 AT', year: 2019,
      price: 34900, offerPrice: null, kilometers: 89000,
      transmission: 'Automática', fuelType: 'Diésel', condition: 'USADO',
      shortDesc: 'Legendaria confiabilidad, lista para transferir',
      description: 'Toyota Hilux SRV 4x4, la pickup más elegida del mercado. Motor 2.8 turbo diésel, caja automática y tracción 4x4 en excelente funcionamiento. Cubiertas todo terreno casi nuevas.',
      location: 'Villa María', uniqueOwner: true, transferable: true, acceptsTrade: true,
      saleType: 'AMBOS', featured: false, categoryName: 'Pickup'
    },
    {
      modelKey: 'Honda HR-V EX 1.8 CVT 2021 (SUV, color azul)',
      brand: 'Honda', model: 'HR-V', version: 'EX 1.8 CVT', year: 2021,
      price: 22800, offerPrice: null, kilometers: 39000,
      transmission: 'Automática', fuelType: 'Nafta', condition: 'USADO',
      shortDesc: 'SUV compacta, techo solar y cuero',
      description: 'Honda HR-V EX con techo solar, tapizado de cuero y central multimedia con cámara de retroceso. Muy buen estado mecánico y estético, ideal para quien busca una SUV compacta y confiable.',
      location: 'Córdoba Capital', uniqueOwner: true, transferable: true, acceptsTrade: false,
      saleType: 'FINANCIADO', featured: true, categoryName: 'SUV'
    },
    {
      modelKey: 'Renault Sandero Stepway Intens 1.6 2020 (SUV/crossover, color naranja)',
      brand: 'Renault', model: 'Sandero Stepway', version: 'Intens 1.6 CVT', year: 2020,
      price: 14600, offerPrice: 13900, kilometers: 52000,
      transmission: 'Automática', fuelType: 'Nafta', condition: 'USADO',
      shortDesc: 'Mayor altura al piso, look aventurero',
      description: 'Renault Sandero Stepway Intens, con mayor altura al piso y detalles exclusivos de la versión tope de gama. Caja CVT suave, techo solar y llantas de aleación. Muy cuidado.',
      location: 'Alta Gracia', uniqueOwner: false, transferable: true, acceptsTrade: true,
      saleType: 'AMBOS', featured: false, categoryName: 'SUV'
    },
    {
      modelKey: 'Ford Mustang EcoBoost 2.3 2018 (deportivo, color amarillo)',
      brand: 'Ford', model: 'Mustang', version: 'EcoBoost 2.3 AT', year: 2018,
      price: 42000, offerPrice: null, kilometers: 34000,
      transmission: 'Automática', fuelType: 'Nafta', condition: 'USADO',
      shortDesc: 'Icónico deportivo americano, muy pocos km',
      description: 'Ford Mustang EcoBoost, motor 4 cilindros turbo con excelente respuesta y sonido de escape deportivo. Pocos kilómetros, siempre en garage y mantenimiento riguroso. Una oportunidad para tener un ícono a un precio accesible.',
      location: 'Córdoba Capital', uniqueOwner: true, transferable: true, acceptsTrade: false,
      saleType: 'CONTADO', featured: true, categoryName: 'Deportivo'
    },
    {
      modelKey: 'Renault Kangoo Express 1.6 2020 (utilitario, color blanco)',
      brand: 'Renault', model: 'Kangoo', version: 'Express 1.6', year: 2020,
      price: 13900, offerPrice: null, kilometers: 61000,
      transmission: 'Manual', fuelType: 'Nafta', condition: 'USADO',
      shortDesc: 'Ideal para trabajo, gran capacidad de carga',
      description: 'Renault Kangoo Express, furgón utilitario con gran capacidad de carga y bajo consumo. Perfecta para emprendimientos o reparto. Service al día y neumáticos en buen estado.',
      location: 'San Francisco', uniqueOwner: false, transferable: true, acceptsTrade: true,
      saleType: 'AMBOS', featured: false, categoryName: 'Utilitario'
    }
  ]

  const slugify = (text) =>
    text
      .toString()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  for (const data of autosEjemplo) {
    const category = await prisma.category.findUnique({ where: { name: data.categoryName } })
    const slug = slugify(`${data.brand}-${data.model}-${data.version}-${data.year}`)

    const payload = {
      brand: data.brand,
      model: data.model,
      version: data.version,
      year: data.year,
      price: data.price,
      offerPrice: data.offerPrice,
      kilometers: data.kilometers,
      transmission: data.transmission,
      fuelType: data.fuelType,
      condition: data.condition,
      description: data.description,
      shortDesc: data.shortDesc,
      location: data.location,
      uniqueOwner: data.uniqueOwner,
      transferable: data.transferable,
      acceptsTrade: data.acceptsTrade,
      saleType: data.saleType,
      featured: data.featured,
      visible: true,
      sold: false,
      reserved: false,
      slug,
      categoryId: category?.id
      // Sin "images": subilas vos desde el panel admin para cada modelo.
    }

    try {
      await prisma.car.upsert({
        where: { slug },
        update: payload,
        create: payload
      })
      console.log(`  ✅ ${data.modelKey}`)
    } catch (err) {
      console.error(`  ❌ Falló "${data.modelKey}":`, err.message)
      // Sigue con el resto en vez de cortar todo el seed.
    }
  }

  console.log('✅ Seed completado con éxito! Los 10 autos quedaron SIN fotos: subilas desde el panel admin.')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())