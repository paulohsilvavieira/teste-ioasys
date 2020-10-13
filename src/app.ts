import express from 'express';
// tslint:disable-next-line: no-import-side-effect
import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();
import routes from './routes';
import * as initializers from './initializers';
// tslint:disable-next-line: no-floating-promises
initializers.database.create();

const app = express();

app.set('port', process.env.SERVER_PORT || 3001);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable('x-powered-by');
app.use(routes);
// app.get('/', (request: Request, response: Response) => {
//   return response.status(200).json({
//     msg: 'Hello World',
//   });
// });

export default app;
