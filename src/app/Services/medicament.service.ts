import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Medicament } from '../models/medicament.model';
import { Categorie } from '../models/categorie.model';

@Injectable({
  providedIn: 'root'
})
export class MedicamentService {

  private apiUrl = 'http://localhost:5032/api/Medicament'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Method to fetch all medications
  getAllMedications(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(this.apiUrl);
  }

  // Fetch categories
  getCategoriesByUserId(): Observable<Categorie[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      // Retourne une erreur sous forme d'Observable si le token n'est pas disponible
      return throwError(() => new Error('Token non disponible. Veuillez vous connecter.'));
    }

    // Ajoutez le token à l'en-tête de la requête
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Remplacez l'URL par celle qui correspond à votre API backend
    return this.http.get<Categorie[]>('http://localhost:5032/api/Categorie/categories-by-user', { headers });
  }

  // Fetch medications by category
  getMedicationsByCategory(categoryId: number): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`http://localhost:5032/api/Medicament/ByCategory/${categoryId}`);
  }

  // Add a new medication
  addMedication(medicament: Medicament): Observable<Medicament> {
    const payload = { ...medicament, categorie: undefined }; // Exclude `categorie` from payload
    return this.http.post<Medicament>(`${this.apiUrl}`, payload);
  }

  // Update an existing medication
  updateMedication(medicament: Medicament): Observable<Medicament> {
    return this.http.put<Medicament>(`${this.apiUrl}/${medicament.medicamentId}`, medicament);
  }

  // Delete a medication
  deleteMedication(medicamentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${medicamentId}`);
  }
}
