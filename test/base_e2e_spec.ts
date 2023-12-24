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
      rateAverage: 2.9,
      salesCount: 18,
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
          price: 135,
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
      rateAverage: 3.9,
      salesCount: 8,
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
          price: 48,
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

  await queryRunner.query(`
  INSERT INTO country(id, createdAt, updatedAt, name, flag) VALUES 
  ('1','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680','British','flag');
  `);

  await queryRunner.query(`
  INSERT INTO state(id, createdAt, updatedAt, name, countryId, countryName) VALUES 
  ('1','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680','British',1,'British');
  `);

  await queryRunner.query(`
  INSERT INTO city(id, createdAt, updatedAt, name, countryId, countryName,stateId,stateName) VALUES 
  ('1','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680','London',1,'British',1,'British');
  `);

  await queryRunner.query(`
  INSERT INTO area(id, createdAt, updatedAt, countryId,stateId,cityId,polygon) VALUES 
  ('1','2022-11-04 01:02:08.162680','2022-11-04 01:02:08.162680',1,1,1,
'-0.267156 51.600369,-0.265732 51.599008,-0.25977 51.594173,-0.257692 51.592253,-0.252809 51.588661,-0.248286 51.584364,-0.249555 51.583839,-0.251669 51.583457,-0.254396 51.581463,-0.254632 51.579672,-0.254104 51.57807,-0.252624 51.574924,-0.251355 51.573135,-0.253132 51.572504,-0.25262 51.571536,-0.249576 51.568977,-0.247356 51.56842,-0.246053 51.569897,-0.246026 51.570898,-0.246674 51.571615,-0.242296 51.572819,-0.240951 51.572103,-0.238171 51.57179,-0.236931 51.572389,-0.236628 51.572438,-0.23451 51.571799,-0.233442 51.571979,-0.228639 51.567839,-0.226721 51.566794,-0.221963 51.562947,-0.218644 51.559411,-0.213463 51.55515,-0.2117 51.556154,-0.209968 51.55677,-0.208877 51.555734,-0.206002 51.556442,-0.205774 51.55529,-0.20056 51.556146,-0.198534 51.558156,-0.198481 51.558758,-0.196681 51.559232,-0.196939 51.560607,-0.195252 51.560503,-0.190673 51.562019,-0.189849 51.565056,-0.187194 51.566211,-0.186116 51.566939,-0.184194 51.567363,-0.183568 51.568007,-0.180183 51.569699,-0.176956 51.570189,-0.174609 51.569335,-0.173811 51.57006,-0.173074 51.571483,-0.171285 51.57243,-0.171181 51.573611,-0.169483 51.573992,-0.169755 51.5764,-0.16935 51.577418,-0.168089 51.576927,-0.166897 51.578677,-0.167208 51.581552,-0.165758 51.583251,-0.163769 51.584334,-0.162759 51.584487,-0.161088 51.585402,-0.159611 51.584513,-0.158007 51.585744,-0.158647 51.586667,-0.158644 51.588007,-0.160028 51.588464,-0.160209 51.589732,-0.159482 51.59158,-0.160269 51.593841,-0.160971 51.594831,-0.161715 51.596833,-0.161732 51.597677,-0.156774 51.604922,-0.156146 51.605103,-0.154578 51.604073,-0.153312 51.602677,-0.153469 51.600986,-0.153031 51.599229,-0.151379 51.597448,-0.147414 51.598863,-0.144496 51.600126,-0.144489 51.600553,-0.143052 51.602541,-0.142181 51.603224,-0.142216 51.60491,-0.142948 51.605929,-0.14345 51.608845,-0.138787 51.610192,-0.141417 51.612345,-0.144538 51.615484,-0.141979 51.616201,-0.141389 51.617587,-0.140641 51.617732,-0.138525 51.619514,-0.1354 51.621787,-0.133886 51.625342,-0.133842 51.62542,-0.133544 51.626344,-0.131306 51.628513,-0.131149 51.629661,-0.129163 51.632268,-0.131358 51.632577,-0.134475 51.633712,-0.134609 51.633775,-0.134638 51.63379,-0.134494 51.633907,-0.13446 51.633935,-0.134739 51.634099,-0.134591 51.634206,-0.134297 51.63442,-0.134534 51.634637,-0.1346 51.634682,-0.138334 51.636455,-0.140828 51.637978,-0.143946 51.640997,-0.145103 51.642645,-0.14792 51.642082,-0.149047 51.644178,-0.149245 51.645301,-0.151331 51.645281,-0.152168 51.645822,-0.151069 51.647205,-0.152276 51.647985,-0.149921 51.648792,-0.151021 51.650076,-0.15227 51.649846,-0.152563 51.651464,-0.153502 51.652696,-0.153699 51.654458,-0.154788 51.655531,-0.160517 51.65675,-0.162781 51.657962,-0.165044 51.658224,-0.185892 51.662832,-0.18211 51.668601,-0.185829 51.668506,-0.187815 51.667875,-0.19097 51.663982,-0.192365 51.664736,-0.196673 51.665495,-0.194879 51.668302,-0.19903 51.668203,-0.199897 51.670167,-0.203377 51.670123,-0.202633 51.669311,-0.202255 51.667802,-0.205659 51.668597,-0.207984 51.666591,-0.209864 51.667559,-0.211159 51.666952,-0.207889 51.662858,-0.212192 51.661334,-0.213526 51.662322,-0.217153 51.660616,-0.21892 51.660058,-0.219826 51.660657,-0.22607 51.657623,-0.227994 51.658472,-0.228513 51.659962,-0.229918 51.659733,-0.234252 51.658249,-0.234732 51.658997,-0.236216 51.658879,-0.238301 51.658246,-0.237996 51.657786,-0.241018 51.656832,-0.241391 51.657201,-0.244413 51.656492,-0.247891 51.655245,-0.249736 51.656168,-0.251357 51.655214,-0.249881 51.654611,-0.251075 51.649468,-0.252275 51.646561,-0.254514 51.643677,-0.256196 51.643488,-0.257357 51.641829,-0.260737 51.64267,-0.261624 51.643985,-0.263229 51.644809,-0.264016 51.643744,-0.266672 51.644044,-0.268366 51.643789,-0.268262 51.642333,-0.270216 51.642034,-0.272848 51.642061,-0.273036 51.641095,-0.274001 51.639517,-0.27402 51.638699,-0.276499 51.638865,-0.278637 51.63832,-0.281414 51.638343,-0.283899 51.637791,-0.285524 51.636945,-0.288367 51.63647,-0.289929 51.636667,-0.291891 51.636475,-0.294407 51.635647,-0.296151 51.635443,-0.297233 51.635732,-0.299428 51.635715,-0.302436 51.636351,-0.304483 51.636347,-0.305574 51.634397,-0.305415 51.633398,-0.303953 51.631464,-0.301184 51.629264,-0.299257 51.627411,-0.297276 51.625899,-0.293871 51.622806,-0.28801 51.617775,-0.287566 51.617152,-0.285309 51.615411,-0.282201 51.613356,-0.277136 51.608736,-0.276039 51.608014,-0.273808 51.605712,-0.267156 51.600369'
  );
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
