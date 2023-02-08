import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ForgetPasswordDTO } from 'src/modules/dtos/auth.dto';
import { MailManagerService } from './mail-manager.service';

@ApiBearerAuth()
@ApiTags('mail-manager')
@Controller('mail-manager')
export class MailManagerController {
  constructor(private readonly mailManagerService: MailManagerService) {}

  @Post('send-email')
  async SendEmail(@Body() forgetPasswordDTO: ForgetPasswordDTO) {
    await this.mailManagerService.sendEmail(forgetPasswordDTO);
  }
}
