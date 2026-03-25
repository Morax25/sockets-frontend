import dotenv from 'dotenv'
import pkg from 'pg'
import pRetry from 'p-retry'

dotenv.config()

const { Pool } = pkg;

const {
    PG_HOST,
    PG_PORT,
    PG_USER,
    PG_PASSWORD,
    PG_DATABASE,
    PG_MAX_CLIENTS,
    PG_IDLE_TIMEOUT,
    PG_CONNECTION_TIMEOUT
} = process.env

export const pool = new Pool({
    host: PG_HOST,
    port: PG_PORT,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    max: Number(PG_MAX_CLIENTS),
    idleTimeoutMillis: Number(PG_IDLE_TIMEOUT),
    connectionTimeoutMillis: Number(PG_CONNECTION_TIMEOUT)
})

export async function testConnection() {
    await pRetry(
        async () => {
            const client = await pool.connect()
            try {
                await pool.query('SELECT 1')
                console.log("Post gres connection established")
            } catch (error) {
                client.release()
            }
        },
        {
            retries: 10,
            minTimeout: 2000,
            onFailedAttempt: (err) => {
                console.warn(`PG Connection attempt ${err.attemptNumber} failed. ${err.retriesLeft} retries left`, err.error.message)
            }
        }

    )
}

const closePool = () => {
    pool.end().then(() => {
        console.log("postgres pool closed")
    })
}