import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Payment } from '../entities/payment.entity';
import { PaymentError } from '../errors';
import { IPaypalPurchaseUnit, IPaypalResponse } from '../interfaces';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  accessToken = null;

  public async getPaymentLink(orderId: number): Promise<string> {
    try {
      const foundPayment = await this.paymentRepository.findOneBy({ orderId });
      if (foundPayment) {
        const link = foundPayment.responses[0].links.find(
          (link) => link.rel == 'payer-action',
        );
        return link.href;
      }
      // const order = await this.orderRepository.findOneBy({ id: orderId });
      // if (!order) throw new Error(OrderError.ORDER_NOT_FOUND);
      const referenceId = randomUUID();
      const newResponse = await this.registerNewPayment([
        {
          reference_id: referenceId,
          amount: { currency_code: 'USD', value: '10.00' },
        },
      ]);

      const newPayment = new Payment();
      newPayment.paymentId = newResponse.id;
      newPayment.referenceId = referenceId;
      newPayment.responses = [newResponse];
      newPayment.orderId = orderId;
      newPayment.intent = 'CAPTURE';
      newPayment.status = 'PAYER_ACTION_REQUIRED';
      newPayment.currencyCode = 'USD';
      newPayment.value = 10;

      await this.paymentRepository.save(newPayment);
      const link = newResponse.links.find((link) => link.rel == 'payer-action');
      return link.href;
    } catch (e) {
      console.log(e);
    }
  }

  private async registerNewPayment(
    purchase_units: IPaypalPurchaseUnit[],
  ): Promise<IPaypalResponse> {
    if (!this.accessToken) {
      this.accessToken = await this.getToken();
    }
    return this.httpService.axiosRef
      .post(
        this.configService.get('PAYPAL_BASE_URL') + '/v2/checkout/orders',
        {
          intent: 'CAPTURE',
          purchase_units,
          payment_source: {
            paypal: {
              experience_context: {
                payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                brand_name: this.configService.get('BRAND_NAME'),
                locale: 'en-US',
                landing_page: 'LOGIN',
                user_action: 'PAY_NOW',
                return_url: this.configService.get('PAYPAL_RETURN_URL'),
                cancel_url: this.configService.get('PAYPAL_CANCEL_URL'),
              },
            },
          },
        },
        {
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken,
          },
        },
      )
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch(async (error) => {
        if (error.response.status === 401) {
          this.accessToken = await this.getToken();
          return this.registerNewPayment(purchase_units);
        }
      });
  }

  private async getToken() {
    const base64Credential = Buffer.from(
      this.configService.get('PAYPAL_CLIENT_ID') +
        ':' +
        this.configService.get('PAYPAL_CLIENT_SECRET'),
    ).toString('base64');
    return this.httpService.axiosRef
      .post(
        `${this.configService.get('PAYPAL_BASE_URL')}/v1/oauth2/token`,
        { grant_type: 'client_credentials' },
        {
          headers: {
            Authorization: 'Basic ' + base64Credential,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then((res) => {
        return res.data.access_token;
      });
  }

  public async updateOrderStatus(paymentId: string) {
    const payment = await this.paymentRepository.findOneBy({ paymentId });
    if (!payment) throw new Error(PaymentError.PAYMENT_NOT_FOUND);

    const response = await this.getOrderStatus(paymentId);
    payment.responses.push(response);
    payment.intent = response.intent;
    payment.status = response.status;
    if (response.status == 'APPROVED') {
      const captureResponse = await this.capturePayment(paymentId);
      payment.responses.push(captureResponse);
      payment.intent = captureResponse.intent;
      payment.status = captureResponse.status;
    }
    await this.paymentRepository.save(payment);
    return response.purchase_units;
  }

  private async getOrderStatus(paymentId: string): Promise<IPaypalResponse> {
    if (!this.accessToken) {
      this.accessToken = await this.getToken();
    }
    return this.httpService.axiosRef
      .get(
        this.configService.get('PAYPAL_BASE_URL') +
          '/v2/checkout/orders/' +
          paymentId,
        {
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken,
          },
        },
      )
      .then(async (res) => {
        console.log(res.data);
        return res.data;
      })
      .catch(async (error) => {
        if (error.response.status === 401) {
          this.accessToken = await this.getToken();
          return this.getOrderStatus(paymentId);
        }
      });
  }

  private async capturePayment(paymentId: string): Promise<IPaypalResponse> {
    if (!this.accessToken) {
      this.accessToken = await this.getToken();
    }
    return this.httpService.axiosRef
      .post(
        this.configService.get('PAYPAL_BASE_URL') +
          '/v2/checkout/orders/' +
          paymentId +
          '/capture',
        {},
        {
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'en_US',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.accessToken,
          },
        },
      )
      .then((res) => {
        console.log(res.data);
        return res.data;
      })
      .catch(async (error) => {
        if (error.response.status === 401) {
          this.accessToken = await this.getToken();
          return this.capturePayment(paymentId);
        }
      });
  }
}
