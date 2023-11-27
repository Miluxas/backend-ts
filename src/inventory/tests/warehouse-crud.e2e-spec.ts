import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';
import { warehouseErrorMessages } from '../errors';

describe(' Warehouse CRUD ', () => {
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

  it(' Warehouse list', async () => {
    return agent(app.getHttpServer())
      .get('/warehouses')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].name).toEqual('Main');
      });
  });

  it(' Warehouse list by filter', async () => {
    return agent(app.getHttpServer())
      .get('/warehouses?search=th')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].name).toEqual('three');
      });
  });

  it(' Warehouse detail', async () => {
    return agent(app.getHttpServer())
      .get('/warehouses/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.name).toEqual('Main');
      });
  });

  it(' Warehouse update', async () => {
    return agent(app.getHttpServer())
      .put('/warehouses/1')
      .set('Authorization', `Bearer ${adminToken}`)
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
      .set('Authorization', `Bearer ${adminToken}`)
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
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });

  it(' Warehouse detail', async () => {
    return agent(app.getHttpServer())
      .get('/warehouses/2')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          warehouseErrorMessages.WarehousE_NOT_FOUND.message,
        );
      });
  });
});
