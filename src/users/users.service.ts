import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './interfaces/user.interface'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = createUserDto as User
    newUser.password = await bcrypt.hash(newUser.password, 10)
    return this.userModel.create(newUser)
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email })
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).select('-password')
  }
}
