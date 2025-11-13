import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userProfile: any;
  userRole: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadUserProfile();
  }
  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('active'); // Toggle the 'active' class on the sidebar
    }
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        // Update userRole if it's included in the profile response
        this.userRole = profile.role || this.authService.getRole();
      },
      error: (err) => {
        console.error("Error fetching profile:", err);
        if (err.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/#/Login';
        }
      },
    });
  }
  onLogout(): void {
    this.authService.logout();
  }


}

