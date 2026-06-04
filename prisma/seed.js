import pkg from "@prisma/client";

import fs from "fs";
import path from "path";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const stockPath = path.join(process.cwd(), "src/data/stock.json");

async function main() {

    const rawData = fs.readFileSync(stockPath, "utf-8");
    const autos = JSON.parse(rawData);

    console.log(`Encontrados ${autos.length} autos`);

    for (const auto of autos) {

        // -----------------------------
        // CATEGORY
        // -----------------------------
        let categoryName = "General";

        if (typeof auto.categoria === "string") {
            categoryName = auto.categoria;
        }

        if (
            typeof auto.categoria === "object" &&
            auto.categoria !== null
        ) {
            categoryName =
                auto.categoria.segmento ||
                auto.categoria.tipo ||
                "General";
        }

        categoryName = categoryName.trim();

        // -----------------------------
        // Crear o buscar categoría
        // -----------------------------
        const category = await prisma.category.upsert({
            where: {
                name: categoryName
            },
            update: {},
            create: {
                name: categoryName
            }
        });

        // -----------------------------
        // CONDITION
        // -----------------------------
        let condition = "USADO";

        if (
            auto.condicion &&
            auto.condicion.toLowerCase().includes("nuevo")
        ) {
            condition = "NUEVO";
        }

        // -----------------------------
        // Crear auto
        // -----------------------------
        const createdCar = await prisma.car.create({
            data: {

                brand: auto.marca || "Sin marca",

                model: auto.modelo || "Sin modelo",

                year: Number(auto.anio) || 2000,

                price: Number(auto.precio) || 0,

                kilometers: Number(auto.kilometraje) || 0,

                transmission:
                    auto.transmision || "Manual",

                fuelType:
                    auto.combustible || "Nafta",

                condition,

                description:
                    auto.descripcion || "",

                featured:
                    auto.destacado || false,

                categoryId: category.id
            }
        });

        // -----------------------------
        // IMAGENES
        // -----------------------------
        if (auto.imagen) {

            await prisma.carImage.create({
                data: {
                    url: auto.imagen,
                    isCover: true,
                    carId: createdCar.id
                }
            });
        }

        // múltiples imágenes futuras
        if (
            auto.imagenes &&
            Array.isArray(auto.imagenes)
        ) {

            for (const img of auto.imagenes) {

                await prisma.carImage.create({
                    data: {
                        url: img,
                        carId: createdCar.id
                    }
                });
            }
        }

        console.log(`✔ Auto migrado: ${createdCar.brand} ${createdCar.model}`);
    }

    console.log("✅ Migración completada");
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });