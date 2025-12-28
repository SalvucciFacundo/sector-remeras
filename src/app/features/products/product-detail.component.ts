import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  template: `
    <section class="detail-page">
      <div class="container">
        @if (product()) {
        <div class="product-layout" [class.global-out]="product()?.isOutOfStock">
          <div class="image-box glass">
            <img [src]="product()?.image" [alt]="product()?.title" />
            @if (product()?.isOutOfStock) {
            <div class="sold-out-badge">SOLD OUT</div>
            }
          </div>

          <div class="info-box">
            <span class="category">{{ product()?.category }}</span>
            <h1 class="graffiti-text glow-primary">{{ product()?.title }}</h1>
            <p class="price" [class.strike]="product()?.isOutOfStock">
              {{ product()?.price | currency }}
            </p>

            <div class="description">
              <h3>Resumen</h3>
              <p>
                {{
                  product()?.description ||
                    'Este diseño exclusivo ha sido estampado con las mejores técnicas urbanas. Calidad garantizada en cada fibra.'
                }}
              </p>
            </div>

            @if (!product()?.isOutOfStock && product()?.sizes && product()!.sizes!.length > 0) {
            <div class="sizes-section">
              <h3>Seleccionar Talla</h3>
              <div class="sizes-grid">
                @for (s of product()!.sizes; track s) {
                <button
                  class="size-btn"
                  [class.active]="selectedSize() === s"
                  [class.no-stock]="product()?.outOfStockSizes?.includes(s)"
                  [disabled]="product()?.outOfStockSizes?.includes(s)"
                  (click)="selectedSize.set(s)"
                >
                  {{ s }}
                  @if (product()?.outOfStockSizes?.includes(s)) {
                  <small class="no-stock-label">Sin Stock</small>
                  }
                </button>
                }
              </div>
            </div>
            }

            <div class="actions">
              @if (product()?.isOutOfStock) {
              <div class="out-of-stock-msg glass">
                <p>⚠️ Este producto se encuentra agotado actualmente.</p>
              </div>
              } @else {
              <button
                class="btn-primary full-width"
                (click)="addToCart()"
                [disabled]="product()?.sizes?.length && !selectedSize()"
              >
                {{
                  product()?.sizes?.length && !selectedSize()
                    ? 'Selecciona una talla'
                    : 'Añadir al Carrito'
                }}
              </button>
              }
              <button class="btn-secondary full-width" routerLink="/productos">
                Volver al Catálogo
              </button>
            </div>
          </div>
        </div>
        } @else if (loading()) {
        <div class="loading">Cargando detalles del diseño...</div>
        } @else {
        <div class="error">
          <h2>Oops!</h2>
          <p>No pudimos encontrar este producto.</p>
          <button class="btn-primary" routerLink="/productos">Volver</button>
        </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .detail-page {
        padding: 10rem 2rem 5rem;
        min-height: 100vh;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .product-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
      }

      .product-layout.global-out {
        opacity: 0.8;
      }

      @media (max-width: 900px) {
        .product-layout {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      }

      .image-box {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        aspect-ratio: 1/1.2;
      }

      .image-box img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .sold-out-badge {
        position: absolute;
        top: 2rem;
        right: -2rem;
        background: #ff4757;
        color: white;
        padding: 0.5rem 4rem;
        font-weight: 900;
        transform: rotate(45deg);
        box-shadow: 0 5px 15px rgba(255, 71, 87, 0.4);
      }

      .category {
        color: var(--secondary);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 0.9rem;
      }

      h1 {
        font-size: 4rem;
        margin: 1rem 0;
        line-height: 1;
      }

      .price {
        font-size: 2.5rem;
        color: var(--primary);
        font-weight: 700;
        margin-bottom: 2rem;
      }

      .price.strike {
        text-decoration: line-through;
        opacity: 0.5;
      }

      .description {
        margin-bottom: 2rem;
      }

      .description h3,
      .sizes-section h3 {
        font-family: var(--graffiti-font);
        margin-bottom: 1rem;
        font-size: 1.2rem;
        text-transform: uppercase;
      }

      .description p {
        color: var(--text-muted);
        font-size: 1.1rem;
        line-height: 1.8;
      }

      .sizes-section {
        margin-bottom: 3rem;
      }

      .sizes-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .size-btn {
        position: relative;
        min-width: 80px;
        height: 60px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.3s;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .size-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--primary);
      }

      .size-btn.active {
        background: var(--primary);
        color: #000;
        border-color: var(--primary);
        box-shadow: 0 0 15px var(--primary);
      }

      .size-btn.no-stock {
        opacity: 0.4;
        cursor: not-allowed;
        border-color: transparent;
        background: rgba(0, 0, 0, 0.2);
      }

      .no-stock-label {
        font-size: 0.6rem;
        text-transform: uppercase;
        margin-top: 2px;
      }

      .out-of-stock-msg {
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid #ff4757;
        margin-bottom: 1rem;
        color: #ff4757;
        font-weight: 600;
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 1rem;
      }

      .full-width {
        width: 100%;
        padding: 1.2rem;
        font-size: 1.1rem;
      }

      .loading,
      .error {
        text-align: center;
        padding: 5rem;
        font-size: 1.5rem;
        color: var(--text-muted);
      }

      button:disabled:not(.no-stock) {
        opacity: 0.5;
        cursor: not-allowed;
        filter: grayscale(1);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  selectedSize = signal<string | null>(null);
  loading = signal(true);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const data = await this.productService.getProductById(id);
      this.product.set(data);
    }
    this.loading.set(false);
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.selectedSize() || undefined);
    }
  }
}
