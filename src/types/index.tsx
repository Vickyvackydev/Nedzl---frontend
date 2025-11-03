import React from "react";

export interface ButtonTypeProps {
  type?: "button" | "submit";
  loading?: boolean;
  title: string;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  btnStyles: string;
  textStyle: string;
  icon?: string;
  rightarrow?: boolean;
  iconStyle?: string;
  disabled?: boolean;
}
export interface CardProps {
  id: number;
  img: string;
  topic: string;
  title: string;
  date: string;
  timeread: string;
}

export interface FormFieldTypeProps {
  type:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time";
  formFieldType: "input" | "textarea";
  value: string;
  name?: string;
  title: string;
  inputstyle: string;
  placeholder: string;
  placeholderstyle: string;
  handleChange: (
    value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export interface UserPayload {
  user_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface ProductType {
  id?: number | string;
  product_name: string;
  product_price: number;
  market_price_from: number;
  market_price_to: number;
  category_name: string;
  state: string;
  address_in_state: string;
  outstanding_issues: string;
  description: string;
  is_negotiable: boolean;
  condition: string;
  status?: string;
  image_urls: File[] | string[];
  created_at: string;
}

export interface ProductResponse {
  id: string;
  product_name: string;
  product_price: number;
  market_price_from: number;
  market_price_to: number;
  category_name: string;
  is_negotiable: boolean;
  description: string;
  state: string;
  address_in_state: string;
  outstanding_issues: string;
  image_urls: string[];
  status: "UNDER_REVIEW" | "APPROVED" | "REJECTED" | string; // extendable
  condition: "brand-new" | "used" | string;
  user_id: string;
  brand_name: string;
  user: User;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
}

export interface User {
  id: string;
  user_name: string;
  email: string;
  role: "USER" | "ADMIN" | string;
  phone_number: string;
  image_url: string;
  location: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
}

export interface StoreSettingsPayload {
  business_name: string;
  about_company: string;
  store_name: string;
  state: string;
  address: string;
  how_do_we_locate_you: string;
  business_hours_from: string;
  business_hours_to: string;
}
