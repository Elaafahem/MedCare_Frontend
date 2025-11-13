import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Import AuthService to get the token

@Injectable({
  providedIn: 'root',
})
export class OrdonnanceService {
  private apiUrl = 'http://localhost:5032/api/Ordonnance'; // Replace with actual API endpoint

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Method to get all ordonnances (prescriptions)
  getOrdonnaces(): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get<any>(this.apiUrl, { headers });
  }

  // Method to add an ordonnance (prescription)
  addOrdonnance(ordonnance: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(this.apiUrl, ordonnance, { headers });
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
