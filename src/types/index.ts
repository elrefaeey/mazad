export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface Admin {
  _id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  role: "admin";
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  imageUrl: string;
  id: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  admin: Admin;
}
