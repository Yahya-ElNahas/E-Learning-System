/* eslint-disable prettier/prettier */
import * as sgMail from '@sendgrid/mail';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    sgMail.setApiKey('');
  }

  async generateJwt(userId: string, email: string): Promise<string> {
    const payload = { userId, email };
    return this.jwtService.sign(payload);
  }

  async register(userDto: any): Promise<any> {
    const { email, password, role } = userDto;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    userDto.password = hashedPassword;
    userDto.isVerified = role !== 'student';

    // Create user
    const newUser = await this.userService.create(userDto);

    // If student, send verification email
    if (role === 'student') {
      const token = this.jwtService.sign({ email });

      const mailOptions = {
        from: 'drehabsaad73@gmail.com',
        to: email,
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

    const user = await this.userService.findByEmail(email) as UserDocument;
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials.');

    if (user.role === 'student' && !user.isVerified) {
      throw new BadRequestException('Email verification required.');
    }

    return { accessToken: await this.generateJwt(user._id.toString(), user.email) };
  }

  async verifyEmail(token: string, otp: string): Promise<any> {
    const decoded = this.jwtService.verify(token);
    const email = decoded.email;

    const user = await this.userService.findByEmail(email) as UserDocument;
    if (!user) throw new BadRequestException('Invalid verification token.');

    if (user.isVerified) {
      throw new BadRequestException('Email already verified.');
    }

    // Check OTP validity
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    await this.userService.update(email, { isVerified: true, otp: null });

    return { message: 'Email verified successfully.' };
  }
}