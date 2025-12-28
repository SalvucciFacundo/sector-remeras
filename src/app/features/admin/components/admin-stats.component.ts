import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  template: `
    <div class="stats-dashboard glass animate-fade">
      <h3>Dashboard de Ventas</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <span>Productos Totales</span>
          <strong>{{ products().length }}</strong>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .stats-dashboard {
        padding: 2rem;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      h3 {
        font-family: var(--graffiti-font);
        color: var(--primary);
        font-size: 1.4rem;
        text-transform: uppercase;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }
      .stat-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 1.5rem;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .stat-card span {
        font-size: 0.8rem;
        color: var(--text-muted);
        text-transform: uppercase;
      }
      .stat-card strong {
        font-size: 2rem;
        color: var(--primary);
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
export class AdminStatsComponent {
  private productService = inject(ProductService);
  products = this.productService.products;
}
