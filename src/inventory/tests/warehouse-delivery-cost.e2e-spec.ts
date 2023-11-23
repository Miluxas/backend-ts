import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';

describe(' Warehouse delivery cost ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  it(' Set delivery cost to warehouse', async () => {
    return agent(app.getHttpServer())
      .post('/warehouses/1/delivery-cost')
      .send({ areaId: 1, cost: 5 })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.id).toEqual(1);
        expect(resultObject.payload.areaId).toEqual(1);
        expect(resultObject.payload.cost).toEqual(5);
      });
  });

  it(' Update delivery cost in warehouse', async () => {
    return agent(app.getHttpServer())
      .post('/warehouses/1/delivery-cost')
      .send({ cost: 3,areaId:1 })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.id).toEqual(1);
        expect(resultObject.payload.areaId).toEqual(1);
        expect(resultObject.payload.cost).toEqual(3);
      });
  });
});
