import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SandboxService } from './sandbox.service';
import { CreateSandboxSessionDto } from './dto/create-sandbox-session.dto';
import { ExecuteSandboxCommandDto } from './dto/execute-sandbox-command.dto';

@ApiTags('Sandbox Architecture')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sandbox')
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @ApiOperation({ summary: 'Initialize new isolated sandbox session for lab execution' })
  @Post('sessions')
  async createSession(@Req() req: any, @Body() dto: CreateSandboxSessionDto) {
    return this.sandboxService.createSession(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Get status and telemetry of an active sandbox session' })
  @Get('sessions/:id')
  async getSessionStatus(@Req() req: any, @Param('id') id: string) {
    return this.sandboxService.getSessionStatus(req.user.id, id);
  }

  @ApiOperation({ summary: 'Execute command safely in isolated sandbox session' })
  @HttpCode(HttpStatus.OK)
  @Post('sessions/:id/execute')
  async executeCommand(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: ExecuteSandboxCommandDto
  ) {
    return this.sandboxService.executeCommand(req.user.id, id, dto);
  }

  @ApiOperation({ summary: 'Terminate active sandbox session' })
  @HttpCode(HttpStatus.OK)
  @Post('sessions/:id/terminate')
  async terminateSession(@Req() req: any, @Param('id') id: string) {
    return this.sandboxService.terminateSession(req.user.id, id);
  }
}
