import { Component } from '@angular/core';
// Import du service d'authentification
import { Router, RouterModule } from '@angular/router';  // Pour la navigation après la connexion
import { AuthService } from '../Services/auth.service';
import { HeaderComponent } from '../components/shared/header/header.component';
import { SidebarComponent } from '../components/shared/sidebar/sidebar.component';
import { FooterComponent } from '../components/shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,  // Composant autonome
  imports: [
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    CommonModule,
    TableModule, // PrimeNG table
    InputTextModule, // Input text
    ButtonModule, // Buttons
    DialogModule, // Dialog for modals
    FormsModule,
    SidebarComponent // For [(ngModel)]
  ],  // 
  templateUrl: './login-auth.component.html',
  styleUrls: ['./login-auth.component.css']
})
export class LoginAuthComponent {
  User = {
    username: '',
    password: ''
  };  // Objet pour les informations de connexion

  notaccess: boolean = false;  // Affiche le message d'erreur
  errorMessage: string = '';   // Message d'erreur détaillé

  constructor(private authService: AuthService, private router: Router) { }

  // Méthode pour gérer la connexion
  login() {
    this.authService.login(this.User.username, this.User.password).subscribe(
      response => {
        if (response.token) {
          console.log('Connexion réussie');
          localStorage.setItem('token', response.token);  // Stocke le token JWT dans le localStorage
          this.notaccess = false;  // Réinitialise le message d'erreur
          this.router.navigate(['/dashboard']);  // Redirige l'utilisateur vers la page d'accueil ou tableau de bord
        }
      },
      error => {
        console.error('Connexion échouée', error);
        this.notaccess = true;  // Affiche le message d'erreur
        this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';  // Message détaillé
      }
    );
  }
}
