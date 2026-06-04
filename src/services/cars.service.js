//cars.service.js
import prisma from "../lib/prisma.js";

/* --------------------------
   Obtener autos
--------------------------- */
export async function getAllCars() {

    const cars = await prisma.car.findMany({
        include: {
            category: true,
            images: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    console.log("🚗 AUTOS DESDE DB:");
    console.dir(cars, { depth: null });

    return cars.map(formatCar);
}

/* --------------------------
   Crear auto
--------------------------- */
export async function createCar(auto) {

    const categoryName = auto.categoria || "General";

    const category = await prisma.category.upsert({
        where: {
            name: categoryName
        },
        update: {},
        create: {
            name: categoryName
        }
    });

    const createdCar = await prisma.car.create({
        data: {

            brand: auto.marca,

            model: auto.modelo,

            year: Number(auto.anio),

            price: Number(auto.precio),

            kilometers:
                Number(auto.kilometraje) || 0,

            transmission:
                auto.transmision || "Manual",

            fuelType:
                auto.combustible || "Nafta",

            condition:
                auto.condicion === "NUEVO"
                    ? "NUEVO"
                    : "USADO",

            description:
                auto.descripcion || "",

            featured:
                auto.destacado || false,

            categoryId:
                category.id
        }
    });

    if (auto.imagen) {

        await prisma.carImage.create({
            data: {
                url: auto.imagen,
                isCover: true,
                carId: createdCar.id
            }
        });
    }

    return createdCar;
}

/* --------------------------
   Actualizar auto
--------------------------- */
export async function updateCar(id, auto) {

    const existingCar = await prisma.car.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!existingCar) {
        throw new Error("AUTO_NOT_FOUND");
    }

    let categoryId = existingCar.categoryId;

    if (auto.categoria) {

        const category = await prisma.category.upsert({
            where: {
                name: auto.categoria
            },
            update: {},
            create: {
                name: auto.categoria
            }
        });

        categoryId = category.id;
    }

    const updatedCar = await prisma.car.update({
        where: {
            id: Number(id)
        },
        data: {
            brand: auto.marca,

            model: auto.modelo,

            year:
                auto.anio
                    ? Number(auto.anio)
                    : undefined,

            price:
                auto.precio
                    ? Number(auto.precio)
                    : undefined,

            kilometers:
                auto.kilometraje
                    ? Number(auto.kilometraje)
                    : undefined,

            transmission:
                auto.transmision,

            fuelType:
                auto.combustible,

            condition:
                auto.condicion,

            description:
                auto.descripcion,

            featured:
                auto.destacado,

            categoryId
        }
    });

    if (auto.imagen) {

        await prisma.carImage.deleteMany({
            where: {
                carId: Number(id),
                isCover: true
            }
        });

        await prisma.carImage.create({
            data: {
                url: auto.imagen,
                isCover: true,
                carId: updatedCar.id
            }
        });
    }

    return updatedCar;
}

/* --------------------------
   Eliminar auto
--------------------------- */
export async function deleteCar(id) {

    const existingCar = await prisma.car.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!existingCar) {
        throw new Error("AUTO_NOT_FOUND");
    }

    await prisma.car.delete({
        where: {
            id: Number(id)
        }
    });

    return existingCar;
}

/* --------------------------
   Formatear respuesta
--------------------------- */
function formatCar(car) {

    return {
        id: car.id,

        marca: car.brand,
        modelo: car.model,

        anio: car.year,

        precio: car.price,

        kilometraje: car.kilometers,

        transmision: car.transmission,

        combustible: car.fuelType,

        condicion: car.condition,

        descripcion: car.description,

        destacado: car.featured,

        categoria:
            car.category?.name || "General",

        imagen:
            car.images?.find(img => img.isCover)?.url
            || car.images?.[0]?.url
            || null,

        imagenes:
            car.images?.map(img => img.url) || []
    };
}
