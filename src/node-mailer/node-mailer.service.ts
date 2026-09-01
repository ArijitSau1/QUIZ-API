import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodeMailerService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(name, score, totalQuestions) {
    try {
      return await this.mailService.sendMail({
        to: 'arijitsau67@gmail.com',
        subject: 'Quiz Result',
        html: `
        <h2></h2> Quiz Result</h2>

        <p>User Name: <b>${name}</b></p>
        <p>Score: <b>${score}/${totalQuestions}</b></p>

        <p>Thank You.</p>
      `,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
