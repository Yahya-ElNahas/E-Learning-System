import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {
        super({
        jwtFromRequest: (req: Request) => {
            return req.cookies['verification_token']; 
        },
        secretOrKey: process.env.JWT_SECRET, 
        });
    }

    async validate(payload: any): Promise<any> {
        return this.userService.findById(payload.id); 
  }
}
