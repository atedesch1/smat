export = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    `${process.env.NODE_ENV === 'production' ? 'dist' : 'src'}/models/*.*`
  ],
  migrations: [
    `${process.env.NODE_ENV === 'production' ? 'dist' : 'src'}/database/migrations/*.*`
  ],
  cli: {
    migrationsDir: `${process.env.NODE_ENV === 'production' ? 'dist' : 'src'}/database/migrations/`
  }
}
