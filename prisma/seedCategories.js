import prisma from "../src/lib/prisma.js";

async function main() {

    const categories = [

        "Hatchback",
        "Sedán",
        "SUV",
        "Pickup",
        "Deportivo",
        "Utilitario"

    ];

    for (const name of categories) {

        await prisma.category.upsert({

            where: { name },

            update: {},

            create: { name }

        });
    }

    console.log("✅ Categorías creadas");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });