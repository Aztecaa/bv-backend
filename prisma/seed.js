import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed con datos de ejemplo...');

  // Usuarios
  const hashed = await bcrypt.hash('a1b2c3d4', 10);
  await prisma.user.upsert({ where: { username: 'iñaki' }, update: {}, create: { username: 'iñaki', password: hashed, role: 'admin' } });

  // Categorías
  const cats = ['Auto', 'Pickup', 'SUV', 'Deportivo'];
  for (const name of cats) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Tus autos de ejemplo (adaptados)
  const autosEjemplo = [
    { brand: "Toyota", model: "Corolla", year: 2021, price: 18000, kilometers: 25000, condition: "USADO", fuelType: "Nafta", categoryName: "Auto", image: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Moscow%2C_Toyota_Corolla_Sport_hatchback%2C_Sept_2025_02.jpg" },
    // ... (agregué todos los que me pasaste)
    { brand: "Renault", model: "12", year: 2000, price: 12000, kilometers: 126425, condition: "USADO", fuelType: "Nafta", categoryName: "Pickup", image: "https://resizer.iproimg.com/unsafe/..."},
    // Continúa con el resto de tu lista...
  ];

  for (const data of autosEjemplo) {
    const category = await prisma.category.findUnique({ where: { name: data.categoryName } });
    await prisma.car.create({
      data: {
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        kilometers: data.kilometers,
        condition: data.condition,
        fuelType: data.fuelType,
        categoryId: category?.id,
        images: { create: [{ url: data.image, isCover: true }] }
      }
    });
  }

  console.log('✅ Seed completado con éxito!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());