import { agent } from 'supertest';
import { app, baseAfterAll, baseBeforeAll } from '../../../test/base_e2e_spec';
import { VariableTypeErrorMessages } from '../errors';

describe(' Variable Type CRUD ', () => {
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

  let variableTypeId;
  it(' Variable Type create', async () => {
    return (
      agent(app.getHttpServer())
        .post('/variable-types')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'color',
          values: [{ name: 'blue', value: '#10ee10' }],
        })
        .expect(201)
        .then((result) => {
          const resultObject = JSON.parse(result.text);
          expect(resultObject.payload.title).toEqual('color');
          variableTypeId=resultObject.payload._id;
        })
    );
  });

  it(' Variable Type list', async () => {
    return agent(app.getHttpServer())
      .get('/variable-types')
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload[0].title).toEqual('Color');
      });
  });

  it(' Variable Type detail', async () => {
    return agent(app.getHttpServer())
      .get(`/variable-types/${variableTypeId}`)
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('color');
      });
  });

  it(' Variable Type update', async () => {
    return agent(app.getHttpServer())
      .put(`/variable-types/${variableTypeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Color',
    })
      .expect(200)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.payload.title).toEqual('Color');
      });
  });

  it(' Variable Type delete', async () => {
    return agent(app.getHttpServer())
      .delete(`/variable-types/${variableTypeId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });

  it(' Variable Type detail', async () => {
    return agent(app.getHttpServer())
      .get(`/variable-types/${variableTypeId}`)
      .expect(404)
      .then((result) => {
        const resultObject = JSON.parse(result.text);
        expect(resultObject.meta.message).toEqual(
          VariableTypeErrorMessages.VARIABLE_TYPE_NOT_FOUND.message,
        );
      });
  });
});
