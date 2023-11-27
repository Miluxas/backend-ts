import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';
import { CategoryErrorMessages } from '../errors';

describe(' Category CRUD ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  it(' Category list', async () => {
    return agent(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload[0].title).toEqual('Granola');
      });
  });

  it(' Category detail', async () => {
    return agent(app.getHttpServer())
      .get('/categories/626955e809a5665331a6d083')
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('Granola');
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

  it(' Category update', async () => {
    return agent(app.getHttpServer())
      .put('/categories/626955e809a5665331a6d083')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated category title' })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('Updated category title');
      });
  });

  it(' Category delete', async () => {
    return agent(app.getHttpServer())
      .delete('/categories/626955e809a5665331a6d083')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });

  it(' Category detail', async () => {
    return agent(app.getHttpServer())
      .get('/categories/626955e809a5665331a6d083')
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          CategoryErrorMessages.CATEGORY_NOT_FOUND.message,
        );
      });
  });
});
