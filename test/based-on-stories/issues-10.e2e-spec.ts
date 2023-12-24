import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';
import { addressErrorMessages } from '../../src/order/errors';

describe(' Issue number 10 ', () => {
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

  it(' Customer get address list', async () => {
    return agent(app.getHttpServer())
      .get(`/addresses`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items.length).toEqual(0);
      });
  });

  let addressId;
  it(' Customer add an address to address list', async () => {
    return agent(app.getHttpServer())
      .post(`/addresses`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'test address',
        cityId: 1,
        latitude: -0.179685,
        longitude: 51.660615,
        detail: 'address detail',
        postalCode: '45157',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.cityName).toEqual('London');
        expect(resultObject.payload.countryName).toEqual('British');
        expect(resultObject.payload.isDefault).toEqual(false);
        addressId = resultObject.payload.id;
      });
  });

  it(' Customer edit an address', async () => {
    return agent(app.getHttpServer())
      .put(`/addresses/${addressId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        postalCode: '123123',
      })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.postalCode).toEqual('123123');
      });
  });

  it(' Customer set an address as default', async () => {
    return agent(app.getHttpServer())
      .put(`/addresses/${addressId}/default`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload).toEqual(true);
      });
  });

  it(' Customer remove an address', async () => {
    return agent(app.getHttpServer())
      .delete(`/addresses/${addressId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: '654a299fae38d86c5c0b790e',
      })
      .expect(204);
  });

  it(' Customer got error on out of area location', async () => {
    return agent(app.getHttpServer())
      .post(`/addresses`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'test address',
        cityId: 1,
        latitude: -10.179685,
        longitude: 51.660615,
        detail: 'address detail',
        postalCode: '45157',
      })
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(addressErrorMessages.AREA_NOT_FOUND.message);
      });
  });

});
