if (process.env.DATABASE_USER === undefined) {
    process.env.DATABASE_USER = "postgres";
}

if (process.env.DATABASE_PASSWORD === undefined) {
    process.env.DATABASE_PASSWORD = "secret";
}

if (process.env.DATABASE_HOST === undefined) {
    process.env.DATABASE_HOST = "localhost";
}

if (process.env.DATABASE_PORT === undefined) {
    process.env.DATABASE_PORT = "5432";
}

if (process.env.DATABASE_DB === undefined) {
    process.env.DATABASE_DB = "demo";
}
