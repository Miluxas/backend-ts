import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';

describe(' Issue number 8 ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let customerToken;
  it(' Customer login', async () => {
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

  it(' Customer get wishlist', async () => {
    return agent(app.getHttpServer())
      .get(`/wishlist`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items.length).toEqual(0);
      });
  });

  it(' Customer add a product to wish list', async () => {
    return agent(app.getHttpServer())
      .put(`/wishlist`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: '654a299fae38d86c5c0b790e',
      })
      .expect(200)
  });

  it(' Customer get wishlist', async () => {
    return agent(app.getHttpServer())
      .get(`/wishlist`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items.length).toEqual(1);
        expect(resultObject.payload.items[0].name).toEqual('product test');
      });
  });

  it(' Customer get product with isWished true', async () => {
    return agent(app.getHttpServer())
      .get(`/products/654a299fae38d86c5c0b790e`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.isWished).toEqual(true);
      });
  });

  it(' Customer remove a product to wish list', async () => {
    return agent(app.getHttpServer())
      .delete(`/wishlist`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: '654a299fae38d86c5c0b790e',
      })
      .expect(204)
  });

  it(' Customer get wishlist', async () => {
    return agent(app.getHttpServer())
      .get(`/wishlist`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items.length).toEqual(0);
      });
  });
  
});
