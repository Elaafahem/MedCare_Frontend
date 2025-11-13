import { Component, TemplateRef, ViewChild } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { TreeTableModule } from 'primeng/treetable';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OrdonnanceService } from '../../Services/ordonnance.service';
import { VisitService } from '../../Services/visite.service';
import { PatientService } from '../../Services/patient.service';
import { CategorieService } from '../../Services/categorie.service';
import { MedicamentService } from '../../Services/medicament.service';
import { Categorie } from '../../models/categorie.model';
import { Medicament } from '../../models/medicament.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-visite',
  standalone: true,
  imports: [HeaderComponent,
    SidebarComponent,
    FooterComponent,
    CommonModule,
    DropdownModule,
    TableModule,
    DialogModule,
    ToastModule,
    TreeTableModule,
    ButtonModule,
    CalendarModule,
    TabViewModule,
    FormsModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule,
  ],
  providers: [MessageService],
  templateUrl: './visite.component.html',
  styleUrls: ['./visite.component.css']
})
export class VisiteComponent {

  patients: Patient[] = []; // Initialize as empty
  selectedPatient: Patient | null = null;  // Initialize as null

  visitHistory: any[] = []; // All visits
  filteredVisitHistory: any[] = [];
  today: Date = new Date(); // Définit la date minimale à aujourd'hui
  visitDateTime: Date | null = null;
  symptoms: string = '';
  activeTabIndex: number = 0;
  testDateTime: Date | undefined;
  categories: any[] = []; // Categories list for dropdown
  medicationsList: Record<string, { label: string; value: string }[]> = {}; // Medications list by category
  finalMedications: { category: Categorie | null; name: Medicament | null; dosage: string | null }[] = [];
  medications: { category: number | null; name: string | null; dosage: string | null }[] = [
    { category: null, name: null, dosage: null }
  ];
  message: any;
  savedOrdonnanceId: number | null = null;

  constructor(
    private ordonnanceService: OrdonnanceService,
    private visiteService: VisitService,
    private patientService: PatientService,
    private categoryService: CategorieService,
    private medicationService: MedicamentService
  ) { }

  ngOnInit(): void {
    this.loadPatients();
    this.loadCategories();
  }

  // Load patients from the backend
  loadPatients(): void {
    this.patientService.getPatientsByUserId().subscribe({
      next: (response) => {
        this.patients = response.map((patient: any) => ({
          patientId: patient.patientId,
          nom: patient.nom,
          prenom: patient.prenom,
          email: patient.email,
        }));
        console.log('Patients loaded successfully:', this.patients);
      },
      error: (error) => {
        console.error('Error loading patients:', error);
      },
    });
  }


  // Load categories and medications
  loadCategories(): void {
    this.categoryService.getCategoriesByUserId().subscribe({
      next: (categories) => {
        this.categories = categories.map((cat: Categorie) => ({
          label: cat.nom,
          value: cat.categorieId,
        }));
        console.log('Loaded Categories:', this.categories);
        this.loadMedicationsForCategories(categories);
      },
      error: (error) => console.error('Error loading categories:', error),
    });
  }

  loadMedicationsForCategories(categories: Categorie[]): void {
    categories.forEach((category) => {
      this.medicationService.getMedicationsByCategory(category.categorieId).subscribe({
        next: (medications: Medicament[]) => {
          this.medicationsList[category.categorieId] = medications.map((med) => ({
            label: med.nom,
            value: String(med.medicamentId),
          }));
        },
        error: (error: any) => console.error(`Error loading medications for category ${category.nom}:`, error),
      });
    });
  }

  getMedicationsByCategory(categoryId: number | null): { label: string; value: string }[] {
    return categoryId && this.medicationsList[categoryId] ? this.medicationsList[categoryId] : [];
  }

  onCategoryChange(index: number): void {
    const selectedCategory = this.medications[index].category;

    if (selectedCategory) {
      this.medications[index].name = null;
      this.medicationsList[selectedCategory] = [];
      this.loadMedicationsForCategory(selectedCategory, index);
    }
  }

  loadMedicationsForCategory(categoryId: number, index: number): void {
    this.medicationService.getMedicationsByCategory(categoryId).subscribe({
      next: (medications: Medicament[]) => {
        this.medicationsList[categoryId] = medications.map((med) => ({
          label: med.nom,
          value: String(med.medicamentId),
        }));

        if (this.medicationsList[categoryId].length > 0) {
          this.medications[index].name = this.medicationsList[categoryId][0].value;
        }
      },
      error: (error: any) => console.error(`Error loading medications for category ${categoryId}:`, error),
    });
  }

