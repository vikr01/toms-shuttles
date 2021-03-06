module.exports = {
  LOGIN: '/login',
  LOGOUT: '/logout', // GET

  // authenticate
  AUTH: '/api/authenticate', // POST
  SIGNUP: '/api/signup', // POST
  LOGGED_IN: '/api/logged-in', // GET

  // users
  USER: '/api/users', // GET
  MY_DRIVER: '/api/my-driver',

  // drivers
  DRIVER: '/drivers/:username', // GET
  DRIVERS: '/drivers', // POST, PUT
  ALL_ACTIVE_DRIVERS: '/drivers-all', // GET

  // location api
  CLOSEST_DRIVER: '/api/nearest-driver', // GET
  ARRIVED: '/api/arrival', // GET

  // credit card api
  ADDCREDITCARD: '/api/credit-card', // POST
};
