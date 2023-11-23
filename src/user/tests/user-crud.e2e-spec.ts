import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';
import { userErrorMessages } from '../errors';

describe(' User CRUD ', () => {
  beforeAll(baseBeforeAll);

  afterAll(baseAfterAll);

  let userId;
  it(' User create', async () => {
    return agent(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'John',
        lastName: 'Smith',
        password: '123123',
        email: 'john.smith@test.com',
      })
      .expect(201)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.firstName).toEqual('John');
        expect(resultObject.payload.password).toBeUndefined();
        userId = resultObject.payload.id;
      });
  });

  it(' User detail', async () => {
    return agent(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.firstName).toEqual('John');
        expect(resultObject.payload.lastName).toEqual('Smith');
        expect(resultObject.payload.email).toEqual('john.smith@test.com');
        expect(resultObject.payload.password).toBeUndefined();
      });
  });

  it(' User detail with wrong id', async () => {
    return agent(app.getHttpServer())
      .get(`/users/1222`)
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          userErrorMessages.NOT_FOUND.message,
        );
      });
     
  });

  it(' User update', async () => {
    return agent(app.getHttpServer())
      .put(`/users/${userId}`)
      .send({ firstName: 'Jonathon' })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.firstName).toEqual('Jonathon');
      });
  });

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

  it(' User update avatar', async () => {
    return agent(app.getHttpServer())
      .put(`/users/${userId}`)
      .send({ avatarImageId: mediaId })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.avatarUrl).toEqual('fake-url');
      });
  });
});
