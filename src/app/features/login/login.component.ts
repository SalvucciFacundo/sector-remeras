import { Component, ChangeDetectionStrategy, signal, inject, output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <section class="login-page">
      <div class="glass login-card">
        <h2 class="graffiti-text glow-primary">Admin Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" formControlName="password" />
          </div>
          <button type="submit" class="btn-primary full-width" [disabled]="loading()">
            @if (loading()) { Entrando... } @else { Acceder }
          </button>
        </form>
      </div>
    </section>
  `,
  styles: [
    `
      .login-page {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }

      .login-card {
        width: 100%;
        max-width: 400px;
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
      }

      h2 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
      }

      .form-group {
        margin-bottom: 1.2rem;
        text-align: left;
      }

      label {
        display: block;
        margin-bottom: 0.4rem;
        color: var(--text-muted);
        font-size: 0.75rem;
        text-transform: uppercase;
      }

      input {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.7rem;
        border-radius: 8px;
        color: white;
      }

      .full-width {
        width: 100%;
        padding: 0.9rem;
        margin-top: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginSuccess = output<void>();
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loading = signal(false);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    const { email, password } = this.loginForm.value;

    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.loginSuccess.emit();
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error(err);
        alert('Error: Credenciales inválidas.');
        this.loading.set(false);
      },
    });
  }
}
