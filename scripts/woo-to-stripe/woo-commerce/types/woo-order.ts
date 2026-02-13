export interface WooOrder {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  prices_include_tax: boolean;
  customer_id: number;
  customer_ip_address: string;
  customer_user_agent: string;
  customer_note: string;
  billing: Address;
  shipping: Address;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  date_paid: string | null;
  date_paid_gmt: string | null;
  date_completed: string | null;
  date_completed_gmt: string | null;
  cart_hash: string;
  meta_data: MetaDatum[];
  line_items: LineItem[];
  tax_lines: TaxLine[];
  shipping_lines: ShippingLine[];
  fee_lines: FeeLine[];
  coupon_lines: CouponLine[];
  refunds: Refund[];
  payment_url: string;
  is_editable: boolean;
  needs_payment: boolean;
  needs_processing: boolean;
  date_created_gmt_formatted: string;
  date_modified_gmt_formatted: string;
  currency_symbol: string;
  wpo_wcpdf_invoice_number?: string;
}

export interface Address {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface MetaDatum {
  id: number;
  key: string;
  value: string | string[];
}

export interface LineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: Tax[];
  meta_data: MetaDatum[];
  sku: string;
  price: number;
  image: Image;
  parent_name: string | null;
}

export interface Image {
  id: number;
  src: string;
}

export interface Tax {
  id: number;
  total: string;
  subtotal: string;
}

export interface TaxLine {
  id: number;
  rate_code: string;
  rate_id: number;
  label: string;
  compound: boolean;
  tax_total: string;
  shipping_tax_total: string;
  rate_percent: number;
  meta_data: MetaDatum[];
}

export interface ShippingLine {
  id: number;
  method_title: string;
  method_id: string;
  instance_id: string;
  total: string;
  total_tax: string;
  taxes: Tax[];
  meta_data: MetaDatum[];
}

export interface FeeLine {
  id: number;
  name: string;
  tax_class: string;
  tax_status: string;
  amount: string;
  total: string;
  total_tax: string;
  taxes: Tax[];
  meta_data: MetaDatum[];
}

export interface CouponLine {
  id: number;
  code: string;
  discount: string;
  discount_tax: string;
  meta_data: MetaDatum[];
}

export interface Refund {
  id: number;
  reason: string;
  total: string;
}
