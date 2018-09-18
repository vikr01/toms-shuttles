// @flow
import routes from './routes';
import homeMiddleware from './routes/home';

const home = [routes.HOME, ...homeMiddleware];

export default [home];
