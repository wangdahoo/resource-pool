const { IDLE, USING, ACQUIRING } = require('./PooledResourceStatus')

/**
 * @class
 * @private
 */
class PooledResource {
  constructor (resource) {
    this.status = IDLE
    this.r = resource
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
