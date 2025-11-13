import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { FooterComponent } from "../footer/footer.component";
import { VisitService } from '../../../Services/visite.service';
import { Visit } from '../../../models/visite.model';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../Services/patient.service';
import { Patient } from '../../../models/patient.model';
import { DashboardService } from '../../../Services/dashboard.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { CategorieService } from '../../../Services/categorie.service';
import { Categorie } from '../../../models/categorie.model';
import { AuthService } from '../../../Services/auth.service';
import { AfterViewInit, Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-dashoard',
    standalone: true,
    templateUrl: './dashoard.component.html',
    styleUrl: './dashoard.component.css',
    imports: [HeaderComponent, SidebarComponent, FooterComponent, CommonModule]
})
export class DashoardComponent implements OnInit, AfterViewInit {
  visits: Visit[] = [];
  recentVisits: Visit[] = [];
  totalPatients: number = 0;
  totalVisits: number = 0;
  patientGrowthPercentage: number = 0;
  visitGrowthPercentage: number = 0;
  patients: Patient[] = [];
  categories:Categorie[]=[];
  currentUser: any = null;
  totalUsers: number = 0;
  patientsByUser: { username: string, patientCount: number }[] = [];
  userRole: string = '';
  private charts: { [key: string]: any } = {};

  constructor(
    private visitService: VisitService,
    private dashboardService: DashboardService,
    private patientService: PatientService,
    private categorieService: CategorieService,
    private authService: AuthService 


  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || 'defaultRole'; // Remplace 'defaultRole' par un rôle par défaut de votre choix
    console.log('Role depuis localStorage:', this.userRole); 
    this.loadDashboardData();
    this.loadConnectedUser();
  }

  ngAfterViewInit(): void {
    // Charts will be rendered after data is loaded
  }
  private loadConnectedUser(): void {
    this.authService.loadUser().subscribe({
      next: (user: any) => {
        this.currentUser = user;
        if (this.currentUser.role === 'Admin') {
          this.getTotalUsers();         
          this.getPatientsGroupedByUser(); 
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement de l\'utilisateur connecté :', error);
      }
    });
  }
  private getTotalUsers(): void {
    this.dashboardService.getAllUsers().subscribe(
      (users: any[]) => {
        console.log(users); // Vérifie ici les données retournées
  
        // Filtre les utilisateurs ayant le rôle 'medecin'
        const medecins = users.filter(user => user.role === 'Medecin'); 
        
        // Met à jour la variable totalUsers avec le nombre de médecins
        this.totalUsers = medecins.length;
  
        // Si tu veux aussi afficher les médecins avec leurs comptes de patients
        this.patientsByUser = medecins.map(user => ({
          username: user.username,  // Assure-toi que 'username' est bien une propriété dans 'user'
          patientCount: user.patientCount || 0  // Utilise 'patientCount' ou une valeur par défaut
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }
  
  
  private getPatientsGroupedByUser(): void {
    this.patientService.getPatientsByUserId().subscribe(
      (patients: Patient[]) => {
        console.log(patients); // ✅ ici aussi c’est un tableau
      },
      (error) => {
        console.error('Erreur lors de la récupération des patients', error);
      }
    );
    
  }
  
  
  private loadDashboardData(): void {
    // Load all required data
    this.loadVisits();
    this.getTotalPatients();
    this.getTotalVisits();
    this.loadPatients();
    this.loadCategories();
    
  }
  private loadCategories(): void {
    // Load categories data from the category service
    this.categorieService.getCategoriesByUserId().subscribe({
      next: (data: Categorie[]) => {
        this.categories = data;
        this.renderCategoriesDonutChart(); // Render donut chart after categories are loaded
      },
      error: (error: Error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  private renderCategoriesDonutChart(): void {
    const categoryNames = this.categories.map(category => category.nom);

    const ctx = document.getElementById('categoriesDonutChart') as HTMLCanvasElement;
    if (ctx) {
      if (this.charts['categoriesDonut']) {
        this.charts['categoriesDonut'].destroy(); // Destroy the old chart if exists
      }

      const config: ChartConfiguration = {
        type: 'doughnut', // Type de graphique donut
        data: {
          labels: categoryNames, // Noms des catégories
          datasets: [{
            data: categoryNames.map(() => 1), // Chaque catégorie reçoit une valeur de "1" pour la répartition
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#FF5733',
              '#4CAF50',
              '#FFC107'
            ], // Couleurs pour chaque catégorie
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Distribution des Catégories'
            }
          }
        }
      };

      this.charts['categoriesDonut'] = new Chart(ctx, config); // Create and render the donut chart
    }
  }
  private loadVisits(): void {
    this.visitService.getVisitHistory().subscribe({
      next: (data: Visit[]) => {
        this.visits = data;
        this.recentVisits = data.slice(0, 5); // Get last 5 visits
        this.renderVisitTrendsChart();
        this.renderVisitTypesChart();
      },
      error: (error: Error) => {
        console.error('Error fetching visits:', error);
      }
    });
  }

  private loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data: Patient[]) => {
        this.patients = data;
        this.renderVisitsByPatientChart();
      },
      error: (error: Error) => {
        console.error('Error fetching patients:', error);
      }
    });
  }

  getTotalPatients(): void {
    this.dashboardService.getTotalPatients().subscribe({
      next: (data: number) => {
        this.totalPatients = data;
      },
      error: (error: Error) => {
        console.error('Error fetching total patients:', error);
      }
    });
  }

  
  getTotalVisits(): void {
    this.dashboardService.getTotalVisits().subscribe({
      next: (data: number) => {
        this.totalVisits = data;
      },
      error: (error: Error) => {
        console.error('Error fetching total visits:', error);
      }
    });
  }

  

  formatDuration(date: string): string {
    const now = new Date();
    const visitDate = new Date(date);
    const duration = Math.floor((now.getTime() - visitDate.getTime()) / (1000 * 60)); // Duration in minutes

    if (duration < 60) return `${duration} min`;
    if (duration < 1440) return `${Math.floor(duration / 60)} hrs`;
    return`${Math.floor(duration / 1440)} days`;
  }

  private renderVisitsByPatientChart(): void {
    const patientVisits = new Map<string, number>();
    
    this.patients.forEach(patient => {
      this.visitService.GetVisitesByPatient(patient.patientId).subscribe(visits => {
        patientVisits.set(`${patient.nom} ${patient.prenom}`, visits.length);
        
        if (patientVisits.size === this.patients.length) {
          const ctx = document.getElementById('visitsByPatientChart') as HTMLCanvasElement;
          if (ctx) {
            if (this.charts['visitsByPatient']) {
              this.charts['visitsByPatient'].destroy();
            }
            
            const config: ChartConfiguration = {
              type: 'bar',
              data: {
                labels: Array.from(patientVisits.keys()),
                datasets: [{
                  label: 'Number of Visits',
                  data: Array.from(patientVisits.values()),
                  backgroundColor: '#4e73df',
                  borderColor: '#2e59d9',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  title: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Visits'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Patients'
                    }
                  }
                }
              }
            };
            
            this.charts['visitsByPatient'] = new Chart(ctx, config);
          }
        }
      });
    });
  }

  private renderVisitTrendsChart(): void {
    const visitsByDate = new Map<string, number>();
    
    this.visits.forEach(visit => {
      const date = new Date(visit.dateVisite).toLocaleDateString();
      visitsByDate.set(date, (visitsByDate.get(date) || 0) + 1);
    });

    const ctx = document.getElementById('visitTrendsChart') as HTMLCanvasElement;
    if (ctx) {
      if (this.charts['visitTrends']) {
        this.charts['visitTrends'].destroy();
      }

      const config: ChartConfiguration = {
        type: 'line',
        data: {
          labels: Array.from(visitsByDate.keys()),
          datasets: [{
            label: 'Visits per Day',
            data: Array.from(visitsByDate.values()),
            borderColor: '#2eca6a',
            tension: 0.1,
            fill: false
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Visits'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            }
          }
        }
      };

      this.charts['visitTrends'] = new Chart(ctx, config);
    }
  }

  private renderVisitTypesChart(): void {
    const visitTypes = new Map<string, number>();
    
    this.visits.forEach(visit => {
      const type = visit.motif || 'Unknown';
      visitTypes.set(type, (visitTypes.get(type) || 0) + 1);
    });

    const ctx = document.getElementById('visitTypesChart') as HTMLCanvasElement;
    if (ctx) {
      if (this.charts['visitTypes']) {
        this.charts['visitTypes'].destroy();
      }

      const config: ChartConfiguration = {
        type: 'doughnut',
        data: {
          labels: Array.from(visitTypes.keys()),
          datasets: [{
            data: Array.from(visitTypes.values()),
            backgroundColor: [
              '#4e73df',
              '#1cc88a',
              '#36b9cc',
              '#f6c23e',
              '#e74a3b',
              '#858796'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: false
            }
          }
        }
      };

      this.charts['visitTypes'] = new Chart(ctx, config);
    }
  }
}