import * as constants from './constants';
import { Response, Request } from 'express';

/*
* ResponseHandler - this function is responsible for sending response/error messages to the user
*/
class ResponseHandler {
  sendError(res: Response, err: Error) {
    // if error is application generated, then send the respective error message associated to the error code
    if (constants.errorCodes[err.message]) {
      res.status(constants.errorCodes[err.message].status);
      res.send({
        isError: true,
        message: constants.errorCodes[err.message].message
      });
    } else {
      // if error is system generated, send something went wrong message
      if (process.env.NODE_ENV !== 'production') {
        console.log(err, 'unhandled error');
      }
      res.status(500);
      res.send({
        isError: true,
        message: 'something went wrong, please try again'
      });
    }
  }

  /*
  * function to send success response
  */
  sendResponse(res: Response, data) {
    res.status(200).send({
      isError: false,
      data
    });
  }
}

export default new ResponseHandler();
