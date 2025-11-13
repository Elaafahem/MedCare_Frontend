import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button'; // PrimeNG button
import { CalendarModule, DateAdapter } from 'angular-calendar'; // Calendar module
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'; // Date adapter
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import {IconFieldModule} from 'primeng/iconfield'
import { TableModule } from 'primeng/table'; // PrimeNG table module
import { InputTextModule } from 'primeng/inputtext'; // PrimeNG input text module
import { DropdownModule } from 'primeng/dropdown'; // PrimeNG dropdown module
import { MultiSelectModule } from 'primeng/multiselect'; // Multi-select filter
import { TagModule } from 'primeng/tag'; // PrimeNG tag module
import { RegisterComponent } from './register/register.component';
import { LoginAuthComponent } from './login-auth/login-auth.component';
import { AuthInterceptor } from './auth.interceptor';
import { UsersComponent } from './components/users/users.component';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    AppComponent,
    
    
  ],
  imports: [
    BrowserModule,
    LoginAuthComponent,
    RegisterComponent,
    AppRoutingModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    BrowserAnimationsModule,
    ButtonModule,
    IconFieldModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    TagModule,   FormsModule,
    ReactiveFormsModule, DialogModule,
  

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }), // Configure CalendarModule here
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true // Permet d'enregistrer plusieurs intercepteurs
  }

    
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }



// import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouterModule } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// import { AppComponent } from './app.component';
// import { AppRoutingModule } from './app-routing.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {ButtonModule} from 'primeng/button';
// import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
// import { FullCalendarModule } from '@fullcalendar/angular';
// import { FormsModule } from '@angular/forms';
// import { InputTextModule } from 'primeng/inputtext';
// import { InputTextareaModule } from 'primeng/inputtextarea';
// import { FileUploadModule } from 'primeng/fileupload';
// import { DialogModule } from 'primeng/dialog';


// @NgModule({
//     declarations: [
//         AppComponent,
//     ],
//     schemas: [CUSTOM_ELEMENTS_SCHEMA],
//     imports: [
//         BrowserModule,
//         InputTextModule,
//         InputTextareaModule,
//         FileUploadModule,
//         DialogModule,
//         AppRoutingModule,
//         RouterModule.forRoot([]),
//         HttpClientModule,
//         BrowserAnimationsModule,
//         BrowserModule,
//         ButtonModule,
//         CalendarModule.forRoot({
//             provide: DateAdapter,
//             useFactory: adapterFactory,
//           }),
//           FullCalendarModule,
//           FormsModule,
        
//     ],
//     providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }], // Utiliser HashLocationStrategy
//     bootstrap: [AppComponent],
    
// })
// export class AppModule { }
