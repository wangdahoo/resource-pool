const { IDLE, USING, ACQUIRING } = require('./PooledResourceStatus')

/**
 * @class
 * @private
 */
class PooledResource {
  /**
   * @param {*} resource 
   * @param {Pool} pool 
   */

  constructor (resource, pool) {
    this.id = Math.random().toString(32).substr(3, 8)
    this.status = IDLE
    this.r = resource
    this.pool = pool
    this.createdTime = Date.now()
    this.lastAllocateTime = null
    this.lastDeallocateTime = null
  }

  allocate () {
    this.status = USING
    this.lastAllocateTime = Date.now()
  }

  deallocate () {
    this.status = IDLE
    this.lastDeallocateTime = Date.now()
  }
}

module.exports = PooledResource
