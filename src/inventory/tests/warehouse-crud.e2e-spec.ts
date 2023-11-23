import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';
import { warehouseErrorMessages } from '../errors';

describe(' Warehouse CRUD ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  it(' Warehouse list', async () => {
    return agent(app.getHttpServer())
      .get('/warehouses')
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].name).toEqual('Main');
      });
  });

  it(' Warehouse list by filter', async () => {
    return agent(app.getHttpServer())
      .get('/warehouses?search=th')
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].name).toEqual('three');
      });
  });

  it(' Warehouse detail', async () => {
    return agent(app.getHttpServer())
      .get('/warehouses/1')
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.name).toEqual('Main');
      });
  });

  it(' Warehouse update', async () => {
    return agent(app.getHttpServer())
      .put('/warehouses/1')
      .send({ name: 'Updated warehouse name' })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.name).toEqual('Updated warehouse name');
      });
  });

  it(' Warehouse create', async () => {
    return agent(app.getHttpServer())
      .post('/warehouses')
      .send({ name: 'new warehouse name' })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.name).toEqual('new warehouse name');
        expect(resultObject.payload.id).toEqual(7);
        expect(resultObject.payload.status).toEqual('Available');
      });
  });

  it(' Warehouse delete', async () => {
    return agent(app.getHttpServer())
      .delete('/warehouses/2')
      .expect(204);
  });

  it(' Warehouse detail', async () => {
    return agent(app.getHttpServer())
      .get('/warehouses/2')
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          warehouseErrorMessages.WarehousE_NOT_FOUND.message,
        );
      });
  });
});
