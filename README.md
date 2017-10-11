# Resource-Pool

> Resource Pooling.

### Install

```bash
$ npm install resource-pool
```

### How to Use

```js
/* 以创建 mongodb 连接池为例 */

const Pool = require('resource-pool')
const MongoClient = require('mongodb').MongoClient
const MONGO_URI = 'mongodb://localhost:27017/some-mongodb'

function createConnection () {
  return new Promise((resolve) => {
    MongoClient.connect(MONGO_URI, (err, db) => {
      if (err) throw err
      resolve(db)
    })
  })
}

function closeConnection (db) {
  db.close()
}

const pool = new Pool({
  create: createConnection,
  destroy: closeConnection
})

pool.acquire().then(({r, release}) => { // get resource from pool
  // r is the resource instance, and it is the `db` boject here for mongodb
  let col = r.collection('articles')
  col.insert({
    title: '从今天开始',
    description: '关心粮食和素材。我有一所房子，面朝大海，春暖花开。'
  })
  // return to pool
  release()
})

```
