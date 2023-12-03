import { Test, TestingModule } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs/promises';
import { AppModule } from '../src/app.module';

import { ConfigService } from '@nestjs/config';
import mongoose, { Mongoose } from 'mongoose';
import { ProductSchema } from '../src/catalog/models/product.model';
import { Connection } from 'typeorm';
import { BrandSchema } from '../src/catalog/models/brand.model';
import { CategorySchema } from '../src/catalog/models/category.model';
import { VariableTypeSchema } from '../src/catalog/models/variable-type.model';
import { MediaSchema } from '../src/media/models/media.model';
import { StorageService } from '../src/media/services/storage.service';
export let app: INestApplication;
let mongoDbConnection: Mongoose;

const storageService = {
  uploadPublicFile: async (
    filename: string,
    localPath: string,
    folder: string,
  ) => {
    return { Location: 'fake-url' };
  },

  getPrivateFile: async (Key: string) => {
    const testImage = './test/nob.jpg';
    return fs.readFile(testImage);
  },

  uploadPrivateFile: async (
    filename: string,
    localPath: string,
    folder: string,
  ) => {
    return { Location: 'fake-url', key: 'fake-key' };
  },
  checkPublicFileExist: async () => {
    return null;
  },
};
export const baseBeforeAll = async () => {
  const configService = new ConfigService();
  mongoDbConnection = await mongoose.connect(configService.get('MONGODB_URL'), {
    dbName: configService.get('MONGODB_DB_NAME'),
  });

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(StorageService)
    .useValue(storageService)
    .compile();
  app = moduleFixture.createNestApplication();
  await initDb();

  await app.init();
};

export const baseAfterAll = async () => {
  await sleep(100);
  await mongoDbConnection.connection.collection('categories').drop();
  await mongoDbConnection.connection.collection('brands').drop();
  await mongoDbConnection.connection.collection('medias').drop();
  await mongoDbConnection.connection.collection('products').drop();
  await mongoDbConnection.connection.collection('variabletypes').drop();
  if (app) await app.close();
};

