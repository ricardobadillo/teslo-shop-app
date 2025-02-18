import { createParamDecorator, ExecutionContext } from "@nestjs/common";



export const RawHeaders = createParamDecorator(
  (data: Array<string>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.rawHeaders;
  }
);