import prisma from "../src/lib/prisma.js";

async function main() {

    const cars = await prisma.car.findMany({
        orderBy: {
            id: "asc"
        }
    });

    const seen = new Map();

    for (const car of cars) {

        const key =
            `${car.brand}-${car.model}-${car.year}`;

        if (seen.has(key)) {

            console.log(
                `🗑 Eliminando duplicado ID ${car.id}`
            );

            await prisma.carImage.deleteMany({
                where: {
                    carId: car.id
                }
            });

            await prisma.car.delete({
                where: {
                    id: car.id
                }
            });

        } else {

            seen.set(key, true);
        }
    }

    console.log("✅ Limpieza terminada");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });