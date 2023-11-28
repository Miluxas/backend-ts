import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';

describe(' Role base authorization ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  it(' Customer get product list ', async () => {
    return agent(app.getHttpServer())
      .get(`/products`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.pagination.itemCount).toEqual(2);

      });
     
  });

  it(' Customer get product list by category filter', async () => {
    return agent(app.getHttpServer())
      .get(`/products?categories._id=6278dfae51749313a02d5452`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.pagination.itemCount).toEqual(1);
        expect(resultObject.payload.items[0].categories[0]._id).toEqual('6278dfae51749313a02d5452');
      });
     
  });
  
});
