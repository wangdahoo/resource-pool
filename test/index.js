const Pool = require('../')
const mongodb = require('mongodb')

const MongoClient = require('mongodb').MongoClient
const MONGO_URI = 'mongodb://localhost:27017/one-simple-mongodb'

function createMongodbConnection () {
  return new Promise((resolve) => {
    MongoClient.connect(MONGO_URI, (err, db) => {
      if (err) throw err
      resolve(db)
    })
  })
}

function closeMongodbConnection (db) {
  db.close()
}

describe('module', () => {
  describe('Pool', () => {
    it('Mongodb connection pool should success', () => {
      const mongoConnectionPool = new Pool({
        create: createMongodbConnection,
        destroy: closeMongodbConnection
      })

      process.on('exit', (code) => {
        mongoConnectionPool.destroy()
        console.log(`About to exit with code: ${code}`)
      })

      let conn1, conn2

      Promise.all([
        mongoConnectionPool.acquire(),
        mongoConnectionPool.acquire()
      ]).then(conns => {
        conn1 = conns[0]
        conn2 = conns[1]
        mongoConnectionPool.info()

        conn1.release()
        mongoConnectionPool.info()

        mongoConnectionPool.acquire().then(conn => {
          conn1 = conn
          mongoConnectionPool.info()

          process.exit(0)
        })
      })
    })
  })
})
