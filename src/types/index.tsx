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
