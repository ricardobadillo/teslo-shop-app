import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const GetUser = createParamDecorator(
  (data: string | Array<string>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new InternalServerErrorException('User not found in request');
    if (!data) return user;

    if (typeof data === 'string') return user[data];

    if (Array.isArray(data)) {
      const userFiltered = {};
      data.forEach(key => userFiltered[key] = user[key]);
      return userFiltered;
    }
  }
);