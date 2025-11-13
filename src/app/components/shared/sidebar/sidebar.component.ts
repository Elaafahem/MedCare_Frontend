import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  role: string = 'guest';   // Default role to 0 (if no role is found)

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();  // Récupérer le rôle depuis AuthService

    console.log('Role depuis localStorage:', this.role); // Afficher pour vérifier
  }


  sidebarclicked() {
    // Logic for handling sidebar item clicks
  }
}
