import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Prefer the tenant code persisted from login (over the default HPD)
    const tenantId = localStorage.getItem('tenantCode') || environment.appid;
    const modifiedReq = req.clone({
        headers: req.headers.set('x-tenant-id', `${tenantId}`),
    });
    return next.handle(modifiedReq);
  }
}
