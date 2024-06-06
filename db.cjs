const sql = require('mssql');

const config = {
    user: 'intern',
    password: 'intern',
    server: '192.168.0.20',
    database: 'DB_TWNW',
    charset: 'utf8',
    options: {
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed! Bad Config: ', err);
        throw err;
    });

module.exports = {
    sql, poolPromise
};
