import { GlobalConstants } from '../interfaces/const';
export const errorCodes: GlobalConstants = {
  '102': { status: 500, message: 'something went wrong, please try again.' },
  '103': { status: 422, message: 'Provided values are invalid' },
  '104': { status: 404, message: 'Requested resource not found on server' }
};
