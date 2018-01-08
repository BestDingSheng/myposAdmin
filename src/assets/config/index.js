
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),   // 生产 
  },
  dev: {
    env: require('./dev.env'),  // 测试 
  },
  beiji:{
    env: require('./beiji.env'),  // 备机
  }
}
