import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';

describe(' Product CRUD ', () => {
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

  let productId
  it(' Product create', async () => {
    return (
      agent(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'product test',
          description: 'description of product test',
          brandId: '626955e809a5665331a6d073',
          categoriesIds: [
            '6278dfae51749313a02d5452',
            '6252a2e5856d55aeb128e921',
          ],
          imagesIds: ['626955e809a5665331a6d023'], 
          skus: [
            {
              name: 'string',
              price: 100,
              imagesIds: ['626955e809a5665331a6d023'],
              variants: [
                {
                  title: 'Back Color',
                  typeId: '626955e809a5665331a6d453',
                  value: { name: 'blue', value: '#1010ee' },
                },
                {
                  title: 'Size',
                  typeId: '6252a2e5856d55aeb128e454',
                  value: { name: 'L', value: 'L' },
                },
              ],
            },
            {
              name: 'string',
              price: 100,
              imagesIds: ['626955e809a5665331a6d023'],
              variants: [
                {
                  title: 'Back Color',
                  typeId: '626955e809a5665331a6d453',
                  value: { name: 'red', value: '#ee1010' },
                },
                {
                  title: 'Size',
                  typeId: '6252a2e5856d55aeb128e454',
                  value: { name: 'L', value: 'L' },
                },
              ],
            },
  
            {
              name: 'string',
              price: 100,
              imagesIds: ['626955e809a5665331a6d023'],
              variants: [
                {
                  title: 'Back Color',
                  typeId: '626955e809a5665331a6d453',
                  value: { name: 'blue', value: '#1010ee' },
                },
                {
                  title: 'Size',
                  typeId: '6252a2e5856d55aeb128e454',
                  value: { name: 'XL', value: 'XL' },
                },
              ],
            },
            {
              name: 'string',
              price: 100,
              imagesIds: ['626955e809a5665331a6d023'],
              variants: [
                {
                  title: 'Back Color',
                  typeId: '626955e809a5665331a6d453',
                  value: { name: 'red', value: '#ee1010' },
                },
                {
                  title: 'Size',
                  typeId: '6252a2e5856d55aeb128e454',
                  value: { name: 'XL', value: 'XL' },
                },
              ],
            },
          ],         
        })
        .expect(201)
        .then((result) => {
          const resultObject = JSON.parse(result.text);
          expect(resultObject.payload.brand.title).toEqual('Adidas');
          expect(resultObject.payload.categories[0].title).toEqual('Spinach');
          productId=resultObject.payload._id;
        })
    );
  });

  it(' Brand update', async () => {
    return agent(app.getHttpServer())
      .put('/brands/626955e809a5665331a6d073')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated Adidas title' })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('Updated Adidas title');
      });
  });

  it(' Product detail', async () => {
    return (
      agent(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200)
        .then((result) => {
          const resultObject = JSON.parse(result.text);
          expect(resultObject.payload.brand.title).toEqual('Updated Adidas title');
          expect(resultObject.payload.categories[0].title).toEqual('Spinach');
        })
    );
  });

  it(' Category update', async () => {
    return agent(app.getHttpServer())
      .put('/categories/6278dfae51749313a02d5452')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Running' })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('Running');
      });
  });

  it(' Product detail', async () => {
    return (
      agent(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200)
        .then((result) => {
          const resultObject = JSON.parse(result.text);
          expect(resultObject.payload.brand.title).toEqual('Updated Adidas title');
          expect(resultObject.payload.categories[0].title).toEqual('Running');
          expect(resultObject.payload.categories[1].title).toEqual('burger');
        })
    );
  });
});
