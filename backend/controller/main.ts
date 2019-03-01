import respGenerator from '../response/json-response';
import { Request, Response } from 'express';

/**
 * MainController - responsibility of this class is to ...
 */
class MainController {
  /**
   * a sample API
   */
  async sampleApi(req: Request, res: Response) {
    respGenerator.sendResponse(res, {});
  }
}

export default new MainController();
