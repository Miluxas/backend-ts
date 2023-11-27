import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';

describe(' Media CRUD ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let userToken;
  it(' User login', async () => {
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password:'123123'
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.firstName).toEqual('user');
        expect(resultObject.payload.user.password).toBeUndefined();
        userToken=resultObject.payload.token;
      });
  });

  it(' Media create', async () => {
    return agent(app.getHttpServer())
      .post('/medias')
      .set('Authorization', `Bearer ${userToken}`)
      .attach('file', './test/nob.jpg')
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.originalName).toEqual('nob.jpg');
      });
  });
  
});
