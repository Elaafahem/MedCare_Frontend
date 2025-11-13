export interface Medicament {
  medicamentId: number;
  nom: string;
  description: string;
  categorieId: number;
  categorie: {
    categorieId: number;
    nom: string;
  };
}
