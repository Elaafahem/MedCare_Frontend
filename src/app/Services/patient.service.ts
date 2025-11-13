import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Patient } from '../models/patient.model'; // Assurez-vous que ce modèle est correctement importé

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:5032/api/Patient';  // URL de l'API pour récupérer les patients

  constructor(private http: HttpClient) { }
  getTotalPatients(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`);
  }
  // Méthode pour récupérer les patients associés à l'utilisateur connecté
  getPatientsByUserId() {
    const token = localStorage.getItem('token'); // ou récupère depuis ton auth service

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/patients-by-user`, { headers });
  }

  // Méthode pour récupérer tous les patients (si nécessaire)
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  // Méthode pour ajouter un patient
  addPatient(patient: Patient): Observable<Patient> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Patient>(this.apiUrl, patient, { headers });
  }

  // Méthode pour supprimer un patient (en supposant qu'il existe un endpoint DELETE dans l'API)
  deletePatient(patientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${patientId}`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          console.error('Patient non trouvé:', patientId);
        }
        return throwError(error); // Propager l'erreur
      })
    );
  }

  // Ajoutez d'autres méthodes si nécessaire (par exemple, mettre à jour un patient, récupérer un patient par ID, etc.)
}
