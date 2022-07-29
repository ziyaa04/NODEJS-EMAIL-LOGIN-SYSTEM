import { Controller, Get, Render, UseFilters, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { NoAuthGuard } from "./guards/no-auth.guard";
import { AuthExceptionFilter } from "./exceptionFilters/auth.exception.filter";

@Controller()
@UseGuards(NoAuthGuard)
@UseFilters(new AuthExceptionFilter())
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render("home/index")
  Index(): object {
    return this.appService.Index();
  }
}
