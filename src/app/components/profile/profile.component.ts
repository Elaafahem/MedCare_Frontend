import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-profile',
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
    FormsModule, SidebarComponent // For [(ngModel)]
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userProfile: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération du profil :", err);
        // Ajouter une gestion d'erreur plus appropriée (ex : redirection vers la page de connexion)
        if (err.status === 401) {
          // Rediriger vers la page de connexion si le token est manquant ou invalide
          window.location.href = '/login'; // Modifier selon votre logique de routage
        }
      },
    });
  }
}
