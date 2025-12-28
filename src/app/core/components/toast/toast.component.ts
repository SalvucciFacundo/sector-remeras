import { Component, inject } from '@angular/core';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  template: `
    <div class="toast-container">
      @for (t of ui.toasts(); track t.id) {
      <div class="toast animate-slide" [class]="t.type" (click)="ui.removeToast(t.id)">
        <div class="icon">
          @if (t.type === 'success') { ✅ } @else if (t.type === 'error') { ⚠️ } @else { ℹ️ }
        </div>
        <p>{{ t.message }}</p>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 100px;
        right: 2rem;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        pointer-events: none;
      }

      .toast {
        pointer-events: auto;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        color: white;
        min-width: 280px;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        cursor: pointer;
        transition: 0.3s;
      }

      .toast:hover {
        transform: scale(1.02);
        filter: brightness(1.2);
      }

      .toast.success {
        border-left: 4px solid var(--primary);
        box-shadow: 0 0 20px rgba(0, 236, 255, 0.1);
      }
      .toast.error {
        border-left: 4px solid #ff4757;
        box-shadow: 0 0 20px rgba(255, 71, 87, 0.1);
      }
      .toast.info {
        border-left: 4px solid var(--secondary);
      }

      .icon {
        font-size: 1.2rem;
        flex-shrink: 0;
      }

      p {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 600;
        line-height: 1.4;
      }

      .animate-slide {
        animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(100%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
    `,
  ],
})
export class ToastComponent {
  protected ui = inject(UiService);
}
