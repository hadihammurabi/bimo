module.exports = {
  port: 8080,
  apps: {
    // name: path to the app directory
  },
  views: {
    minify: true,
  },
  routes: require('./routes'),
};