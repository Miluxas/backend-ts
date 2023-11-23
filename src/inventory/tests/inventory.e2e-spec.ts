import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';

describe(' Inventory Tests ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

let skuQuantity;

  it(' Get SKU quantity', async () => {
    return agent(app.getHttpServer())
      .get(`/skus/654a299fae38d86c5c0b7904`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        skuQuantity= resultObject.payload.quantity
      });
  });

  it(' User register import to warehouse ', async () => {
    return agent(app.getHttpServer())
      .post(`/inventories/register-import`)
      .send({
        warehouseId:1,
        items:[{sku:'654a299fae38d86c5c0b7904',count:300}]})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
      });
     
  });

  it(' Get SKU updated quantity', async () => {
    return agent(app.getHttpServer())
      .get(`/skus/654a299fae38d86c5c0b7904`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.quantity).toEqual(skuQuantity+300);
      });
  });
});
