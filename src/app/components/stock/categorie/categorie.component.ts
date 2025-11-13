import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext'; // Input text for filtering
import { ButtonModule } from 'primeng/button'; // Button module
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Categorie } from '../../../models/categorie.model';
import { CategorieService } from '../../../Services/categorie.service';

@Component({
  selector: 'app-categorie',
  standalone: true,
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css'],
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    CommonModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    HttpClientModule, SidebarComponent
  ]
})
export class CategorieComponent implements OnInit {
  selectedCategorie: Categorie | null = null;
  displayModal: boolean = false;
  displayEditModal: boolean = false; // Controls the visibility of the modal
  categories: any[] = []; // Array to hold category data
  category = {
    categorieId: 0,
    nom: ''
  };
  filteredCategories: any[] = []; // Array to hold filtered category data
  searchTerm: string = ''; // Search term for filtering
  displayDeleteModal: boolean | undefined;
  errorMessage: string = ''; // Variable to store error messages

  constructor(private categorieService: CategorieService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.categorieService.getCategoriesByUserId().subscribe(
      (data: Categorie[]) => {
        this.categories = data;
        this.filteredCategories = data; // Initialize filteredCategories with full data
      },
      (error) => {
        console.error('Error fetching categories data:', error);
        this.errorMessage = 'Unable to fetch categories data. Please try again later.';
      }
    );
  }


  // Open the modal
  openAddCategoryModal() {
    this.displayModal = true;
  }

  // Close the modal
  closeAddCategoryModal() {
    this.displayModal = false;
  }
  openEditCategoryModal(category: Categorie) {
    this.selectedCategorie = category;
    this.category = { ...category }; // Pre-fill the form with the category's data
    this.displayEditModal = true;
  }

  // Close the edit modal
  closeEditCategoryModal() {
    this.displayEditModal = false;
  }
  // Submit the form to add a new category
  onSubmit() {
    this.categorieService.addCategorie(this.category).subscribe(
      (response: Categorie) => {
        console.log('Category added successfully', response);

        // Add the new category to the list dynamically
        this.categories.push(response);

        // Reset the form
        this.category = {
          categorieId: 0,
          nom: ''
        };

        // Close the modal
        this.displayModal = false;

        // Ensure the view is updated
        this.cd.detectChanges();
        // Reload the list of categories
        this.categorieService.getCategoriesByUserId().subscribe(
          (data: Categorie[]) => {
            this.categories = data;
            this.filteredCategories = data; // Update filtered categories too
          },
          (error) => {
            console.error('Error fetching updated category list:', error);
          }
        );
      },
      (error) => {
        console.error('Error occurred during submission', error);
        this.errorMessage = 'Error occurred during submission. Please try again.';
      }
    );
  }

  // Method to filter categories based on the search term
  searchCategories() {
    const term = this.searchTerm ? this.searchTerm.trim().toLowerCase() : '';
    if (term === '') {
      this.filteredCategories = this.categories; // Show all categories if search term is empty
    } else {
      this.filteredCategories = this.categories.filter((category) =>
        category.nom.toLowerCase().includes(term)
      );
    }
  }

  // Control dialog visibility for deleting a category
  deleteCategoryDialog: boolean = false;

  // Handle opening the delete confirmation dialog
  openDeleteCategoryModal(category: Categorie) {
    this.selectedCategorie = category;
    this.deleteCategoryDialog = true;  // Show the dialog
  }

  // Handle closing the delete confirmation dialog
  closeDeleteDialog() {
    this.deleteCategoryDialog = false;  // Hide the dialog
  }

  // Handle the deletion of the category
  deleteCategory() {
    if (this.selectedCategorie) {
      console.log('Deleting category with ID:', this.selectedCategorie.categorieId);  // Log category ID

      // Delete the category
      this.categorieService.deleteCategorie(this.selectedCategorie.categorieId).subscribe({
        next: () => {
          // Ensure the view is updated
          this.cd.detectChanges(); // Manually trigger change detection

          // Reload the list of categories
          this.categorieService.getCategoriesByUserId().subscribe(
            (data: Categorie[]) => {
              this.categories = data;
              this.filteredCategories = data; // Update filtered categories too
            },
            (error) => {
              console.error('Error fetching updated category list:', error);
            }
          );

          // Close the delete dialog
          this.closeDeleteDialog();
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          this.errorMessage = 'Error occurred while deleting the category. Please try again.';
        }
      });
    }
  }

  onEditSubmit() {
    if (this.selectedCategorie) {
      this.categorieService.updateCategorie(this.selectedCategorie.categorieId, this.category).subscribe(
        (response: Categorie) => {
          console.log('Category updated successfully', response);
  
          // Update the category in the list
          const index = this.categories.findIndex((cat) => cat.categorieId === this.selectedCategorie?.categorieId);
          if (index !== -1) {
            this.categories[index] = response;
  
            // Re-créer une nouvelle instance pour déclencher le changement
            this.categories = [...this.categories];
            this.filteredCategories = [...this.categories];
          }
  
          // Fermer le modal
          this.displayEditModal = false;
  
          // Optionnel : Forcer détection
          this.cd.detectChanges();
        },
        (error: any) => {
          console.error('Error occurred while updating the category', error);
          this.errorMessage = 'Error occurred while updating the category. Please try again.';
        }
      );
    }
  }
  
}
