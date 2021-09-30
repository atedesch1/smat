import { getConnectionManager } from 'typeorm'

export default async function connect() {
  const connectionManager = getConnectionManager()

  const dir = process.env.NODE_ENV === 'production' ? 'dist' : 'src'

  const connection = connectionManager.create({
    name: 'default',
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [`${dir}/models/**/*.*`],
    migrations: [`${dir}/database/migrations/**/*.*`],
    cli: {
      entitiesDir: `${dir}/models/**/*.*`,
      migrationsDir: `${dir}/database/migrations/**/*.*`
    }
  })

  const connectWithRetry = () => {
    connection
      .connect()
      .then(() => console.log('Successfully connected to database.'))
      .catch((err) => {
        console.log('Couldn\'t connect to DB, retrying in 10s...')
        console.error(err.message)
        setTimeout(connectWithRetry, 10000)
      })
  }

  connectWithRetry()

  return connection
}
