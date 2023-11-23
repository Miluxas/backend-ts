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

  it(' Category update', async () => {
    return agent(app.getHttpServer())
      .put('/categories/626955e809a5665331a6d083')
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
