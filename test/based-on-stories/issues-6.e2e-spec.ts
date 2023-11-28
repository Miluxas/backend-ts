import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';

describe(' Issue number 6 ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let customerToken;
  it(' User login', async () => {
    return agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: '123123',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.user.firstName).toEqual('user');
        expect(resultObject.payload.user.password).toBeUndefined();
        customerToken = resultObject.payload.token;
      });
  });

  it(' Customer get his/her shopping cart', async () => {
    return agent(app.getHttpServer())
      .get(`/shopping-cart`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items.length).toEqual(0);
      });
  });

  it(' Customer add a SKU to shopping cart', async () => {
    return agent(app.getHttpServer())
      .put(`/shopping-cart`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        sku: '654a299fae38d86c5c0b8902',
        count: 3,
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].sku).toEqual(
          '654a299fae38d86c5c0b8902',
        );
        expect(resultObject.payload.items[0].count).toEqual(3);
      });
  });

  it(' Customer get his/her shopping cart', async () => {
    return agent(app.getHttpServer())
      .get(`/shopping-cart`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0].sku).toEqual(
          '654a299fae38d86c5c0b8902',
        );
        expect(resultObject.payload.items[0].count).toEqual(3);
        expect(resultObject.payload.items.length).toEqual(1);
      });
  });

  it(' Customer add a SKU to shopping cart', async () => {
    return agent(app.getHttpServer())
      .put(`/shopping-cart`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        sku: '654a299fae38d86c5c0b7902',
        count: 2,
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[1].sku).toEqual(
          '654a299fae38d86c5c0b7902',
        );
        expect(resultObject.payload.items[1].count).toEqual(2);
      });
  });

  it(' Customer get his/her shopping cart', async () => {
    return agent(app.getHttpServer())
      .get(`/shopping-cart`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items.length).toEqual(2);
        expect(resultObject.payload.items[0].sku).toEqual(
          '654a299fae38d86c5c0b8902',
        );
        expect(resultObject.payload.items[0].count).toEqual(3);
        expect(resultObject.payload.items[1].sku).toEqual(
          '654a299fae38d86c5c0b7902',
        );
        expect(resultObject.payload.items[1].count).toEqual(2);
      });
  });

  it(' Customer remove a SKU from shopping cart', async () => {
    return agent(app.getHttpServer())
      .delete(`/shopping-cart`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        sku: '654a299fae38d86c5c0b8902',
      })
      .expect(204);
  });

  it(' Customer get his/her shopping cart', async () => {
    return agent(app.getHttpServer())
      .get(`/shopping-cart`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items.length).toEqual(1);
        expect(resultObject.payload.items[1].sku).toEqual(
          '654a299fae38d86c5c0b7902',
        );
        expect(resultObject.payload.items[1].count).toEqual(2);
      });
  });
});
