import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SubmitResultDto {
  @IsNotEmpty()
  @IsUUID()
  quizId: string;

  @IsArray()
  answers: {
  questionId: string;
  answer: string;
  }[];
}