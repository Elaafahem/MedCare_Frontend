import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

import { TableModule } from 'primeng/table'; // Table module
import { InputTextModule } from 'primeng/inputtext'; // Input text for filtering
import { ButtonModule } from 'primeng/button'; // Button module
import { DropdownModule } from 'primeng/dropdown'; // Dropdown module
import { MultiSelectModule } from 'primeng/multiselect'; // Multi-select filter
import { TagModule } from 'primeng/tag'; // Tag for statuses
import { FormsModule } from '@angular/forms'; // Forms for [(ngModel)]
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { VisitService } from '../../Services/visite.service';
import { Visit } from '../../models/visite.model';

@Component({
  selector: 'app-visit-type',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    TableModule, // PrimeNG table
    InputTextModule, // Input text
    InputIconModule,
    ButtonModule, // Button
    IconFieldModule,
    DropdownModule, // Dropdown
    MultiSelectModule, // Multi-select
    TagModule, // Tags for status display
    FormsModule, // For [(ngModel)]
  ],
  templateUrl: './visit-type.component.html',
  styleUrls: ['./visit-type.component.css']
})
export class VisitTypeComponent implements OnInit {

  visitHistory: Visit[] = [];
  userVisits: Visit[] = [];
  errorMessage: string = '';

  constructor(private visitService: VisitService) { }

  ngOnInit(): void {
    // Fetch all visit history and user-specific visits when the component initializes
    this.getVisitHistory();
  }

  // Method to fetch visit history data from the service
  getVisitHistory(): void {
    this.visitService.getVisitesByUser().subscribe(
      (data: Visit[]) => {
        this.visitHistory = data;  // Assign the fetched data to the visitHistory array
      },
      (error) => {
        console.error('Error fetching visit history:', error);
        this.errorMessage = 'Erreur lors du chargement des données des visites.';
      }
    );
  }

  // Method to fetch user-specific visits

}
