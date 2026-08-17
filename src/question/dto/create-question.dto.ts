import {IsNotEmpty,IsString, IsUUID,} from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  optionA: string;

  @IsNotEmpty()
  @IsString()
  optionB: string;

  @IsNotEmpty()
  @IsString()
  optionC: string;

  @IsNotEmpty()
  @IsString()
  optionD: string;

  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsNotEmpty()
  @IsUUID()
  quizId: string;
}