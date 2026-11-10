import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username!: string;

  @IsEmail()
  @MaxLength(100)
  email!: string;
}
