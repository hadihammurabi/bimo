const utils = require('../utils')

const app = (app_name) => {
  const application = utils.getApplications(app_name)
  
  let routes = function (router, opts, done) { done() }
  if (application) {
    routes = require(`${application.path}/routes`)
  } else {
    console.log(`Application "${app_name}" not found`)
  }

  return {
    routes,
  }

}

module.exports = app
