import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';

describe(' Issue number 2 ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

let customerId
  it(' Customer create', async () => {
    return agent(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Smith',
        password: '123123',
        email: 'john.smith@test.com',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.firstName).toEqual('John');
        expect(resultObject.payload.password).toBeUndefined();
        customerId = resultObject.payload.id;
      });
  });

  let customerToken;
  let customerRefreshToken;
  it(' Customer login', async () => {
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john.smith@test.com',
        password:'123123'
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.password).toBeUndefined();
        customerToken=resultObject.payload.token;
        customerRefreshToken=resultObject.payload.refreshToken;
      });
  });

  it(' Customer refresh token', async () => {
    return agent(app.getHttpServer())
      .get('/auth/refresh')
      .set('Authorization', `Bearer ${customerRefreshToken}`)
      .send({
        email: 'john.smith@test.com',
        password:'123123'
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload).toBe(customerToken);
      });
  });

  it(' Customer login', async () => {
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john.smith@test.com',
        password:'123123'
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.password).toBeUndefined();
        customerToken=resultObject.payload.token;
      });
  });

  it(' Customer register new order ', async () => {
    return agent(app.getHttpServer())
      .post(`/orders/register`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({items:[{sku:'654a299fae38d86c5c0b7903',count:3}]})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
      });
     
  });

  let orderId;
  it(' Customer get order list', async () => {
    return agent(app.getHttpServer())
      .get(`/orders`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items.length).toEqual(1);
        orderId=resultObject.payload.items[0].id
      });
     
  });

  it(' Customer register order ', async () => {
    return agent(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items.length).toEqual(1);
        orderId=resultObject.payload.id
      });
     
  });

});
