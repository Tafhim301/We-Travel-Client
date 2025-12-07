import jwt from "jsonwebtoken";

export function verify(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    role: "USER" | "ADMIN";
  };
}
