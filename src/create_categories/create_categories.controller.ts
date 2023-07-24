import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCategoriesService } from './create_categories.service';

@Controller('categories')
export class CreateCategoriesController {
  constructor(
    private readonly createCategoriesService: CreateCategoriesService,
  ) {}

  // creates user's category
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createCategory(@Request() req, @Body('name') name: string) {
    const userId = req.user.userId; // Get the userId from the request user (set by AuthGuard)
    const category = await this.createCategoriesService.createCategoryForUser(
      userId,
      name,
    );
    const response = {
      categoryId: category.categoryId,
      name: category.name,
      userId: category.user.userId,
      amountSpent: category.amountSpent,
      timeSpent: category.timeSpent,
    };
    return response;
  }

  // spend on created categories
  @Patch(':categoryId/spend')
  @UseGuards(AuthGuard('jwt'))
  async spendAmountFromCategory(
    @Request() req,
    @Param('categoryId') categoryId: string,
    @Body('amount') amount: number,
  ) {
    const userId = req.user.userId; // Get the userId from the request user (set by AuthGuard)
    const updatedCategory =
      await this.createCategoriesService.spendAmountOnCategory(
        userId,
        categoryId,
        amount,
      );

    return updatedCategory;
  }

  //fetch categories with no amount spent on it
  @Get('/without-amount-spent')
  @UseGuards(AuthGuard('jwt'))
  async getCategoriesWithoutAmountSpent(@Request() req) {
    const userId = req.user.userId; // Get the user ID from the request
    const categories =
      await this.createCategoriesService.getCategoriesWithoutAmountSpent(
        userId,
      );
    return categories;
  }

  // update user's category
  @Patch(':categoryId/update')
  @UseGuards(AuthGuard('jwt'))
  async updateCategory(
    @Request() req,
    @Param('categoryId') categoryId: string,
    @Body('name') newName: string,
  ) {
    const userId = req.user.userId;
    const updatedCategory =
      await this.createCategoriesService.updateCategoryForUser(
        userId,
        categoryId,
        newName,
      );

    return updatedCategory;
  }
  // delete user's category
  @Delete(':categoryId/delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteCategory(
    @Request() req,
    @Param('categoryId') categoryId: string,
  ) {
    const userId = req.user.userId;
    await this.createCategoriesService.deleteCategoryForUser(
      userId,
      categoryId,
    );

    return { message: 'Category deleted successfully' };
  }

  @Get('categories/transaction')
  @UseGuards(AuthGuard('jwt'))
  async CategoriesWithoutAmountSpent(@Request() req) {
    const userId = req.user.userId; // Get the user ID from the request
    const categories =
      await this.createCategoriesService.getCategoriesWithSpentAmount(userId);
    return categories;
  }
}
