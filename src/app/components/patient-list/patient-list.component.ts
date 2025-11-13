import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { PatientService } from '../../Services/patient.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext'; // Input text for filtering
import { ButtonModule } from 'primeng/button'; // Button module
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Patient } from '../../models/patient.model';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
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
export class PatientListComponent implements OnInit {
  selectedPatient: Patient | null = null;
  displayModal: boolean = false; // Controls the visibility of the modal
  patients: any[] = []; // Array to hold patient data
  patient = {
    patientId: 0,
    nom: '',
    prenom: '',
    email: '',
    adresse: '',
    dateNaiss: '',
    tel: ''
  };
  filteredPatients: any[] = []; // Array to hold filtered patient data
  searchTerm: string = ''; // Search term for filtering
  displayDeleteModal: boolean | undefined;
  errorMessage: string = ''; // Variable to store error messages

  constructor(private patientService: PatientService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Fetch patient data from the service (patients associated with the logged-in user)
    this.patientService.getPatientsByUserId().subscribe(
      (data: Patient[]) => {
        this.patients = data;
        this.filteredPatients = data; // Initialize filteredPatients with full data
      },
      (error) => {
        console.error('Error fetching patients data:', error);
        this.errorMessage = 'Unable to fetch patients data. Please try again later.';
      }
    );
  }

  // Open the modal
  openAddPatientModal() {
    this.displayModal = true;
  }

  // Close the modal
  closeAddPatientModal() {
    this.displayModal = false;
  }

  // Submit the form
  onSubmit() {
    this.patientService.addPatient(this.patient).subscribe(
      (response: Patient) => {
        console.log('Patient added successfully', response);

        // Add the new patient to the list dynamically
        this.patients.push(response);

        // Reset the form
        this.patient = {
          patientId: 0,
          nom: '',
          prenom: '',
          email: '',
          adresse: '',
          dateNaiss: '',
          tel: ''
        };

        // Close the modal
        this.displayModal = false;

        // Ensure the view is updated
        this.cd.detectChanges();
        // Reload the list of patients
        this.patientService.getPatientsByUserId().subscribe(
          (data: Patient[]) => {
            this.patients = data;
            this.filteredPatients = data; // Update filtered patients too
          },
          (error) => {
            console.error('Error fetching updated patient list:', error);
          }
        );
      },
      (error) => {
        console.error('Error occurred during submission', error);
        this.errorMessage = 'Error occurred during submission. Please try again.';
      }
    );
  }

  // Method to filter patients based on the search term
  searchPatients() {
    const term = this.searchTerm ? this.searchTerm.trim().toLowerCase() : '';
    if (term === '') {
      this.filteredPatients = this.patients; // Show all patients if search term is empty
    } else {
      this.filteredPatients = this.patients.filter((patient) =>
        patient.nom.toLowerCase().includes(term) ||
        patient.prenom.toLowerCase().includes(term) ||
        patient.email.toLowerCase().includes(term)
      );
    }
  }

  // Control dialog visibility for deleting a patient
  deletePatientDialog: boolean = false;

  // Handle opening the delete confirmation dialog
  openDeletePatientModal(patient: Patient) {
    this.selectedPatient = patient;
    this.deletePatientDialog = true;  // Show the dialog
  }

  // Handle closing the delete confirmation dialog
  closeDeleteDialog() {
    this.deletePatientDialog = false;  // Hide the dialog
  }

  // Handle the deletion of the patient
  deletePatient() {
    if (this.selectedPatient) {
      console.log('Deleting patient with ID:', this.selectedPatient.patientId);  // Log patient ID

      // Delete the patient
      this.patientService.deletePatient(this.selectedPatient.patientId).subscribe({
        next: () => {
          // Ensure the view is updated
          this.cd.detectChanges(); // Manually trigger change detection

          // Reload the list of patients
          this.patientService.getPatientsByUserId().subscribe(
            (data: Patient[]) => {
              this.patients = data;
              this.filteredPatients = data; // Update filtered patients too
            },
            (error) => {
              console.error('Error fetching updated patient list:', error);
            }
          );

          // Close the delete dialog
          this.closeDeleteDialog();
        },
        error: (err) => {
          console.error('Error deleting patient:', err);
          this.errorMessage = 'Error occurred while deleting the patient. Please try again.';
        }
      });
    }
  }

  printMedicalRecord(patientId: string): void {
    // Get the modal content by ID
    const modalContent = document.getElementById(`medicalRecordContent${patientId}`);
    if (modalContent) {
      // Open a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        // Add the modal content to the new window
        printWindow.document.write(`
          <html>
            <head>
              <title>Dossier Médical</title>
              <style>
                /* Add basic styles for print */
                body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                table, th, td {
                  border: 1px solid black;
                }
                th, td {
                  padding: 10px;
                  text-align: left;
                }
                .img-circle {
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                }
              </style>
            </head>
            <body>
              ${modalContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  }
}
