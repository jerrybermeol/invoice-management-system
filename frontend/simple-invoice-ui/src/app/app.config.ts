import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { withInterceptorsFromDi, provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { authInterceptor } from './shared/interceptors/auth.interceptor';

export const appConfig = {
  providers: [
    provideRouter(routes),
    
    // 👇 Esta es la forma correcta
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),

    importProvidersFrom(FormsModule),
    importProvidersFrom(ReactiveFormsModule)

  ]
};
