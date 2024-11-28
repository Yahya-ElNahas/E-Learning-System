/* eslint-disable prettier/prettier */
import * as nodemailer from 'nodemailer';
import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, Res, Req } from '@nestjs/common';
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
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS,
      }
    });
  }

  private async generateJwt(id: string, role?: string): Promise<string> {
    const payload = { id, role };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }

  private generateOtp(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
  }

  async sendOtpMail(email: string, otp: string) {
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: `Email Verification`,
      text: `Your email verification token: ${otp}`,
      html: `<p>Your email verification token: <strong>${otp}</strong></p>`,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestException('Failed to send verification email.');
    }
  }

  private async addCookie(res: Response, id: string, role?: Role) {
    const verificationTokenCookies =  await this.generateJwt(id, role);
    res.cookie('verification_token', verificationTokenCookies, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 360000000, 
      sameSite: 'strict', 
    });
  }

  async register(userDto: any, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
    const { password, role } = userDto;
     
    if (![Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN].includes(role)) {
      throw new BadRequestException('Invalid role specified.');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    userDto.password = hashedPassword;
    userDto.isVerified = role === Role.ADMIN;
  
    const newUser = await this.userService.create(userDto);
    if(!newUser) throw new InternalServerErrorException("Error Registering Account");

    if (!userDto.isVerified) {
      const otp = this.generateOtp();
      const hashedOtp = await bcrypt.hash(otp, 10);
      this.userService.update(newUser._id.toString(), { otp: hashedOtp });
      this.sendOtpMail(newUser.email, otp);
    }

    const verificationToken = await this.generateJwt(newUser._id.toString());

    return {
      status: "success",
      verificationToken: verificationToken
    };
  }

  async login(credentials: any, @Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
    const { email, password } = credentials;
  
    const user = await this.userService.findByEmail(email) as UserDocument;
    if (!user) throw new UnauthorizedException('Invalid credentials.');
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials.');
  
    if (user.role === Role.STUDENT && !user.isVerified) {
      const otp = this.generateOtp();
      const hashedOtp = await bcrypt.hash(otp, 10);
      this.userService.update(user._id.toString(), { otp: hashedOtp });
      this.sendOtpMail(user.email, otp);
      const verificationToken = await this.generateJwt(user._id.toString());
      throw new UnauthorizedException({
        message: 'Email verification required.',
        verificationToken,
      });
    }

    this.addCookie(res, user._id.toString(), user.role);

    return { status: "success" };
  }

  async verifyEmail(token: string, otp: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
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
}