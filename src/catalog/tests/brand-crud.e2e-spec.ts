import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';
import { BrandErrorMessages } from '../errors';

describe(' Brand CRUD ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  it(' Brand list', async () => {
    return agent(app.getHttpServer())
      .get('/brands')
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload[0].title).toEqual('Adidas');
      });
  });

  it(' Brand detail', async () => {
    return agent(app.getHttpServer())
      .get('/brands/626955e809a5665331a6d073')
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('Adidas');
      });
  });

  it(' Brand update', async () => {
    return agent(app.getHttpServer())
      .put('/brands/626955e809a5665331a6d073')
      .send({ title: 'Updated brand title' })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('Updated brand title');
      });
  });

  it(' Brand delete', async () => {
    return agent(app.getHttpServer())
      .delete('/brands/626955e809a5665331a6d073')
      .expect(204);
  });

  it(' Brand detail', async () => {
    return agent(app.getHttpServer())
      .get('/brands/626955e809a5665331a6d073')
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          BrandErrorMessages.BRAND_NOT_FOUND.message,
        );
      });
  });
});
