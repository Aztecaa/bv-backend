import prisma from './src/lib/prisma.js'
async function test() {
  try {
    await prisma.$connect()
    console.log("✅ Conexión exitosa!")
    const count = await prisma.car.count()
    console.log("Autos en DB:", count)
  } catch (e) {
    console.error("❌ Error:", e.message)
  } finally {
    await prisma.$disconnect()
  }
}
test()