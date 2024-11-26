/* eslint-disable prettier/prettier */
import * as sgMail from '@sendgrid/mail';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    sgMail.setApiKey('YOUR_SENDGRID_API_KEY'); 
  }

  async generateJwt(userId: string): Promise<string> {
    const payload = { userId }; 
    return this.jwtService.sign(payload);
  }



  async register(userDto: any): Promise<any> {
    const { email, password, role } = userDto;

   
    const hashedPassword = await bcrypt.hash(password, 10);
    userDto.password = hashedPassword;
    userDto.isVerified = role !== 'student'; 

  
    const newUser = await this.userService.create(userDto);

    
    if (role === 'student') {
      const token = this.jwtService.sign({ email });

      // Send email
      const msg = {
        to: email,
        from: 'abdelrahamanehab"gmail.com', 
        subject: 'Verify Your Email',
        text: `Your email verification token: ${token}`,
        html: `<p>Your email verification token: <strong>${token}</strong></p>`,
      };
      await sgMail.send(msg);
    }

    return newUser;
  }

  async login(credentials: any): Promise<any> {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials.');

    // Verify student email
    if (user.role === 'student' && !user.isVerified) {
      throw new BadRequestException('Email verification required.');
    }

    // Generate access token
    const payload = { email: user.email, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async verifyEmail(token: string): Promise<any> {
    const decoded = this.jwtService.verify(token);
    const email = decoded.email;

    // Verify the email
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('Invalid verification token.');

    if (user.isVerified) {
      throw new BadRequestException('Email already verified.');
    }

    await this.userService.update(email, { isVerified: true });

    return { message: 'Email verified successfully.' };
  }
}