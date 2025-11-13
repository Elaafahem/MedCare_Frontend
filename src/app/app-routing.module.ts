import { RouterModule, Routes } from '@angular/router';
import { DashoardComponent } from './components/shared/dashoard/dashoard.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './components/shared/notfound/notfound.component';
import { AuthGuard } from './auth.gard';
import { ArticleComponent } from './components/stock/article/article.component';
import { CategorieComponent } from './components/stock/categorie/categorie.component';
import { SousCategorieComponent } from './components/stock/sous-categorie/sous-categorie.component';
import { ProfileComponent } from './components/profile/profile.component';
import { VisiteComponent } from './components/visite/visite.component';
import { ReglementComponent } from './components/reglement/reglement.component';
import { VisitTypeComponent } from './components/visit-type/visit-type.component';
import { UsersComponent } from './components/users/users.component';
import { LoginAuthComponent } from './login-auth/login-auth.component';
import { RegisterComponent } from './register/register.component';



export const routes: Routes = [
  {
    path: 'dashboard',
    pathMatch: 'full',
    component: DashoardComponent
  },
  {
    path: '',
    pathMatch: 'full',
    component: LoginAuthComponent
  },
  {
    path: 'Patients',
    pathMatch: 'full',
    component: PatientListComponent
  },
  {
    path: 'Calendar',
    pathMatch: 'full',
    component: CalendarComponent
  },
  {
    path: 'Categorie',
    pathMatch: 'full',
    component: CategorieComponent
  },
  {
    path: 'SousCategorie',
    pathMatch: 'full',
    component: SousCategorieComponent
  },
  {
    path: 'Article',
    pathMatch: 'full',
    component: ArticleComponent
  },
  {
    path: 'Visite',
    pathMatch: 'full',
    component: VisiteComponent
  },
  {
    path: 'Reglement',
    pathMatch: 'full',
    component: ReglementComponent
  },
  {
    path: 'Profile',
    pathMatch: 'full',
    component: ProfileComponent
  },
  {
    path: 'VisitTypeComponent',
    pathMatch: 'full',
    component: VisitTypeComponent
  },

  {
    path: 'notfound',
    pathMatch: 'full',
    component: NotfoundComponent
  },
  {
    path: 'Users',
    pathMatch: 'full',
    component: UsersComponent
  },
  {
    path: 'Login',
    pathMatch: 'full',
    component: LoginAuthComponent
  },

  { path: 'register', component: RegisterComponent },  // Ajoutez cette ligne
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: '**',
    redirectTo: 'notfound'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }