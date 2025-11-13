import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { MedicamentService } from '../../../Services/medicament.service';
import { DialogModule } from 'primeng/dialog';  // For dialog modal
import { FormsModule } from '@angular/forms';  // Import FormsModule to use ngModel
import { CommonModule } from '@angular/common';
import { Medicament } from '../../../models/medicament.model';
import { Categorie } from '../../../models/categorie.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    CommonModule,
    DialogModule,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit {
  medicaments: Medicament[] = [];
  displayModal: boolean = false;
  displayDeleteModal: boolean = false;
  categories: Categorie[] = [];
  medicament: Medicament = {
    medicamentId: 0,
    nom: '',
    description: '',
    categorieId: 0,
    categorie: { categorieId: 0, nom: '' },
  };
  medicamentToDelete: Medicament = {
    medicamentId: 0,
    nom: '',
    description: '',
    categorieId: 0,
    categorie: { categorieId: 0, nom: '' },
  };

  constructor(private medicamentService: MedicamentService) { }

  ngOnInit(): void {
    this.fetchMedications();
    this.fetchCategories();
  }

  // Fetch medications
  fetchMedications() {
    this.medicamentService.getAllMedications().subscribe({
      next: (data: Medicament[]) => {
        this.medicaments = data.map((m) => ({
          ...m,
          categorie: this.categories.find(c => c.categorieId === m.categorieId) || { categorieId: 0, nom: 'Inconnue' }
        }));
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des médicaments:', error);
      },
    });
  }
  
  // Fetch categories
  fetchCategories() {
    this.medicamentService.getCategoriesByUserId().subscribe({
      next: (data: Categorie[]) => (this.categories = data),
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  // Open modal to add a new medication
  openAddModal() {
    this.displayModal = true;
    this.medicament = {
      medicamentId: 0,
      nom: '',
      description: '',
      categorieId: 0,
      categorie: { categorieId: 0, nom: '' },
    };
  }

  // Close modal
  closeModal() {
    this.displayModal = false;
  }

  // Open modal to delete a medication
  openDeleteModal(medicament: Medicament) {
    this.displayDeleteModal = true;
    this.medicamentToDelete = { ...medicament };
  }

  // Close delete modal
  closeDeleteModal() {
    this.displayDeleteModal = false;
  }

  // Open modal to edit an existing medication
  openEditModal(medicament: Medicament) {
    this.displayModal = true;
    this.medicament = {
      ...medicament,
      categorieId: medicament.categorie?.categorieId || 0, // Safe access
    };
  }

  // Handle form submission (add/update)
  onSubmit() {
    if (!this.medicament.nom || !this.medicament.description || !this.medicament.categorieId) {
      console.error('Tous les champs sont requis !');
      return;
    }
  
    const saveOperation = this.medicament.medicamentId === 0
      ? this.medicamentService.addMedication(this.medicament)
      : this.medicamentService.updateMedication(this.medicament);
  
    saveOperation.subscribe({
      next: () => {
        console.log('Médicament sauvegardé avec succès');
        this.fetchMedications();
        this.closeModal();
      },
      error: (err) => {
        console.error('Erreur lors de la sauvegarde du médicament:', err);
      },
    });
  }
  


  // Delete medication
  deleteMedicament() {
    this.medicamentService.deleteMedication(this.medicamentToDelete.medicamentId).subscribe({
      next: () => {
        this.fetchMedications();
        this.closeDeleteModal();
      },
      error: (err) => console.error('Error deleting medication:', err),
    });
  }
}
