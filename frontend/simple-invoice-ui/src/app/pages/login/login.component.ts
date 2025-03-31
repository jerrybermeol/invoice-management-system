import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        // Guardar el token en localStorage
        localStorage.setItem('token', response.token);

        // Redirigir a la vista principal
        this.router.navigate(['/clientes']);
      },
      error: (error) => {
        console.error(error);
        this.form.setErrors({ auth: true }); // Mostrar error si las credenciales fallan
      }
    });
  }
}