import { User } from '@prisma/client';

export interface GooglePayload {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface JwtPayload extends User {
  iat: number;
  exp: number;
}
