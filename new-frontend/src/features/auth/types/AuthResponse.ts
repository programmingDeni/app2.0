import { User } from "./User";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
}
