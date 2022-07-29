import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenService {
  generateToken(length: number): string {
    let _token: string = "";
    const letters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i < length; i++) {
      const randNum = Math.floor(Math.random() * letters.length);
      _token += letters[randNum];
    }

    return _token;
  }
}
