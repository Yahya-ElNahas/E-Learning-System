/* eslint-disable prettier/prettier */
import { isValidObjectId } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function isIdValid(id: string) {
    if(!isValidObjectId(id)) throw new BadRequestException(`Invalid ID format: ${id}`);
}