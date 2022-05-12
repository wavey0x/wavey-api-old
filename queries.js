const dotenv = require('dotenv')
const Pool = require('pg').Pool
require('dotenv').config()

console.log(process.env.HOST)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

const getAddresses = (request, response) => {
    pool.query('SELECT * FROM address_list', (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
}
module.exports = {
    getAddresses
}