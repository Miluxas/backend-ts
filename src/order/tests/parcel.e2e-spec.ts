import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';
import { ParcelError, parcelErrorMessages } from '../errors';

describe(' Parcel Tests ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);
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
        userToken=resultObject.payload.token;
      });
  });

let orderId;
  it(' User register order ', async () => {
    return agent(app.getHttpServer())
      .post(`/orders/register`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({items:[{ sku: '654a299fae38d86c5c0b7903', count: 120 },{sku:'654a299fae38d86c5c0b7915',count:30}]})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        orderId=resultObject.payload.id;
      });
     
  });

  it(' User get an order\'s parcel info ', async () => {
    return agent(app.getHttpServer())
      .get(`/orders/${orderId}/parcels`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.parcels.length).toEqual(2);
        expect(resultObject.payload.cost).toEqual(8);
      });
  });

  it(' User register an order\'s parcel info ', async () => {
    return agent(app.getHttpServer())
      .post(`/orders/${orderId}/parcels`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.parcels.length).toEqual(2);
        expect(resultObject.payload.cost).toEqual(8);
      });
  });

  it(' User checkout an order', async () => {
    return agent(app.getHttpServer())
      .post(`/orders/${orderId}/checkout`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
      });
  });


  it(' User register new order ', async () => {
    return agent(app.getHttpServer())
      .post(`/orders/register`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({items:[{ sku: '654a299fae38d86c5c0b7903', count: 120 }]})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        orderId=resultObject.payload.id;
      });
     
  });

  it(' User get error on get order\'s parcel info ', async () => {
    return agent(app.getHttpServer())
      .get(`/orders/${orderId}/parcels`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(parcelErrorMessages.NOT_POSSIBLE.message);
      });
  });

  it(' User register order ', async () => {
    return agent(app.getHttpServer())
      .post(`/orders/register`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({items:[{ sku: '654a299fae38d86c5c0b7903', count: 20 },{sku:'654a299fae38d86c5c0b7915',count:30}]})
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        orderId=resultObject.payload.id;
      });
     
  });

  it(' User get an order\'s parcel info ', async () => {
    return agent(app.getHttpServer())
      .get(`/orders/${orderId}/parcels`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        console.log(resultObject)
        expect(resultObject.payload.parcels.length).toEqual(2);
        expect(resultObject.payload.cost).toEqual(8);
      });
  });
});
