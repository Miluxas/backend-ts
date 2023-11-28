import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';

describe(' Issue number 5 ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  it(' Customer get product detail', async () => {
    return agent(app.getHttpServer())
      .get(`/products/654a299fae38d86c5c0b7910`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.name).toEqual('product test 2 nfound');
        expect(resultObject.payload.categories.length).toEqual(1);
        expect(resultObject.payload.brand.title).toEqual('Updated brand title');
      });
  });
  
});
