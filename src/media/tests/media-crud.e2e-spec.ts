import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';

describe(' Media CRUD ', () => {
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
        mediaId = resultObject.payload.id;
      });
  });
  
});
