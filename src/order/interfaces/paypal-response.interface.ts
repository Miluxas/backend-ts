export interface IPaypalResponse {
    id: string;
    intent?:string;
    status: string;
    payment_source: any;
    links: { href: string; rel: string; method: string }[];
    purchase_units?:any[];
    payer?:{
        name:any;
        email_address:string;
        payer_id:string;
        address:any;
    };
    create_time?:string;
    update_time?:string;
  }