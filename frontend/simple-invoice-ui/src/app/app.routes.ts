import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ClientesComponent } from './pages/clientes/clientes.component';


// export const routes: Routes = [
//     {
//       path: 'clientes',
//       component: ClientesComponent
//     },
//     {
//       path: '',
//       redirectTo: 'clientes',
//       pathMatch: 'full'
//     }
//   ];
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'clientes', component: ClientesComponent }
  ];