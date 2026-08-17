import {IsDateString,IsNotEmpty,IsOptional,IsString} from 'class-validator';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  quizDate: string;
}