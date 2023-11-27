import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';

describe(' Role base authorization ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let firstUserToken;
  let firstUserId;
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
        firstUserToken=resultObject.payload.token;
        firstUserId = resultObject.payload.user.id;
      });
  });

  let secondUserToken;
  let secondUserId;
  it(' User login', async () => {
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user2@test.com',
        password:'123123'
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.firstName).toEqual('user2');
        expect(resultObject.payload.user.password).toBeUndefined();
        secondUserToken=resultObject.payload.token;
        secondUserId = resultObject.payload.user.id;
      });
  });

  let adminToken;
  it(' Admin login', async () => {
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password:'123123'
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.firstName).toEqual('superAdmin');
        expect(resultObject.payload.user.password).toBeUndefined();
        adminToken=resultObject.payload.token;
      });
  });

  it(' User can edit his/her info', async () => {
    return agent(app.getHttpServer())
      .put(`/users/${firstUserId}`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send({
        firstName:'new name',
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.firstName).toEqual('new name');
      });
  });

  it(' User info dose NOT update without token', async () => {
    return agent(app.getHttpServer())
      .put(`/users/${firstUserId}`)
      .send({
        firstName:'bad name',
      })
      .expect(401)
  });

  it(' User info dose NOT update with other user token', async () => {
    return agent(app.getHttpServer())
      .put(`/users/${firstUserId}`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .send({
        firstName:'bad name',
      })
      .expect(403)
  });

  it(' Admin can edit user info', async () => {
    return agent(app.getHttpServer())
      .put(`/users/${firstUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName:'admin friendly name',
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.firstName).toEqual('admin friendly name');
      });
  });


});
