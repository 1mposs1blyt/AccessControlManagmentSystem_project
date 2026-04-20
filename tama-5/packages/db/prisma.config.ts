import 'dotenv/config';
console.log(process.env.DATABASE_URL)
// yarn install @prisma/client
import { defineConfig } from '@prisma/config';


export default defineConfig({
    // Укажите путь к вашему файлу схемы
    schema: './prisma/schema.prisma',
    // Настройка миграций
    migrations: {
        // Параметры миграций
        path: "./prisma/migrations",
    },

    // Настройка datasource (например, для использования переменных среды) process.env.DATABASE_URL || 
    datasource: {
        url: "postgresql://postgres:123456@localhost:5432/mynewdb"
    }
})
