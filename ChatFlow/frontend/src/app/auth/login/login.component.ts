import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
  console.log('BOTON PRESIONADO');

  if (this.loginForm.invalid) {

    this.loginForm.markAllAsTouched();

    console.log('FORM INVALIDO', this.loginForm.value);

    return;
  }

  this.loading = true;

  console.log('ENVIANDO LOGIN');

  this.authService
    .login(
      this.loginForm.value.email,
      this.loginForm.value.password
    )
    .subscribe({

      next: (response) => {

        console.log('LOGIN OK', response);

        this.toastService.show(
          '¡Login exitoso! 🚀',
          'success'
        );

        this.loading = false;

        this.router.navigate(['/pipeline']);
      },

      error: (err) => {

        console.error('ERROR LOGIN', err);

        this.toastService.show(
          'Credenciales inválidas',
          'error'
        );

        this.loading = false;
      }

    });
}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}