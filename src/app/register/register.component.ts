import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';  // Assurez-vous que le service AuthService est correctement importé
import { HeaderComponent } from '../components/shared/header/header.component';
import { SidebarComponent } from '../components/shared/sidebar/sidebar.component';
import { FooterComponent } from '../components/shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,  // Composant autonome
  imports: [
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  User = {
    username: '',
    password: '',
    email: ''
  };

  message: string | null = null;  // Message à afficher après inscription
  token: string | null = null;
  notaccess: boolean = false; // Add this property

  constructor(private authService: AuthService) { }

  register() {
    if (this.User.username && this.User.password && this.User.email) {
      this.authService.register(this.User).subscribe(
        (response) => {
          this.message = response.message;  // Assuming backend sends a message
          alert(this.message);  // Show success message
          // Optionally, navigate to login page after registration
          // this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Registration failed:', error);
          alert('Registration failed. Please try again.');
        }
      );
    } else {
      alert('Please fill out all fields correctly.');
    }
  }

}
