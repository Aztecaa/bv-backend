import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

async function main() {

    const hashedPassword =
        await bcrypt.hash("admin123", 10);

    const user = await prisma.user.upsert({

        where: {
            username: "admin"
        },

        update: {},

        create: {
            username: "admin",
            password: hashedPassword,
            role: "supervisor"
        }
    });

    console.log("✅ Admin creado");
    console.log(user);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });