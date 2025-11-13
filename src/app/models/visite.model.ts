import { Patient } from './patient.model';  // Import Patient interface
export interface Ordonnance {
  ordonnanceId: number;
  dateCreation: string;
  medicaments: string | null;
}

export interface Visit {
  visiteId: number;
  dateVisite: string;
  motif: string;
  diagnostic: string;
  patientId: number;
  patient: Patient;
  OrdonnaceId: number;
  ordonnance: Ordonnance;
}
