const mysql = require('mysql')

let pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '1273235519',
  database: 'OnlineAuctionPlatformDatabase'
})

function exceSQL (sqlTemp, values = [], success, fail) {
  return new Promise((resolve, reject) => {
    pool.query(sqlTemp, values, (error, res, fields) => {
      if (error) {
        if (typeof fail === 'function') {
          fail(error)
        }
        reject(error)
      } else {
        if (typeof success === 'function') {
          success(res)
        }
        resolve(res)
      }
    })
  })
}

module.exports = {
  exceSQL
}