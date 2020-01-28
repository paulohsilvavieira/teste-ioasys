import app from '../src/app';
import supertest from 'supertest';

const request = supertest.agent(app);

export { request };
