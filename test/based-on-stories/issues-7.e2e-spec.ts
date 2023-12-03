import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';

describe(' Issue number 7 ', () => {
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

  it(' Customer add a comment to a product', async () => {
    return agent(app.getHttpServer())
      .put(`/products/654a299fae38d86c5c0b790e/review`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        comment: 'test comment',
        rate: 4.2,
      })
      .expect(200)
  });

  it(' Customer get product with commends', async () => {
    return agent(app.getHttpServer())
      .get(`/products/654a299fae38d86c5c0b790e`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.myReview).toEqual(
          {
            comment: 'test comment',
            rate: 4.2,
          }
        );
      });
  });

  it(' Customer update comment to a product', async () => {
    return agent(app.getHttpServer())
      .put(`/products/654a299fae38d86c5c0b790e/review`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        comment: 'test updated comment',
        rate: 3.5,
      })
      .expect(200)
  });

  it(' Customer get product with commends', async () => {
    return agent(app.getHttpServer())
      .get(`/products/654a299fae38d86c5c0b790e`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.myReview).toEqual(
          {
            comment: 'test updated comment',
            rate: 3.5,
          }
        );
      });
  });

  it(' Customer remove comment from a product', async () => {
    return agent(app.getHttpServer())
      .delete(`/products/654a299fae38d86c5c0b790e/review`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(204)
  });

  it(' Customer get product with commends', async () => {
    return agent(app.getHttpServer())
      .get(`/products/654a299fae38d86c5c0b790e`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.myReview).toBeUndefined();
      });
  });
  
});
