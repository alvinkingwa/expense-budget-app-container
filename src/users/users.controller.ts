import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // signup
  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  async getUser(
    @Param('userId') userId: string,
   
  ) {
    const user = await this.userService.findUserWithAccountAndCategories(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }


  @Get(':userId/daily-expense-total')
@UseGuards(AuthGuard('jwt'))
async getDailyExpenseTotal(
  @Param('userId') userId: string,
  @Query('date') date: string
) {
  const dailyExpenseTotal = await this.userService.getDailyExpenseTotal(userId, date);
  return { dailyExpenseTotal };
}

}
