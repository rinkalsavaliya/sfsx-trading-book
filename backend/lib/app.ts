import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import routes from '../routes/index';
import * as compression from 'compression';
import { Request, Response } from 'express';

class App {
  public app: express.Application;
  constructor () {
    this.app = express();
    this.config();
    this.mountRoutes();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use((req: Request, res: Response, next: Function) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      next();
    });
  }

  private mountRoutes(): void {
    this.app.use('/api/v1', routes);
    // compress the build
    this.app.use(compression());
    // set caching for 1 year
    this.app.use(express.static(path.resolve(__dirname, '../../../frontend', 'dist'), {
      maxAge: (1 * 365 * 24 * 60 * 60 * 1000)
    }));

    // for every route except API, serve the build
    this.app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, '../../../frontend', 'dist', 'index.html'));
    });

    // not found message
    this.app.use((req: Request, res: Response) => {
      res.status(404).send({ isError: true, message: 'API not found' });
    });
  }
}

export default new App().app;
