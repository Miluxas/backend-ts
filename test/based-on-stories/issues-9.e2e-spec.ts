import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../test/base_e2e_spec';

describe(' Issue number 9 ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  it(' Customer get product list by category filter', async () => {
    return agent(app.getHttpServer())
      .get(`/products?categories._id=6278dfae51749313a02d5452`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.pagination.itemCount).toEqual(1);
        expect(resultObject.payload.items[0].categories[0]._id).toEqual(
          '6278dfae51749313a02d5452',
        );
      });
  });

  it(' Customer get product list by min price filter', async () => {
    return agent(app.getHttpServer())
      .get(`/products?skus.price.min=135`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.pagination.itemCount).toEqual(1);
      });
  });

  it(' Customer get product list by max price filter', async () => {
    return agent(app.getHttpServer())
      .get(`/products?skus.price.max=49`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.pagination.itemCount).toEqual(1);
      });
  });

  it(' Customer get product list by price asc sort', async () => {
    return agent(app.getHttpServer())
      .get(`/products?sort=skus.price`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0]._id).toEqual(
          '654a299fae38d86c5c0b7910',
        );
      });
  });

  it(' Customer get product list by price desc sort', async () => {
    return agent(app.getHttpServer())
      .get(`/products?sort=skus.price.desc`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0]._id).toEqual(
          '654a299fae38d86c5c0b790e',
        );
      });
  });

  it(' Customer get product list by sales count asc sort', async () => {
    return agent(app.getHttpServer())
      .get(`/products?sort=salesCount`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0]._id).toEqual(
          '654a299fae38d86c5c0b7910',
        );
      });
  });

  it(' Customer get product list by sales count desc sort', async () => {
    return agent(app.getHttpServer())
      .get(`/products?sort=salesCount.desc`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0]._id).toEqual(
          '654a299fae38d86c5c0b790e',
        );
      });
  });

  it(' Customer get product list by rete average asc sort', async () => {
    return agent(app.getHttpServer())
      .get(`/products?sort=rateAverage`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0]._id).toEqual(
          '654a299fae38d86c5c0b790e',
        );
      });
  });

  it(' Customer get product list by rete average desc sort', async () => {
    return agent(app.getHttpServer())
      .get(`/products?sort=rateAverage.desc`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.items[0]._id).toEqual(
          '654a299fae38d86c5c0b7910',
        );
      });
  });
});
