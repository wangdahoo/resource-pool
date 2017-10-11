const EventEmitter = require('events').EventEmitter
const { POOL_OPTIONS } = require('./constants')
const PooledResource = require('./PooledResource')
const Deque = require('simple-deque')

class Pool extends EventEmitter {
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
    super()

    this._create = options.create
    this._destroy = options.destroy
    this._min = options.min || POOL_OPTIONS.MIN
    this._max = options.max || POOL_OPTIONS.MAX
    this._idle = null
    this._using = null
    this._ready = false

    this.once('initialize', this._init)
    this.emit('initialize')
  }

  _init () {
    console.log('== initialize pool...')
    let creations = []
    while (creations.length < this._min) {
      creations.push(this._create())
    }

    Promise
      .all(creations)
      .then(resources => {
        this._idle = new Deque(resources.map(r => new PooledResource(r)))
        this._using = new Deque()
        this.emit('initialized')
        console.log('== initialize pool ok')
      })
  }

  _acquire () {
    let r = this._idle.shift()
    let using = this._using
    let idle = this._idle
    r.allocate()
    using.push(r)
    r._node = using.tail

    // release
    r.release = function () {
      let _prev = r._node.prev
      let _next = r._node.next

      if (_prev) _prev.next = _next
      if (_next) _next.prev = _prev
      if (using.head === r._node) {
        using.head = r._node.next
      }
      if (using.tail === r._node) {
        using.tail = r._node.prev
      }

      delete r._node
      r.deallocate()
      idle.push(r)

      r = null
    }

    return r
  }

  acquire () {
    const reqId = `${Math.random().toString(32).substr(3, 8)}-${Date.now()}`
    
    return new Promise((resolve) => {
      this.once(reqId, () => {
        resolve(this._acquire())
      })

      if (this._ready) {
        this.emit(reqId)
      } else {
        this.on('initialized', () => {
          this._ready = true
          this.emit(reqId)
        })
      }
    })
  }

  info () {
    if (!(this._using && this._idle)) return

    const ls = (resources) => {
      let it = resources.iterator()
      let next = it.next()
      while (!next.done) {
        console.log(next.value && next.value.id)
        next = it.next()
      }
    }

    console.log('== using resources:')
    ls(this._using)
    console.log('\n')

    console.log('== idle resources:')
    ls(this._idle)
    console.log('\n')
  }
}

module.exports = Pool
