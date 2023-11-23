import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';

describe(' Auth ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let userId;
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
        userId = resultObject.payload.user.id;
        userToken=resultObject.payload.token;
      });
  });

  it(' Change password', async () => {
    return agent(app.getHttpServer())
      .put('/auth/change-password')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        oldPassword:'123123',
        newPassword:'123456'
      })
      .expect(200)
  });

  it(' User login with new password', async () => {
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password:'123456'
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.firstName).toEqual('user');
        expect(resultObject.payload.user.password).toBeUndefined();
        userId = resultObject.payload.user.id;
        userToken=resultObject.payload.token;
      });
  });


});
