import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ProductService, Product } from '../../core/services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  template: `
    <section class="products-page">
      <div class="container">
        <h2 class="graffiti-text glow-primary">Catálogo de Prendas</h2>

        <div class="filters">
          <button (click)="filterBy('Todos')" [class.active]="currentFilter() === 'Todos'">
            Todos
          </button>
          @for (cat of categories(); track cat.id) {
          <button (click)="filterBy(cat.name)" [class.active]="currentFilter() === cat.name">
            {{ cat.name }}
          </button>
          }
        </div>

        <div class="grid">
          @for (item of filteredProducts(); track item.id) {
          <div class="card glass">
            <div class="card-image" [class.out-of-stock]="item.isOutOfStock">
              <img [src]="item.image" [alt]="item.title" loading="lazy" />
              @if (item.isOutOfStock) {
              <div class="sold-out-overlay">
                <span>OUT OF STOCK</span>
              </div>
              } @else {
              <div class="overlay">
                <button class="btn-primary" (click)="addToCart(item)">Añadir al Carrito</button>
                <button class="btn-secondary" [routerLink]="['/producto', item.id]">Detalle</button>
              </div>
              }
            </div>
            <div class="card-info">
              <span class="category">{{ item.category }}</span>
              <h3>{{ item.title }}</h3>
              @if (item.sizes && item.sizes.length > 0) {
              <div class="card-sizes">
                @for (s of item.sizes; track s) {
                <span>{{ s }}</span>
                }
              </div>
              }
              <p class="price">{{ item.price | currency }}</p>
            </div>
          </div>
          } @empty {
          <p class="no-results">No se encontraron productos en esta categoría.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .products-page {
        padding: 180px 2rem 4rem;
      }

      .container {
        max-width: 1400px;
        margin: 0 auto;
      }

      h2 {
        font-size: 4rem;
        margin-bottom: 4rem;
        text-align: center;
        font-family: var(--graffiti-font);
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .filters {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 4rem;
        flex-wrap: wrap;
      }

      .filters button {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        padding: 0.8rem 1.5rem;
        border-radius: 50px;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 0.8rem;
        transition: var(--transition);
      }

      .filters button.active,
      .filters button:hover {
        background: var(--primary);
        border-color: var(--primary);
        color: black;
        box-shadow: 0 0 20px rgba(0, 236, 255, 0.3);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }

      .card {
        border-radius: 20px;
        overflow: hidden;
        transition: var(--transition);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .card:hover {
        transform: translateY(-10px);
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      }

      .card-image {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
      }

      .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        opacity: 0;
        transition: var(--transition);
      }

      .card:hover .overlay {
        opacity: 1;
      }

      .sold-out-overlay {
        position: absolute;
        inset: 0;
        background: rgba(255, 71, 87, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 900;
        font-size: 1.2rem;
        transform: rotate(-5deg);
        z-index: 10;
      }

      .card-image.out-of-stock img {
        filter: grayscale(1) blur(2px);
      }

      .no-results {
        text-align: center;
        padding: 4rem;
        color: var(--text-muted);
        grid-column: 1 / -1;
        font-size: 1.2rem;
      }

      .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid white;
        color: white;
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 700;
        text-transform: uppercase;
      }

      .card-info {
        padding: 1.5rem;
      }

      .category {
        color: var(--secondary);
        font-size: 0.7rem;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .card-info h3 {
        font-size: 1.25rem;
        margin: 0.5rem 0;
      }

      .card-sizes {
        display: flex;
        gap: 0.4rem;
        margin-bottom: 0.8rem;
        flex-wrap: wrap;
      }

      .card-sizes span {
        font-size: 0.65rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        color: #aaa;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .price {
        font-size: 1.2rem;
        color: var(--primary);
        font-weight: 800;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  private cart = inject(CartService);
  private productService = inject(ProductService);

  currentFilter = signal('Todos');
  categories = this.productService.categories;

  filteredProducts = computed(() => {
    const products = this.productService.products();
    const filter = this.currentFilter();
    if (filter === 'Todos') return products;
    return products.filter((p) => p.category === filter);
  });

  filterBy(category: string) {
    this.currentFilter.set(category);
  }

  addToCart(product: Product) {
    this.cart.addToCart(product);
  }
}
