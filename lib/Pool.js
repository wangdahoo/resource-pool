const EventEmitter = require('events').EventEmitter
const { POOL_OPTIONS } = require('./constants')
const PooledResource = require('./PooledResource')
const Deque = require('simple-deque')

class Pool {
  /**
   * @param {Function} options.create
   *  Should create a resource to be allocate, reture a Promise.
   * @param {Function} options.destroy
   *  Should gently close any resources.
   * @param {Number} options.min
   *  The min size of the pool.
   * @param {Number} options.max
   *  The max size of the pool.
   */

  constructor (options) {
    this._create = options.create
    this._destroy = options.destroy
    this._min = options.min || POOL_OPTIONS.MIN
    this._max = options.max || POOL_OPTIONS.MAX
    this._idle = null
    this._using = null

    this._init()
  }

  _init () {
    let creations = []
    while (creations.length < this._min) {
      creations.push(this._create())
    }

    Promise
      .all(creations)
      .then(resources => {
        this._idle = new Deque(resources.map(r => new PooledResource(r)))
      })
  }
}

module.exports = Pool
