import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Session } from '@app/models';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';

interface LoginResponse extends Session {
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<Session | undefined> {
    return this.http
      .post<LoginResponse>(`${environment.dataService}/login`, {
        username: email,
        password,
      })
      .pipe(
        map((res: LoginResponse) => {
          const { success, ...session } = res;
          return success ? session : undefined;
        }),
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.dataService}/logout`, {});
  }
}