const hash = async (text: string) => {
  const SALT_ROUND = 10;
  return bcrypt.hash(text, SALT_ROUND);
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function initDb() {
  await mongoDbConnection.model('categories', CategorySchema).insertMany([
    {
      _id: '626955e809a5665331a6d083',
      title: 'Granola',
    },
    {
      _id: '6252a2e5856d55aeb128e921',
      title: 'burger',
    },
    {
      _id: '6278def551749313a02d53dc',

      title: 'Beef Burgers',
    },
    {
      _id: '6278df0351749313a02d53e2',

      title: 'Sweet Strawberry Smoothie',
    },
    {
      _id: '6278df0f51749313a02d53ea',

      title: 'Lattice Apple Pie',
    },
    {
      _id: '6278df1c51749313a02d53f4',

      title: 'Sour Cream, Light',
    },
    {
      _id: '6278df2b51749313a02d5400',

      title: 'Sandwich, Grilled Chicken',
    },
    {
      _id: '6278df3551749313a02d5406',

      title: 'Pizza Snacks, Pepperoni & Bacon',
    },
    {
      _id: '6278df4151749313a02d540c',

      title: 'Tomatoes, Stewed Italian',
    },
    {
      _id: '6278df5551749313a02d5418',

      title: 'Orange Juice',
    },
    {
      _id: '6278df6051749313a02d5422',

      title: 'Peanuts, Brittle 8 Oz',
    },
    {
      _id: '6278df6c51749313a02d542a',

      title: 'Energy Drink',
    },
    {
      _id: '6278df7851749313a02d5432',

      title: 'Potato Chips, Lightly Salted',
    },
    {
      _id: '6278df9751749313a02d5442',

      title: 'Buffalo-Style Chicken Strips',
    },
    {
      _id: '6278dfa351749313a02d544c',

      title: 'Spreadable Cheese, Parmesan With Garlic & Herbs',
    },
    {
      _id: '6278dfae51749313a02d5452',

      title: 'Spinach',
    },
  ]);

  await mongoDbConnection.model('brands', BrandSchema).insertMany([
    {
      _id: '626955e809a5665331a6d073',
      title: 'Adidas',
    },
    {
      _id: '6252a2e5856d55aeb128e961',
      title: 'Nike',
    },
    {
      _id: '6278def551749313a02d536c',
      title: 'Apple',
    },
  ]);

  await mongoDbConnection.model('medias', MediaSchema).insertMany([
    {
      _id: '626955e809a5665331a6d023',

      url: 'string',
      originalName: 'string',
      obfuscatedName: 'string',
      mimeType: 'jpg',
      size: 1234,
      creatorId: 0,
      storage: 's3',
      type: 'image',
    },
    {
      _id: '6252a2e5856d55aeb128e924',

      url: 'string',
      originalName: 'string',
      obfuscatedName: 'string',
      mimeType: 'jpg',
      size: 1234,
      creatorId: 0,
      storage: 's3',
      type: 'image',
    },
    {
      _id: '6278def551749313a02d5325',

      url: 'string',
      originalName: 'string',
      obfuscatedName: 'string',
      mimeType: 'jpg',
      size: 1234,
      creatorId: 0,
      storage: 's3',
      type: 'image',
    },
  ]);

  await mongoDbConnection
    .model('variabletypes', VariableTypeSchema)
    .insertMany([
      {
        _id: '626955e809a5665331a6d453',
        title: 'Color',
        values: [
          { name: 'blue', value: '#1010ee' },
          { name: 'red', value: '#ee1010' },
          { name: 'green', value: '#10ee10' },
        ],
      },
      {
        _id: '6252a2e5856d55aeb128e454',
        title: 'Size',
        values: [
          { name: 'S', value: 'S' },
          { name: 'M', value: 'M' },
          { name: 'L', value: 'L' },
          { name: 'XL', value: 'XL' },
        ],
      },
    ]);
  const productsBulk = [
    {
      _id: '654a299fae38d86c5c0b790e',
      name: 'product test',
      description: 'description of product test',
      brand: {
        title: 'Updated brand title',
        _id: '626955e809a5665331a6d073',
        createdAt: '2023-11-07T12:12:22.290Z',
        updatedAt: '2023-11-07T12:12:22.290Z',
      },
      categories: [
        {
          _id: '6278dfae51749313a02d5452',
          title: 'Running',
          createdAt: '2023-11-07T12:12:20.453Z',

          updatedAt: '2023-11-07T12:12:20.683Z',
        },
        {
          _id: '6278dfa351749313a02d544c',
          title: 'Spreadable Cheese, Parmesan With Garlic & Herbs',
          createdAt: '2023-11-07T12:12:14.984Z',
          updatedAt: '2023-11-07T12:12:14.984Z',
        },
      ],
      images: [
        {
          id: '654a299fae38d86c5c0b78fb',
          url: 'fake-url',
          size: 8275,
        },
      ],
      attributes: [],
      skus: [
        {
          _id: '654a299fae38d86c5c0b7902',
          name: 'updated name',
          price: 100,
          quantity: 100,
          variants: [
            {
              title: 'Back Color',
              value: {
                name: 'blue',
                value: '#1010ee',
              },
              type: {
                _id: '626955e809a5665331a6d453',
                title: 'Color',
                values: [
                  {
                    name: 'blue',
                    value: '#1010ee',
                  },
                  {
                    name: 'red',
                    value: '#ee1010',
                  },
                  {
                    name: 'green',
                    value: '#10ee10',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
            {
              title: 'Size',
              value: {
                name: 'L',
                value: 'L',
              },
              type: {
                _id: '6252a2e5856d55aeb128e454',
                title: 'Size',
                values: [
                  {
                    name: 'S',
                    value: 'S',
                  },
                  {
                    name: 'M',
                    value: 'M',
                  },
                  {
                    name: 'L',
                    value: 'L',
                  },
                  {
                    name: 'XL',
                    value: 'XL',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
          ],
          images: [
            {
              id: '654a299fae38d86c5c0b78fb',
              url: 'fake-url',
              size: 8275,
            },
          ],
          createdAt: '2023-11-07T12:12:15.230Z',

          updatedAt: '2023-11-07T12:12:15.230Z',
        },
        {
          _id: '654a299fae38d86c5c0b7903',
          name: 'string',
          price: 50,
          quantity: 100,
          variants: [
            {
              title: 'Back Color',
              value: {
                name: 'red',
                value: '#ee1010',
              },
              type: {
                _id: '626955e809a5665331a6d453',
                title: 'Color',
                values: [
                  {
                    name: 'blue',
                    value: '#1010ee',
                  },
                  {
                    name: 'red',
                    value: '#ee1010',
                  },
                  {
                    name: 'green',
                    value: '#10ee10',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
            {
              title: 'Size',
              value: {
                name: 'L',
                value: 'L',
              },
              type: {
                _id: '6252a2e5856d55aeb128e454',
                title: 'Size',
                values: [
                  {
                    name: 'S',
                    value: 'S',
                  },
                  {
                    name: 'M',
                    value: 'M',
                  },
                  {
                    name: 'L',
                    value: 'L',
                  },
                  {
                    name: 'XL',
                    value: 'XL',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
          ],
          images: [
            {
              id: '654a299fae38d86c5c0b78fb',
              url: 'fake-url',
              size: 8275,
            },
          ],
          createdAt: '2023-11-07T12:12:15.231Z',

          updatedAt: '2023-11-07T12:12:15.231Z',
        },
        {
          _id: '654a299fae38d86c5c0b7904',
          name: 'string',
          price: 110,
          quantity: 100,
          variants: [
            {
              title: 'Back Color',
              value: {
                name: 'blue',
                value: '#1010ee',
              },
              type: {
                _id: '626955e809a5665331a6d453',
                title: 'Color',
                values: [
                  {
                    name: 'blue',
                    value: '#1010ee',
                  },
                  {
                    name: 'red',
                    value: '#ee1010',
                  },
                  {
                    name: 'green',
                    value: '#10ee10',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
            {
              title: 'Size',
              value: {
                name: 'XL',
                value: 'XL',
              },
              type: {
                _id: '6252a2e5856d55aeb128e454',
                title: 'Size',
                values: [
                  {
                    name: 'S',
                    value: 'S',
                  },
                  {
                    name: 'M',
                    value: 'M',
                  },
                  {
                    name: 'L',
                    value: 'L',
                  },
                  {
                    name: 'XL',
                    value: 'XL',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
          ],
          images: [
            {
              id: '654a299fae38d86c5c0b78fb',
              url: 'fake-url',
              size: 8275,
            },
          ],
          createdAt: '2023-11-07T12:12:15.236Z',

          updatedAt: '2023-11-07T12:12:15.236Z',
        },
        {
          _id: '654a299fae38d86c5c0b7905',
          name: 'string',
          price: 130,
          quantity: 100,
          variants: [
            {
              title: 'Back Color',
              value: {
                name: 'red',
                value: '#ee1010',
              },
              type: {
                _id: '626955e809a5665331a6d453',
                title: 'Color',
                values: [
                  {
                    name: 'blue',
                    value: '#1010ee',
                  },
                  {
                    name: 'red',
                    value: '#ee1010',
                  },
                  {
                    name: 'green',
                    value: '#10ee10',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
            {
              title: 'Size',
              value: {
                name: 'XL',
                value: 'XL',
              },
              type: {
                _id: '6252a2e5856d55aeb128e454',
                title: 'Size',
                values: [
                  {
                    name: 'S',
                    value: 'S',
                  },
                  {
                    name: 'M',
                    value: 'M',
                  },
                  {
                    name: 'L',
                    value: 'L',
                  },
                  {
                    name: 'XL',
                    value: 'XL',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
          ],
          images: [
            {
              id: '654a299fae38d86c5c0b78fb',
              url: 'fake-url',
              size: 8275,
            },
          ],
          createdAt: '2023-11-07T12:12:15.229Z',
          updatedAt: '2023-11-07T12:12:15.229Z',
        },
        {
          _id: '654a299fae38d86c5c0b7915',
          name: 'new sku',
          price: 90,
          quantity: 100,
          variants: [
            {
              title: 'Back Color',
              value: {
                name: 'green',
                value: '#1010ee',
              },
              type: {
                _id: '626955e809a5665331a6d453',
                title: 'Color',
                values: [
                  {
                    name: 'blue',
                    value: '#1010ee',
                  },
                  {
                    name: 'red',
                    value: '#ee1010',
                  },
                  {
                    name: 'green',
                    value: '#10ee10',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
            {
              title: 'Size',
              value: {
                name: 'XL',
                value: 'XL',
              },
              type: {
                _id: '6252a2e5856d55aeb128e454',
                title: 'Size',
                values: [
                  {
                    name: 'S',
                    value: 'S',
                  },
                  {
                    name: 'M',
                    value: 'M',
                  },
                  {
                    name: 'L',
                    value: 'L',
                  },
                  {
                    name: 'XL',
                    value: 'XL',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
          ],
          images: [
            {
              id: '654a299fae38d86c5c0b78fb',
              url: 'fake-url',
              size: 8275,
            },
          ],
          createdAt: '2023-11-07T12:12:15.259Z',

          updatedAt: '2023-11-07T12:12:15.259Z',
        },
      ],
      createdAt: '2023-11-07T12:12:15.239Z',
      updatedAt: '2023-11-07T12:12:22.290Z',
    },
    {
      _id: '654a299fae38d86c5c0b7910',
      name: 'product test 2 nfound',
      description: 'description of product test dfound',
      brand: {
        title: 'Updated brand title',
        _id: '626955e809a5665331a6d073',
        createdAt: '2023-11-07T12:12:22.290Z',
        updatedAt: '2023-11-07T12:12:22.290Z',
      },
      categories: [
        {
          _id: '6278df7851749313a02d5432',
          title: 'Potato Chips, Lightly Salted',
          createdAt: '2023-11-07T12:12:20.453Z',
          updatedAt: '2023-11-07T12:12:20.683Z',
        },
      ],
      images: [
        {
          id: '654a299fae38d86c5c0b78fb',
          url: 'fake-url',
          size: 8275,
        },
      ],
      attributes: [],
      skus: [
        {
          _id: '654a299fae38d86c5c0b8902',
          name: 'updated name',
          price: 100,
          quantity: 100,
          variants: [
            {
              title: 'Back Color',
              value: {
                name: 'blue',
                value: '#1010ee',
              },
              type: {
                _id: '626955e809a5665331a6d453',
                title: 'Color',
                values: [
                  {
                    name: 'blue',
                    value: '#1010ee',
                  },
                  {
                    name: 'red',
                    value: '#ee1010',
                  },
                  {
                    name: 'green',
                    value: '#10ee10',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
            {
              title: 'Size',
              value: {
                name: 'L',
                value: 'L',
              },
              type: {
                _id: '6252a2e5856d55aeb128e454',
                title: 'Size',
                values: [
                  {
                    name: 'S',
                    value: 'S',
                  },
                  {
                    name: 'M',
                    value: 'M',
                  },
                  {
                    name: 'L',
                    value: 'L',
                  },
                  {
                    name: 'XL',
                    value: 'XL',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
          ],
          images: [
            {
              id: '654a299fae38d86c5c0b78fb',
              url: 'fake-url',
              size: 8275,
            },
          ],
          createdAt: '2023-11-07T12:12:15.230Z',

          updatedAt: '2023-11-07T12:12:15.230Z',
        },
        {
          _id: '654a299fae38d86c5c0b8903',
          name: 'string',
          price: 50,
          quantity: 100,
          variants: [
            {
              title: 'Back Color',
              value: {
                name: 'red',
                value: '#ee1010',
              },
              type: {
                _id: '626955e809a5665331a6d453',
                title: 'Color',
                values: [
                  {
                    name: 'blue',
                    value: '#1010ee',
                  },
                  {
                    name: 'red',
                    value: '#ee1010',
                  },
                  {
                    name: 'green',
                    value: '#10ee10',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
            {
              title: 'Size',
              value: {
                name: 'L',
                value: 'L',
              },
              type: {
                _id: '6252a2e5856d55aeb128e454',
                title: 'Size',
                values: [
                  {
                    name: 'S',
                    value: 'S',
                  },
                  {
                    name: 'M',
                    value: 'M',
                  },
                  {
                    name: 'L',
                    value: 'L',
                  },
                  {
                    name: 'XL',
                    value: 'XL',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
          ],
          images: [
            {
              id: '654a299fae38d86c5c0b78fb',
              url: 'fake-url',
              size: 8275,
            },
          ],
          createdAt: '2023-11-07T12:12:15.231Z',

          updatedAt: '2023-11-07T12:12:15.231Z',
        },
        {
          _id: '654a299fae38d86c5c0b8904',
          name: 'string',
          price: 110,
          quantity: 100,
          variants: [
            {
              title: 'Back Color',
              value: {
                name: 'blue',
                value: '#1010ee',
              },
              type: {
                _id: '626955e809a5665331a6d453',
                title: 'Color',
                values: [
                  {
                    name: 'blue',
                    value: '#1010ee',
                  },
                  {
                    name: 'red',
                    value: '#ee1010',
                  },
                  {
                    name: 'green',
                    value: '#10ee10',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
            {
              title: 'Size',
              value: {
                name: 'XL',
                value: 'XL',
              },
              type: {
                _id: '6252a2e5856d55aeb128e454',
                title: 'Size',
                values: [
                  {
                    name: 'S',
                    value: 'S',
                  },
                  {
                    name: 'M',
                    value: 'M',
                  },
                  {
                    name: 'L',
                    value: 'L',
                  },
                  {
                    name: 'XL',
                    value: 'XL',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
          ],
          images: [
            {
              id: '654a299fae38d86c5c0b78fb',
              url: 'fake-url',
              size: 8275,
            },
          ],
          createdAt: '2023-11-07T12:12:15.236Z',

          updatedAt: '2023-11-07T12:12:15.236Z',
        },
        {
          _id: '654a299fae38d86c5c0b8905',
          name: 'string',
          price: 130,
          quantity: 100,
          variants: [
            {
              title: 'Back Color',
              value: {
                name: 'red',
                value: '#ee1010',
              },
              type: {
                _id: '626955e809a5665331a6d453',
                title: 'Color',
                values: [
                  {
                    name: 'blue',
                    value: '#1010ee',
                  },
                  {
                    name: 'red',
                    value: '#ee1010',
                  },
                  {
                    name: 'green',
                    value: '#10ee10',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
            {
              title: 'Size',
              value: {
                name: 'XL',
                value: 'XL',
              },
              type: {
                _id: '6252a2e5856d55aeb128e454',
                title: 'Size',
                values: [
                  {
                    name: 'S',
                    value: 'S',
                  },
                  {
                    name: 'M',
                    value: 'M',
                  },
                  {
                    name: 'L',
                    value: 'L',
                  },
                  {
                    name: 'XL',
                    value: 'XL',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
          ],
          images: [
            {
              id: '654a299fae38d86c5c0b78fb',
              url: 'fake-url',
              size: 8275,
            },
          ],
          createdAt: '2023-11-07T12:12:15.229Z',
          updatedAt: '2023-11-07T12:12:15.229Z',
        },
        {
          _id: '654a299fae38d86c5c0b8915',
          name: 'new sku',
          price: 90,
          quantity: 100,
          variants: [
            {
              title: 'Back Color',
              value: {
                name: 'green',
                value: '#1010ee',
              },
              type: {
                _id: '626955e809a5665331a6d453',
                title: 'Color',
                values: [
                  {
                    name: 'blue',
                    value: '#1010ee',
                  },
                  {
                    name: 'red',
                    value: '#ee1010',
                  },
                  {
                    name: 'green',
                    value: '#10ee10',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
            {
              title: 'Size',
              value: {
                name: 'XL',
                value: 'XL',
              },
              type: {
                _id: '6252a2e5856d55aeb128e454',
                title: 'Size',
                values: [
                  {
                    name: 'S',
                    value: 'S',
                  },
                  {
                    name: 'M',
                    value: 'M',
                  },
                  {
                    name: 'L',
                    value: 'L',
                  },
                  {
                    name: 'XL',
                    value: 'XL',
                  },
                ],
                createdAt: '2023-11-07T12:12:15.025Z',
                updatedAt: '2023-11-07T12:12:15.025Z',
              },
            },
          ],
          images: [
            {
              id: '654a299fae38d86c5c0b78fb',
              url: 'fake-url',
              size: 8275,
            },
          ],
          createdAt: '2023-11-07T12:12:15.259Z',

          updatedAt: '2023-11-07T12:12:15.259Z',
        },
      ],
      createdAt: '2023-11-07T12:12:15.239Z',
      updatedAt: '2023-11-07T12:12:22.290Z',
    },
  ];
  await mongoDbConnection
    .model('products', ProductSchema)
    .insertMany(productsBulk);

  const connection = app.get(Connection);
  const queryRunner = connection.driver.createQueryRunner('master');
  const passHash = await hash('123123');
  await queryRunner.query(`
  INSERT INTO user(id, createdAt, updatedAt, deletedAt, firstName, lastName, email,password,roles) VALUES 
  ('1','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'superAdmin','superAdmin','admin@test.com','${passHash}','Admin'),
  ('2','2022-11-04 01:02:08.265533','2022-11-04 01:02:08.265533',NULL,'user','user','user@test.com','${passHash}','User'),
  ('3','2022-11-04 01:02:08.265533','2022-11-04 01:02:08.265533',NULL,'user2','user2','user2@test.com','${passHash}','User');
  `);
  await queryRunner.query(`
  INSERT INTO warehouse(id, createdAt, updatedAt, deletedAt, name) VALUES 
  ('1','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'Main'),
  ('2','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'one'),
  ('3','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'two'),
  ('4','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'three'),
  ('5','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'four'),
  ('6','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',NULL,'five');
  `);

  await queryRunner.query(`
  INSERT INTO delivery_cost(id, createdAt, updatedAt, warehouseId, areaId, cost) VALUES 
  ('1','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',1,1,2),
  ('2','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',1,2,3),
  ('3','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',1,3,3),
  ('4','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',2,2,2),
  ('5','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',2,3,4),
  ('6','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',3,1,6);
  `);

  const inventoriesBulkQuery = [];
  const skusList = productsBulk
    .map((product) => product.skus)
    .flat(1)
    .map((sku) => sku._id);
  for (let warehouseId = 1; warehouseId < 7; warehouseId++) {
    for (let j = 0; j < 1000; j++) {
      const skuId = skusList[j % skusList.length];
      inventoriesBulkQuery.push(
        `('2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',${warehouseId},'${skuId}')`,
      );
    }
  }
  await queryRunner.query(`
  INSERT INTO inventory( createdAt, updatedAt, warehouseId, skuId) VALUES 
  ${inventoriesBulkQuery.join(',')}
  ;
  `);
}
