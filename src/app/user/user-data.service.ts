
/* This service is to handle data data operations form and to the database
  and will provide the data needed to all components upon request
*/
import { User } from '../models/user';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private baseURL = 'http://localhost:3000/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  initUserState: User = {
    id: null,
    firstname: '',
    address: '',
    email: '',
    telnum: null
  };

  private curruntUserSubject = new BehaviorSubject<User>(this.initUserState);
  curruntUser$ = this.curruntUserSubject.asObservable();

  curruntUserChanges(userData: User = this.initUserState): void {
    this.curruntUserSubject.next(userData);
  }

  constructor(private http: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) { }


  // Getting ALL the data (/users)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseURL}users`)
      .pipe(
        catchError(this.processHTTPMsgService.handleError)
      );
  }

  getUsersId(): Observable<number[] | any> {
    return this.getAllUsers().pipe(map(users => users.map(user => user.id)))
      .pipe(
        catchError(error => error)
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseURL}users/${id}`)
      .pipe(
        catchError(this.processHTTPMsgService.handleError)
      );
  }

  // Saving user data (/users)
  createNewUser(data: User): Observable<User> {
    return this.http.post<User>(`${this.baseURL}users`, data, this.httpOptions)
      .pipe(
        catchError(this.processHTTPMsgService.handleError)
      );
  }

  // Update the user data (/users:id)
  updateUserData(id: number, data: User): Observable<User> {
    return this.http.put<User>(`${this.baseURL}users/${id}`, data, this.httpOptions)
      .pipe(
        catchError(this.processHTTPMsgService.handleError)
      );
  }

  // Delete the user data (/users:id)
  deletUserData(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}users/${id}`)
      .pipe(
        catchError(this.processHTTPMsgService.handleError)
      );
  }

}
