import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

const app = express();

app.set('port', process.env.SERVER_PORT || 3001);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.disable('x-powered-by');

app.get('/', (request: Request, response: Response) => {
  return response.status(200).json({
    msg: 'Hello World',
  });
});

export default app;
