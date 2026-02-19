import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { AuthGuardGuard } from 'src/app/guards/auth-guard.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'src/app/_helper/jwt.interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MasterRoutingModule
  ],
  providers: [
    AuthGuardGuard,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ]
})
export class MasterModule { }
