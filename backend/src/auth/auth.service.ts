/* eslint-disable @typescript-eslint/no-unused-vars */
import * as nodemailer from 'nodemailer';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Res,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { Role, UserDocument } from '../user/user.schema';
import * as crypto from 'crypto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: process.env.SMTP_PORT ?? 587,
      secure: false,
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async generateJwt(id: string, role?: string): Promise<string> {
    const payload = { id, role };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '6h',
    });
  }

  private generateOtp(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to,
      subject,
      text,
      html: `<h1>${text}</h1>`,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestException('Failed to send email.');
    }
  }

  async sendOtpMail(email: string, otp: string) {
    this.sendMail(
      email,
      `Email Verification`,
      `Your email verification token: ${otp}`,
    );
  }

  private async addCookie(res: Response, cookieKey: string, id: string, role?: Role) {
    const verificationTokenCookies = await this.generateJwt(id, role);
    res.cookie(cookieKey, verificationTokenCookies, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 21600000,
      sameSite: 'strict',
    });
  }

  GetIdFromToken(token: string) {
    return this.jwtService.verify(token, {secret: process.env.JWT_SECRET}).id;
  }

  async register(userDto: any): Promise<any> {
    const { name, email, password, role } = userDto;
  
    if (![Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN].includes(role)) {
      console.log("Invalid role:", role);
      throw new BadRequestException('Invalid role specified.');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    userDto.password = hashedPassword;
    userDto.isVerified = role !== Role.STUDENT; 
  
    userDto.name = name; // Save name to user document
    userDto.role = role; // Save the selected role
  
    let newUser;
    try {
      console.log("Attempting to create user:", userDto);
      newUser = await this.userService.create(userDto);
      console.log("User created successfully:", newUser);
    } catch (e) {
      const error: string = e.errorResponse.errmsg;
      console.error(error);
      const errorMsg: string = error.includes('email_1') ? 'Email already exists.': 'Username already exists.'
      throw new BadRequestException(errorMsg);
    }
    if (!newUser) {
      console.log("User creation failed.");
      throw new InternalServerErrorException('Error registering account.');
    }
  
    return {status: 'Success'};
  }
  async login(
    credentials: any,
    req: Request,
    res: Response,
  ): Promise<any> {
    const { email, password } = credentials;

    const user = email.includes('@')? (await this.userService.findByEmail(email)) as UserDocument : 
      (await this.userService.findByUsername(email)) as UserDocument;
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials.');

    this.addCookie(res, "verification_token", user._id.toString(), user.role);

    if (user.role !== Role.ADMIN && !user.isVerified) {
      const otp = this.generateOtp();
      const hashedOtp = await bcrypt.hash(otp, 10);
      this.userService.update(user._id.toString(), { otp: hashedOtp });
      this.sendOtpMail(user.email, otp);
      throw new UnauthorizedException({
        message: 'email_verification_required'
      });
    }

    return { message: 'Logged in successfully.' };
  }

  async verifyEmail(token: string, otp: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const id = decoded.id;

      const user = await this.userService.findById(id);
      if (!user) throw new BadRequestException('Invalid verification token.');

      if (user.isVerified) {
        throw new BadRequestException('Email already verified.');
      }

      const isOtpValid = await bcrypt.compare(otp, user.otp);
      if (!isOtpValid) {
        throw new BadRequestException('Invalid verification credentials.');
      }

      await this.userService.update(id, { isVerified: true, otp: null });

      return { message: 'Email verified successfully.' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Verification failed.');
    }
  }

  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    res.clearCookie('verification_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully.' };
  }

  async decodeRole(token: string): Promise<{role: string}> {
     if (!token) {
      throw new UnauthorizedException('Verification token not found.');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, 
      });

      return {role: decoded.role};
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
