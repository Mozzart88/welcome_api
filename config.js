/**
 * API enviroment configuration file
 */

// Enviroments
var enviroments = {}

enviroments.staging = {
  'httpPort' : 3000,
  'envName' : 'staging'
}

enviroments.production = {
  'httpPort' : 5000,
  'envName' : 'production'
}

var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

var enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging

module.exports = enviromentToExport
