import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('this is the request from the guard')
    const request = context.switchToHttp().getRequest();
    console.log('this is the request from the guard',request)
    return true;
  }
}