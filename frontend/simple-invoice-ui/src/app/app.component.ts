import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private router = inject(Router);
  isLoginPage: boolean = false;

  constructor() {
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url.includes('/login');
    });
  }
}
