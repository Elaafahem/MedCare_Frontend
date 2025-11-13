import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5032/api/Dashboard';

  constructor(private http: HttpClient) { }

  getTotalPatients(): Observable<number> {
    return this.http.get<number>(`http://localhost:5032/api/Patient/total`);
  }

  getPatientGrowthPercentage(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/patientGrowth`);
  }

  getTotalVisits(): Observable<number> {
    return this.http.get<number>(`http://localhost:5032/api/Visite/total`);
  }

  getVisitGrowthPercentage(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/visitGrowth`);
  }
  getAllUsers() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any[]>('http://localhost:5032/api/Account/GetAllUsers', { headers });
  }
  getAllPatients(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5032/api/Patient`);
  }
  
} 