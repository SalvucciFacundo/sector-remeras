import { Injectable, signal, computed, inject } from '@angular/core';
import { UiService } from './ui.service';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  cartId: string; // Unique key for product + size combo
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private ui = inject(UiService);
  private _items = signal<CartItem[]>([]);

  items = computed(() => this._items());

  totalCount = computed(() => this._items().reduce((acc, item) => acc + item.quantity, 0));

  totalAmount = computed(() =>
    this._items().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  addToCart(product: any, size?: string) {
    const cartId = size ? `${product.id}_${size}` : product.id;

    this._items.update((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) => (i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...product, quantity: 1, size, cartId }];
    });

    this.ui.showToast(`¡${product.title} añadido!`);
  }

  removeFromCart(cartId: string) {
    const item = this._items().find((i) => i.cartId === cartId);
    this._items.update((prev) => prev.filter((i) => i.cartId !== cartId));
    if (item) this.ui.showToast(`${item.title} eliminado del carrito`, 'info');
  }

  updateQuantity(cartId: string, delta: number) {
    this._items.update((prev) =>
      prev.map((i) => {
        if (i.cartId === cartId) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  }

  clearCart() {
    this._items.set([]);
    this.ui.showToast('Carrito vaciado', 'info');
  }
}
