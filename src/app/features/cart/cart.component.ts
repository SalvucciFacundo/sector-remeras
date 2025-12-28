import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  template: `
    <section class="cart-page">
      <div class="container">
        <h2 class="graffiti-text glow-secondary">Tu Carrito</h2>

        @if (cart.items().length === 0) {
        <div class="empty-cart glass">
          <p>Tu carrito está vacío.</p>
          <button class="btn-primary" (click)="goHome()">Ir a ver productos</button>
        </div>
        } @else {
        <div class="cart-grid">
          <div class="cart-items">
            @for (item of cart.items(); track item.cartId) {
            <div class="cart-item glass">
              <img [src]="item.image" [alt]="item.title" />
              <div class="item-info">
                <h3>{{ item.title }}</h3>
                @if (item.size) {
                <span class="size-tag">Talla: {{ item.size }}</span>
                }
                <p class="price">{{ item.price | currency }}</p>
                <div class="quantity-controls">
                  <button (click)="cart.updateQuantity(item.cartId, -1)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="cart.updateQuantity(item.cartId, 1)">+</button>
                </div>
              </div>
              <button class="remove-btn" (click)="cart.removeFromCart(item.cartId)">&times;</button>
            </div>
            }
          </div>

          <div class="cart-summary glass">
            <h3>Resumen</h3>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ cart.totalAmount() | currency }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ cart.totalAmount() | currency }}</span>
            </div>
            <button class="btn-primary full-width" (click)="checkout()">Finalizar Pedido</button>
          </div>
        </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .cart-page {
        padding: 8rem 2rem 4rem;
      }

      .container {
        max-width: 1000px;
        margin: 0 auto;
      }

      h2 {
        font-size: 3rem;
        margin-bottom: 2rem;
        text-align: center;
      }

      .empty-cart {
        padding: 4rem;
        text-align: center;
        border-radius: 20px;
      }

      .empty-cart p {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        color: var(--text-muted);
      }

      .cart-grid {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 2rem;
      }

      @media (max-width: 900px) {
        .cart-grid {
          grid-template-columns: 1fr;
        }
      }

      .cart-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .cart-item {
        display: flex;
        align-items: center;
        padding: 1.5rem;
        border-radius: 12px;
        gap: 1.5rem;
        position: relative;
      }

      .cart-item img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
      }

      .item-info {
        flex: 1;
      }

      .item-info h3 {
        font-size: 1.2rem;
        margin-bottom: 0.2rem;
      }

      .size-tag {
        display: inline-block;
        background: rgba(0, 236, 255, 0.1);
        color: var(--primary);
        font-size: 0.75rem;
        font-weight: 800;
        padding: 2px 8px;
        border-radius: 4px;
        margin-bottom: 0.8rem;
        border: 1px solid rgba(0, 236, 255, 0.2);
      }

      .price {
        color: #fff;
        font-weight: 700;
        margin-bottom: 1rem;
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .quantity-controls button {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-weight: 700;
      }

      .remove-btn {
        background: none;
        color: var(--text-muted);
        font-size: 1.5rem;
        position: absolute;
        top: 1rem;
        right: 1rem;
      }

      .remove-btn:hover {
        color: #ff4444;
      }

      .cart-summary {
        padding: 2rem;
        border-radius: 12px;
        height: fit-content;
        border: 1px solid var(--primary);
      }

      .cart-summary h3 {
        margin-bottom: 2rem;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        color: var(--text-muted);
      }

      .summary-row.total {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 1.5rem;
        color: white;
        font-weight: 700;
      }

      .full-width {
        width: 100%;
        margin-top: 2rem;
        padding: 1.2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  cart = inject(CartService);

  goHome() {
    window.location.href = '/';
  }

  checkout() {
    alert('Próximamente: Integración con Mercado Pago o WhatsApp.');
  }
}
