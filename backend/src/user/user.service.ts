/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(userDto: any): Promise<User> {
    const user = new this.userModel(userDto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found.`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateData: any): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedUser) throw new NotFoundException(`User with ID ${id} not found.1`);
    return updatedUser;
  }

  async update(userId: string, updateData: any): Promise<User> {
    return await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }

  async generateJwt(userId: string): Promise<string> {
    const payload = { userId };
    return this.jwtService.sign(payload);
  }

  async register(userDto: any): Promise<any> {
    const { email, password, role } = userDto;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    userDto.password = hashedPassword;
    userDto.isVerified = role !== 'student';

    // Create user
    const newUser = await this.create(userDto);

    if (role === 'student') {
      const token = this.jwtService.sign({ email });

      // Send email
      const msg = {
        to: email,
        from: 'abdelrahamanehab@gmail.com',
        subject: 'Verify Your Email',
        text: `Your email verification token: ${token}`,
        html: `<p>Your email verification token: <strong>${token}</strong></p>`
      };
      await sgMail.send(msg);
    }

    return newUser;
  }

  async login(credentials: any): Promise<any> {
    const { email, password } = credentials;

    const user = await this.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials.');

    if (user.role === 'student' && !user.isVerified) {
      throw new BadRequestException('Email verification required.');
    }

    const payload = { email: user.email, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async verifyEmail(token: string): Promise<any> {
    let decoded;
    try {
      decoded = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token.');
    }

    const email = decoded.email;

    const user = (await this.findByEmail(email)) as UserDocument;
    if (!user) throw new BadRequestException('Invalid verification token.');

    if (user.isVerified) {
      throw new BadRequestException('Email already verified.');
    }

    await this.update(user._id, { isVerified: true });

    return { message: 'Email verified successfully.' };
  }
}