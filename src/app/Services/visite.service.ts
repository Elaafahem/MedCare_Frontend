import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Import AuthService to get the token

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private apiUrl = 'http://localhost:5032/api/Visite';

  constructor(private http: HttpClient, private authService: AuthService) { }
  getTotalVisits(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`);
  }
  // Method to fetch all visit history data
  getVisitHistory(): Observable<any[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
  getVisitesByUser(): Observable<any[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/UserVisites`, { headers });
  }
  // Method to add a visit
  addVisite(visite: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(this.apiUrl, visite, { headers });
  }

  // Method to get visits by patient ID
  GetVisitesByPatient(patientId: number): Observable<any[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}`, { headers });
  }

  // Method to get visits by motif
  getVisitsByMotif(name: string): Observable<any[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/${name}`, { headers });
  }

  // Method to create authorization headers
  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token is missing. Please login again.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
