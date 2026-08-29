import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateQuestionDto {

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsNotEmpty()
  @IsUUID()
  quizId: string;
}