import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  serviceURL = 'http://localhost:8080';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  user = new User();

  constructor(private http: HttpClient) { }

  createUser(data): Observable<any> {
    const url = `${this.serviceURL}/addUser`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  getUsers() {
    return this.http.get(`${this.serviceURL}/getallUser`);
  }

  getUser(id): Observable<any> {
    const url = `${this.serviceURL}/getUser/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.errorMgmt)
    );
  }

  createGame(data): Observable<any> {
    const url = `${this.serviceURL}/createGame`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  checkID(code: string): Observable<boolean> {
    const url = `${this.serviceURL}/checkID/${code}`;
    return this.http.get<{ exists: boolean }>(url).pipe(
      map(response => response.exists),
      catchError(this.errorMgmt)
    );
  }

  getGame() {
    return this.http.get(`${this.serviceURL}/getGame`);
  }

  deleteGame(id): Observable<any> {
    const url = `${this.serviceURL}/deleteGame/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  updateGame(id: string, data: any): Observable<any> {
    const url = `${this.serviceURL}/updateGame/${id}`;
    return this.http.put(url, data, { headers: this.headers })
      .pipe(
        catchError(this.errorMgmt)
      );
  }

  setLoggedInUser(user){
    this.user = user;
  }

  getLoggedInUser(){
    return this.user;
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    alert(errorMessage);
    return throwError(errorMessage);
  }
}
