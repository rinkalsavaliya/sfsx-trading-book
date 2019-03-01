import * as express from 'express';
import mainController from '../controller/main';

class Router {
  public router: express.Router;
  constructor () {
    this.router = express.Router();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    this.router.use('/', mainController.sampleApi);
  }
}

export default new Router().router;
