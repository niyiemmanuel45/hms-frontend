import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { MasterRoutingModule } from './components/layouts/master/master-routing.module';
import { AccessDeniedComponent } from './components/errors/access-denied/access-denied.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ServerErrorComponent } from './components/errors/server-error/server-error.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password"', component: ForgotPasswordComponent },
    { path: 'feed', loadChildren: () => MasterRoutingModule },
    { path: 'access-denied', component: AccessDeniedComponent },
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent},
    { path: '**', redirectTo: 'access-denied' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
