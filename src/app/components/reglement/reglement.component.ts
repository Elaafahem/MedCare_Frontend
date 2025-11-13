import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,ReactiveFormsModule,Validators } from '@angular/forms';
import { HeaderComponent } from "../shared/header/header.component";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reglement',
  standalone: true,
  imports: [ HeaderComponent, FooterComponent, SidebarComponent
    ,ReactiveFormsModule,MultiSelectModule,DropdownModule,
    CommonModule,SidebarComponent
  ],
  templateUrl: './reglement.component.html',
  styleUrl: './reglement.component.css'
})
export class ReglementComponent implements OnInit {
 

  displayModal: boolean = false;  // Control modal visibility
  paymentModalForm!: FormGroup;   // FormGroup for modal form

  // Payment methods options
  paymentMethods = [
    { label: 'Carte de Crédit', value: 'creditCard' },
    { label: 'Espèce', value: 'cash' },
    { label: 'Virement Bancaire', value: 'bankTransfer' }
  ];
  visits = [
    { id: 1, name: 'Visite 1', amount: 50 },
    { id: 2, name: 'Visite 2', amount: 75 },
    { id: 3, name: 'Visite 3', amount: 100 }
  ];
  selectedVisits: any[] = [];
  totalAmount = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    
    this.paymentModalForm = this.fb.group({
      nom: ['', Validators.required],
      visits: [this.selectedVisits],
      paymentAmount: [null, Validators.required],
      paymentMethod: ['', Validators.required],
      cardNumber: [''],
      cardExpiry: [''],
      cardCvc: [''],
      paymentNote: ['']
    });
  }

  onVisitsChange(): void {
    // Recalculate total amount based on selected visits
    this.totalAmount = this.selectedVisits.reduce((sum, visit) => {
      return sum + visit.amount;
    }, 0);
  }

  onSubmit(): void {
    const paymentData = {
      visits: this.selectedVisits,
      totalAmount: this.totalAmount
    };
    console.log('Payment Data:', paymentData);
    console.log('Payment Modal Submitted:', this.paymentModalForm.value);
    // Send paymentData to backend API
  }
  // When the payment form is submitted
  onPaymentSubmit(): void {
    console.log('Payment Modal Submitted:', this.paymentModalForm.value);
    // Handle the logic for submitting the payment data (e.g., send it to the backend)
    // For example: this.paymentService.processPayment(this.paymentModalForm.value);
  }
  // Method to reset the form
  resetForm() {
    this.paymentModalForm.reset();
    // Optionally reset any other state variables if needed
  }
}
 


