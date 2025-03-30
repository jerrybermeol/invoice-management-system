import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // 🔥 Fuerza mostrar errores
      return;
    }

    const { username, password } = this.form.value;

    if (username === 'admin' && password === 'admin') {
      this.router.navigate(['/clientes']);
    } else {
      this.form.setErrors({ auth: true });
    }
  }
}
