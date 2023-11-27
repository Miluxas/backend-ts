import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';

describe(' Order Tests ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let userId;
  let userToken;
  it(' User login', async () => {
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password:'123123'
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.firstName).toEqual('user');
        expect(resultObject.payload.user.password).toBeUndefined();
        userId = resultObject.payload.user.id;
        userToken=resultObject.payload.token;
      });
  });
let skuQuantity;
  it(' Get SKU quantity', async () => {
    return agent(app.getHttpServer())
      .get(`/skus/654a299fae38d86c5c0b7903`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        skuQuantity= resultObject.payload.quantity
      });
  });

  it(' User register order ', async () => {
    return agent(app.getHttpServer())
      .post(`/orders/register`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({items:[{sku:'654a299fae38d86c5c0b7903',count:3}]})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
      });
     
  });

  it(' Get SKU updated quantity', async () => {
    return agent(app.getHttpServer())
      .get(`/skus/654a299fae38d86c5c0b7903`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.quantity).toEqual(skuQuantity-3);
      });
  });
});
