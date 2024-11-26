/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { UserService } from '../user/user.service';
import { isIdValid } from '../helper';
import { UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private transporter: nodemailer.Transporter
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: '"E-Learning-System" <e_learning@gmail.com>',
      to,
      subject,
      text,
      html,
    };
    return await this.transporter.sendMail(mailOptions);
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
      const token = this.jwtService.sign({ email }, { expiresIn: '1h' });

      const msg = {
        to: email,
        subject: 'Verify Your Email',
        text: `Your email verification token: ${token}`,
        html: `<p>Your email verification token: <strong>${token}</strong></p>`
      };

      await this.sendEmail(msg.to, msg.subject, msg.text, msg.html);
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

  async verifyEmail(token: string): Promise<any> {
    const decoded = this.jwtService.verify(token);
    const email = decoded.email;

    const user = await this.userService.findByEmail(email) as UserDocument;
    if (!user) throw new BadRequestException('Invalid verification token.');

    if (user.isVerified) {
      throw new BadRequestException('Email already verified.');
    }

    await this.userService.update(user._id.toString(), { isVerified: true });

    return { message: 'Email verified successfully.' };
  }
}