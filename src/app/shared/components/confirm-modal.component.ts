import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { UiService } from '../../core/services/ui.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (ui.confirmData(); as data) {
    <div class="modal-overlay" (click)="ui.resolveConfirm(false)">
      <div class="modal-card glass animate-pop" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <h2 class="graffiti-text">{{ data.title }}</h2>
        </header>
        <div class="modal-body">
          <p>{{ data.message }}</p>
        </div>
        <footer class="modal-actions">
          <button class="btn-cancel" (click)="ui.resolveConfirm(false)">CANCELAR</button>
          <button class="btn-confirm" (click)="ui.resolveConfirm(true)">CONFIRMAR</button>
        </footer>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }

      .modal-card {
        width: 90%;
        max-width: 450px;
        padding: 2.5rem;
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }

      .modal-header h2 {
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: var(--primary);
      }

      .modal-body p {
        color: var(--text-muted);
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2.5rem;
      }

      .modal-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      button {
        padding: 1rem;
        border-radius: 12px;
        font-weight: 800;
        cursor: pointer;
        transition: 0.3s;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.9rem;
      }

      .btn-cancel {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
      }

      .btn-cancel:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .btn-confirm {
        background: var(--primary);
        border: 1px solid var(--primary);
        color: #000;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
      }

      .btn-confirm:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 255, 255, 0.5);
      }

      .animate-pop {
        animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      @keyframes pop {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  protected ui = inject(UiService);
}
