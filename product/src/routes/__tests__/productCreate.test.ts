import request from 'supertest';
import { app } from '../../app';
import Product from '../../models/product';
import NatsService from '../../services/NatsService';

const description = 'new description new description \
                     new description new description \
                     new description new description \
                     new description new description';


const sendRequest = async (body: any, status: number) => {
   await request(app)
      .post('/api/product')
      .set('Authorization', global.signin())
      .send(body)
      .expect(status);    
}

it('POST:/api/product --> Unauthorized', async () => {
   await request(app)
            .post('/api/product')
            .send({})
            .expect(401);
});

it('POST:/api/product --> Success', async () => {
   const body = {
      price: 500,
      description,
      title: 'new title',
      placeholder: 'new placeholder',
   };

   await sendRequest(body, 200);
   
   const data = await Product.find({})
   expect(data.length).toEqual(1)
   const product = data[0]
   expect(product.price).toEqual(body.price)
   expect(product.title).toEqual(body.title)
   expect(product.placeholder).toEqual(body.placeholder)
   expect(product.description).toEqual(body.description)
   expect(NatsService.client?.publish).toHaveBeenCalled()
});


it('POST:/api/product --> Wrong and Missing Title', async () => {
   const body1 = {
      title: '',
      price: 500,
      description,
      placeholder: 'new placeholder',
   };

   const body2 = {
      price: 500,
      description,
      placeholder: 'new placeholder',
   };
   
   await sendRequest(body1, 400);
   await sendRequest(body2, 400);
});


it('POST:/api/product --> Wrong and Missing Description', async () => {
   const body1 = {
      price: 500,
      title: 'new title',
      description: 'new Description',
      placeholder: 'new placeholder',
   };

   const body2 = {
      price: 500,
      title: 'new title',
      placeholder: 'new placeholder',
   };
   
   await sendRequest(body1, 400);
   await sendRequest(body2, 400);
});

it('POST:/api/product --> Wrong and Missing Description', async () => {
   const body1 = {
      price: 500,
      title: 'new title',
      description: 'new Description',
      placeholder: 'new placeholder',
   };

   const body2 = {
      price: 500,
      title: 'new title',
      placeholder: 'new placeholder',
   };
   
   await sendRequest(body1, 400);
   await sendRequest(body2, 400);
});

it('POST:/api/product --> Wrong and Missing Price', async () => {
   const body1 = {
      price: -500,
      description,
      title: 'new title',
      placeholder: 'new placeholder',
   };

   const body2 = {
      description,
      title: 'new title',
      placeholder: 'new placeholder',
   };
   
   await sendRequest(body1, 400);
   await sendRequest(body2, 400);
});

it('POST:/api/product --> Wrong and Missing Placeholder', async () => {
   const body1 = {
      price: -500,
      description,
      title: 'new title',
      placeholder: '',
   };

   const body2 = {
      price: 500,
      description,
      title: 'new title',
   };
   
   await sendRequest(body1, 400);
   await sendRequest(body2, 400);
});