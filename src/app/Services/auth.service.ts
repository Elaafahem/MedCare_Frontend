import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  private baseUrl = 'http://localhost:5032/api/Account'; // URL de base pour les requêtes API


  constructor(private http: HttpClient, private router: Router) { }

  // Méthode pour se connecter
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post<any>(`${this.baseUrl}/login`, loginData).pipe(
      tap(response => {
        if (response.token && response.role) {  // Assurez-vous que `role` est retourné
          // Stocker le token et le rôle en tant que chaîne
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);  // Stocker le rôle sous forme de chaîne
        }
      })
    );
  }

  // Méthode pour récupérer le rôle de l'utilisateur
  getRole(): string {
    return localStorage.getItem('role') || 'guest';  // Récupérer le rôle stocké, défaut à 'guest'
  }

  // Méthode pour enregistrer un utilisateur
  register(user: { username: string; password: string; email: string }): Observable<any> {
    this.router.navigate(['/Login']);
    return this.http.post(`${this.baseUrl}/register`, user);

  }

  // Méthode pour récupérer le profil utilisateur
  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token récupéré:', token);  // Ajoutez ceci pour déboguer
    if (!token) {
      throw new Error('Token non disponible. Veuillez vous connecter.');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.baseUrl}/Profile`, { headers });
  }

  // Méthode pour récupérer le rôle de l'utilisateur à partir du token JW
  // Méthode pour décoder le token JWT
  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return payload ? JSON.parse(atob(payload)) : null;
  }
  logout(): void {
    // Clear token or user data
    localStorage.removeItem('token'); // or sessionStorage.removeItem('token')
    localStorage.removeItem('user');

    // Redirect to login or landing page
    this.router.navigate(['/Login']); // Update with your login route
  }
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/Login']); // Redirect to login if not authenticated
      return false;
    }
    return true;
  }

  // Méthode pour charger l'utilisateur actuellement connecté
loadUser(): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    this.router.navigate(['/Login']);
    throw new Error('Utilisateur non authentifié.');
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<any>(`${this.baseUrl}/Profile`, { headers }).pipe(
    tap(user => {
      // Optionnel : stocker l'utilisateur dans localStorage si besoin
      localStorage.setItem('user', JSON.stringify(user));
    })
  );
}

}