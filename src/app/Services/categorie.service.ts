import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Categorie } from '../models/categorie.model';  // Ensure this model is correctly imported

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = 'http://localhost:5032/api/Categorie'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Get categories by UserId
  getCategoriesByUserId(): Observable<Categorie[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('Token non disponible. Veuillez vous connecter.');
    }

    // Add the JWT token to the request headers
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<Categorie[]>(`${this.apiUrl}/categories-by-user`, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des catégories:', error);
        return throwError(error);  // Propagate the error
      })
    );
  }

  // Add a new category
  addCategorie(categorie: Categorie): Observable<Categorie> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // Add Authorization header
    });

    return this.http.post<Categorie>(this.apiUrl, categorie, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'ajout de la catégorie:', error);
        return throwError(error);  // Propagate the error
      })
    );
  }
  updateCategorie(categorieId: number, updatedCategory: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${categorieId}`, updatedCategory);
  }
  // Delete a category
  deleteCategorie(categorieId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.delete<void>(`${this.apiUrl}/${categorieId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        return throwError(error); // Propagate the error
      })
    );
  }
}
