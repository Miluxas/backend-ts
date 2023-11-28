import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';

describe(' Issue number 4 ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  it(' Customer get product list search', async () => {
    return agent(app.getHttpServer())
      .get(`/products?search=nfoun`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.pagination.itemCount).toEqual(1);
        expect(resultObject.payload.items[0].name).toEqual('product test 2 nfound');
      });
     
  });

  it(' Customer get product list search', async () => {
    return agent(app.getHttpServer())
      .get(`/products?search=dfoun`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.pagination.itemCount).toEqual(1);
        expect(resultObject.payload.items[0].description).toEqual('description of product test dfound');
      });
     
  });
  
});
