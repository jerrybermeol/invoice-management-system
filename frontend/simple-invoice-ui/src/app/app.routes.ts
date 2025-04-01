import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { authGuard } from './shared/guards/auth.guard';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';



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

// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
//   { path: 'clientes', loadComponent: () => import('./pages/clientes/clientes.component').then(m => m.ClientesComponent) },
//   { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
//   { path: 'productos',loadComponent: () => import('./pages/productos/productos.component').then((m) => m.ProductosComponent),},
  
// ];
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => LoginComponent),
  },
  {
    path: 'clientes',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/clientes/clientes.component').then(m => m.ClientesComponent)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent)
  },
  {
    path: 'productos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/productos/productos.component').then(m => m.ProductosComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];