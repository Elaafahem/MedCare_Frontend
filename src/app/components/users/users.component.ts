import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    DialogModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  usersList: any[] = []; // Liste des utilisateurs
  currentUserRole: string = ''; // Rôle de l'utilisateur actuel
  errorMessage: string = ''; // Message d'erreur à afficher

  // Propriétés pour l'ajout d'utilisateur
  displayAddUserModal: boolean = false; // Contrôle de l'affichage de la modale
  newUser: any = { username: '', email: '', password: '' }; // Modèle de données pour le nouvel utilisateur

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getCurrentUserRole();
  }

  // Récupère le rôle de l'utilisateur connecté à partir du token
  getCurrentUserRole() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload du token:', payload); // Vérifiez la structure du token
      this.currentUserRole = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (this.currentUserRole === 'Admin') {
        this.loadUsers(); // Charger les utilisateurs uniquement si le rôle est Admin
      } else {
        this.errorMessage = "Vous n'avez pas les permissions pour voir cette page.";
      }
    } else {
      this.errorMessage = 'Veuillez vous connecter pour accéder à cette page.';
    }
  }

  // Vérifie si le token est expiré
  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir en millisecondes
      return Date.now() > exp;
    }
    return true;
  }

  // Charge la liste des utilisateurs depuis l'API
  loadUsers() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Token manquant. Veuillez vous reconnecter.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
    });

    this.http.get<any[]>('http://localhost:5032/api/Account/GetAllUsers', { headers }).subscribe({
      next: (data) => {
        console.log('Utilisateurs chargés:', data);
        this.usersList = data; // Stocker les utilisateurs dans la liste
      },
      error: (error) => {
        if (error.status === 401) {
          console.error('Utilisateur non autorisé');
          this.errorMessage = 'Vous n’êtes pas autorisé à voir cette page.';
        } else {
          console.error('Erreur lors du chargement des utilisateurs:', error);
          this.errorMessage = 'Une erreur s’est produite lors du chargement des utilisateurs.';
        }
      },
    });
  }

  // Modifier un utilisateur
  editUser(user: any) {
    const updatedUser: any = {
      UserName: user.username,
      Email: user.email,
      Role: user.role,
      IsActive: user.status === 'Actif',  // Exemple pour ajouter un statut actif
    };

    this.http.put(`http://localhost:5032/api/Account/UpdateUser/${user.username}`, updatedUser).subscribe({
      next: (response) => {
        console.log('Utilisateur modifié avec succès', response);
        this.loadUsers();  // Recharger la liste des utilisateurs après modification
      },
      error: (error) => {
        console.error('Erreur lors de la modification de l\'utilisateur', error);
        this.errorMessage = 'Une erreur s’est produite lors de la modification de l\'utilisateur.';
      }
    });
  }

  // Supprimer un utilisateur
  deleteUser(username: string) {
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
    if (confirmDelete) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'Token manquant. Veuillez vous reconnecter.';
        return;
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
      });

      this.http.delete(`http://localhost:5032/api/Account/DeleteUser/${username}`, { headers }).subscribe({
        next: (response) => {
          console.log('Utilisateur supprimé avec succès', response);
          this.loadUsers();  // Recharger la liste des utilisateurs après suppression
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur', error);
          this.errorMessage = 'Une erreur s’est produite lors de la suppression de l\'utilisateur.';
        }
      });
    }
  }

  // Ajouter un utilisateur
  addUser() {
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Token manquant. Veuillez vous reconnecter.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
    });

    this.http.post('http://localhost:5032/api/Account/AddUserByAdmin', this.newUser, { headers }).subscribe({
      next: (response) => {
        console.log('Utilisateur ajouté avec succès', response);
        this.displayAddUserModal = false; // Fermer la modale
        this.newUser = { username: '', email: '', password: '' }; // Réinitialiser le formulaire
        this.loadUsers(); // Recharger la liste des utilisateurs
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
        this.errorMessage = 'Une erreur s’est produite lors de l\'ajout de l\'utilisateur.';
      },
    });
  }
}
