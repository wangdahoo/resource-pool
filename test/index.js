const SimplePool = require('../')
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

describe('module', () => {
  describe('SimplePool', () => {
    it('SimplePool should success', () => {
      new SimplePool({
        create: createMongodbConnection
      })
    })
  })
})
