import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-socials',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="socials-manager glass animate-fade">
      <header class="tab-header">
        <h3>Redes Sociales</h3>
        <p class="subtitle">Configura los enlaces que aparecen en el pie de página de la web.</p>
      </header>

      <form [formGroup]="socialsForm" (ngSubmit)="saveSocials()" class="socials-form">
        <div class="form-group">
          <label>Instagram URL</label>
          <input
            type="text"
            formControlName="instagram"
            placeholder="https://instagram.com/tu_cuenta"
          />
        </div>

        <div class="form-group">
          <label>Facebook URL</label>
          <input
            type="text"
            formControlName="facebook"
            placeholder="https://facebook.com/tu_pagina"
          />
        </div>

        <div class="form-group">
          <label>WhatsApp (Solo número con código de país)</label>
          <input type="text" formControlName="whatsapp" placeholder="Ej: 541122334455" />
          <p class="input-hint">El link se generará automáticamente como wa.me/nuestro_numero</p>
        </div>

        <button type="submit" class="btn-primary" [disabled]="loading()">
          {{ loading() ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .socials-manager {
        padding: 2.5rem;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        max-width: 600px;
      }

      h3 {
        font-family: var(--graffiti-font);
        color: var(--primary);
        font-size: 1.6rem;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }

      .subtitle {
        color: var(--text-muted);
        margin-bottom: 2.5rem;
        font-size: 0.95rem;
      }

      .socials-form {
        display: flex;
        flex-direction: column;
        gap: 1.8rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--text-muted);
        font-weight: 700;
      }

      input {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.9rem 1.2rem;
        border-radius: 10px;
        color: white;
        font-size: 1rem;
        transition: 0.3s;
      }

      input:focus {
        border-color: var(--primary);
        box-shadow: 0 0 15px rgba(0, 236, 255, 0.1);
        outline: none;
      }

      .input-hint {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 0.3rem;
        font-style: italic;
      }

      .btn-primary {
        padding: 1.1rem;
        margin-top: 1rem;
        font-weight: 800;
        letter-spacing: 1px;
      }

      .animate-fade {
        animation: fadeIn 0.4s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSocialsComponent {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  loading = signal(false);

  socialsForm = this.fb.group({
    instagram: [''],
    facebook: [''],
    whatsapp: [''],
  });

  constructor() {
    // Fill the form when data loads
    effect(() => {
      const links = this.productService.socialLinks();
      this.socialsForm.patchValue(links, { emitEvent: false });
    });
  }

  async saveSocials() {
    this.loading.set(true);
    try {
      await this.productService.updateSocials(this.socialsForm.value as any);
      alert('Redes sociales actualizadas con éxito');
    } catch (error) {
      console.error(error);
      alert('Error al guardar');
    } finally {
      this.loading.set(false);
    }
  }
}
