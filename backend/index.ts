import app from './lib/app';
import { config } from './config';
import { Request, Response } from 'express';

app.use((err: Error, req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(500);
  }
  return res.status(500).json({ isError: true, message: err.message, error: err });
});

app.listen(config.application.port, () => {
  console.log('server started on :', config.application.port);
});