  save() {
    if (!this.selectedPatient || !this.selectedPatient.patientId || !this.visitDateTime || !this.symptoms) {
      alert('Please ensure all required fields are filled!');
      return;
    }

    if (!this.savedOrdonnanceId) {
      alert('Please finalize the ordonnance before saving the visite!');
      return;
    }

    const visitePayload = {
      dateVisite: this.visitDateTime,
      motif: this.symptoms,
      diagnostic: 'Placeholder diagnostic',
      patientId: this.selectedPatient.patientId,
      OrdonnaceId: this.savedOrdonnanceId,
    };

    this.visiteService.addVisite(visitePayload).subscribe({
      next: (response) => {
        alert('Visite saved successfully!');
      },
      error: (error) => {
        console.error('Error saving visite:', error);
        alert(`Error saving visite: ${error.message}`);
      },
    });
  }

  clearForm() {
    this.selectedPatient = null;
    this.visitDateTime = null;
    this.symptoms = '';
    this.finalMedications = [];
    this.medications = [{ category: null, name: null, dosage: null }];
    this.medicationsFinalized = false;
  }

  goToNextTab(): void {
    this.activeTabIndex += 1;
  }

  updateMedicationList(medication: {
    category: string | null;
    name: string | null;
    dosage: string | null;
  }): void {
    medication.name = null;
  }

  medicationsFinalized: boolean = false;

  addMedication() {
    this.medications.forEach((medication) => {
      if (medication.category && medication.name && medication.dosage) {
        const category = this.categories.find((cat) => Number(cat.value) === Number(medication.category));
        const medicationObj = this.medicationsList[medication.category]?.find(
          (med) => med.value === medication.name
        );

        const fullMedicament = this.medicationsList[medication.category]
          ?.map((med) => ({
            medicamentId: Number(med.value),
            nom: med.label,
            dosage: '',
            description: '',
            categorieId: Number(medication.category),
            categorie: { categorieId: Number(category?.value), nom: category?.label || '' },
          }))
          .find((med) => med.medicamentId === Number(medication.name));

        if (category && fullMedicament) {
          this.finalMedications.push({
            category: { categorieId: category.value, nom: category.label },
            name: fullMedicament,
            dosage: medication.dosage,
          });
        } else {
          console.error('Category or Medication not found');
        }
      }
    });

    this.medications = [{ category: null, name: null, dosage: null }];
  }

  finalizeMedications() {
    if (this.finalMedications.length === 0) {
      alert('No medications added to the ordonnance!');
      return;
    }

    const ordonnancePayload = {
      dateCreation: new Date().toISOString(),
      medicamentIds: this.finalMedications.map((med) => med.name?.medicamentId),
      dosage: this.finalMedications.map((med) => med.dosage).join(', '),
    };

    this.ordonnanceService.addOrdonnance(ordonnancePayload).subscribe({
      next: (response) => {
        alert('Ordonnance saved successfully!');
        this.savedOrdonnanceId = response.ordonnanceId;
      },
      error: (error) => {
        console.error('Error saving ordonnance:', error);
        alert(`Error saving ordonnance: ${JSON.stringify(error.error)}`);
      },
    });
  }

  removeMedication(index: number) {
    this.finalMedications.splice(index, 1);
  }

  loadVisitHistory(): void {
    if (!this.selectedPatient || !this.selectedPatient.patientId) {
      console.warn('No patient selected!');
      return;
    }
    this.visiteService.GetVisitesByPatient(this.selectedPatient.patientId).subscribe({
      next: (visits) => {
        this.filteredVisitHistory = visits;
      },
      error: (error) => {
        console.error('Error loading visit history:', error);
      },
    });
  }

  onPatientSelected(): void {
    this.loadVisitHistory();
  }

  showOrdonnanceModal: boolean = false;
  selectedVisit: any = null;

  onFileUpload(event: any): void {
    console.log(event.files);
  }

  openOrdonnanceModal(visit: any): void {
    this.selectedVisit = visit;
    this.showOrdonnanceModal = true;
  }

  printOrdonnance() {
    const printWindow = window.open('', '', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.write('<html><head><title>Impression Ordonnance</title></head><body>');
      printWindow.document.write('<h4>Ordonnance des Médicaments</h4>');
      printWindow.document.write('<table border="1" cellpadding="5" cellspacing="0" style="width: 100%;">');
      printWindow.document.write('<thead><tr><th>Catégorie</th><th>Médicament</th><th>Dosage</th><th>Fréquence</th></tr></thead><tbody>');

      this.finalMedications.forEach(med => {
        printWindow.document.write(`<tr><td>${med.category?.nom}</td><td>${med.name?.nom}</td><td>${med.dosage}</td></tr>`);
      });

      printWindow.document.write('</tbody></table>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    } else {
      alert('Impossible d\'ouvrir la fenêtre d\'impression.');
    }
  }
}
