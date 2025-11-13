import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { SidebarComponent } from "../../shared/sidebar/sidebar.component";
import { FooterComponent } from "../../shared/footer/footer.component";

@Component({
  selector: 'app-sous-categorie',
  standalone: true,
  imports: [HeaderComponent, 
    SidebarComponent, 
    FooterComponent,SidebarComponent],
  templateUrl: './sous-categorie.component.html',
  styleUrl: './sous-categorie.component.css'
})
export class SousCategorieComponent {

}
