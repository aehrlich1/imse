import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './config/Employee';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  getMySqlInterns(): Observable<Employee[]> {
    return this.http.get<Employee[]>("http://localhost:3000/mysql/interns");
  }

  getMySqlReport(): Observable<any> {
    return this.http.get("http://localhost:3000/mysql/report");
  }

  promoteIntern(employee_id: number): Observable<any> {
    return this.http.post("http://localhost:3000/mysql/promoteintern", {"employee_id": employee_id});
  }

  fillMySqlDatabase(): void {
    this.http.post("http://localhost:3000/mysql", { }).subscribe();
  }

  fillMongoDbDatabase(): void {
    this.http.post("http://localhost:3000/mongodb", { }).subscribe();
  }

  getMongoDbInterns(): Observable<any> {
    return this.http.get("http://localhost:3000/mongodb/interns");
  }

  promoteMongoDbIntern(employee_id: number): Observable<any> {
    return this.http.post("http://localhost:3000/mongodb/promoteintern", {"employee_id": employee_id});
  }

  getMongdoDbReport(): Observable<any> {
    return this.http.get("http://localhost:3000/mongodb/report");
  }
}
