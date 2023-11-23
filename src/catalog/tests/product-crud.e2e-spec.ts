import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';

describe(' Product CRUD ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let mediaId;
  it(' Media create', async () => {
    return agent(app.getHttpServer())
      .post('/medias')
      .attach('file', './test/nob.jpg')
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.originalName).toEqual('nob.jpg');
        mediaId = resultObject.payload._id;
      });
  });

  let productId;
  let skuList;
  it(' Product create', async () => {
    return agent(app.getHttpServer())
      .post('/products')
      .send({
        name: 'product test',
        description: 'description of product test',
        brandId: '626955e809a5665331a6d073',
        categoriesIds: ['6278dfae51749313a02d5452', '6278dfa351749313a02d544c'],
        imagesIds: [mediaId],
        skus: [
          {
            name: 'string',
            price: 100,
            imagesIds: [mediaId],
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
            imagesIds: [mediaId],
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
            imagesIds: [mediaId],
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
            imagesIds: [mediaId],
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
        expect(resultObject.payload.images[0].id).toEqual(mediaId);
        expect(resultObject.payload.skus[0].variants[0].title).toEqual('Back Color');
        expect(resultObject.payload.skus[1].variants[1].value.name).toEqual('L');
        expect(resultObject.payload.skus[1].variants[1].type.title).toEqual('Size');
        productId=resultObject.payload._id;
        skuList=resultObject.payload.skus;
      });
  });

  it(' Product update', async () => {
    return agent(app.getHttpServer())
      .put(`/products/${productId}`)
      .send({
        name: 'product test',
        description: 'description of product test',
        skus: [
          {
            _id:skuList[0]._id,
            name: 'updated name',
            price: 100,
            imagesIds: [mediaId],
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
            name: 'new sku',
            price: 100,
            imagesIds: [mediaId],
            variants: [
              {
                title: 'Back Color',
                typeId: '626955e809a5665331a6d453',
                value: { name: 'green', value: '#1010ee' },
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
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.brand.title).toEqual('Adidas');
        expect(resultObject.payload.categories[0].title).toEqual('Spinach');
        expect(resultObject.payload.images[0].id).toEqual(mediaId);
        expect(resultObject.payload.skus.length).toEqual(5);
        expect(resultObject.payload.skus[0].name).toEqual('updated name');
        expect(resultObject.payload.skus[4].name).toEqual('new sku');
        expect(resultObject.payload.skus[4].variants[0].value.name).toEqual('green');
        expect(resultObject.payload.skus[1].variants[1].type.title).toEqual('Size');
      });
  });

  it(' Get SKU detail', async () => {
    return agent(app.getHttpServer())
      .get(`/skus/654a299fae38d86c5c0b7903`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.name).toEqual('string');
        expect(resultObject.payload.price).toEqual(50);
        expect(resultObject.payload.quantity).toEqual(100);
      });
  });
});
