import { defineConfig } from 'prisma/config';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./data/database/main.sqlite';

export default defineConfig({
    schema: 'prisma/schema',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: databaseUrl,
    },
});
