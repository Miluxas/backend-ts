import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';

describe(' Warehouse delivery cost ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

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

  it(' Set delivery cost to warehouse', async () => {
    return agent(app.getHttpServer())
      .post('/warehouses/1/delivery-cost')
      .set('Authorization', `Bearer ${adminToken}`)
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
      .set('Authorization', `Bearer ${adminToken}`)
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
