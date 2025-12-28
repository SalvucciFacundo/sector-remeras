import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService, Product } from '../../core/services/product.service';
import { CurrencyPipe } from '@angular/common';
import { UiService } from '../../core/services/ui.service';

@Component({
  selector: 'app-custom-order',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <section class="custom-order-page">
      <div class="container">
        <header class="page-header">
          <h2 class="graffiti-text glow-primary">Diseño Custom</h2>
          <p class="subtitle">Personaliza nuestras prendas con tu propio arte o marca.</p>
        </header>

        <form [formGroup]="orderForm" (ngSubmit)="onSubmit()" class="custom-grid">
          <!-- STEP 1: SELECT BASE PRODUCT -->
          <div class="section-box glass">
            <h3 class="step-title"><span>01</span> Elige la prenda base</h3>

            <div class="mini-filters">
              <button
                type="button"
                (click)="filterBy('Todos')"
                [class.active]="currentFilter() === 'Todos'"
              >
                Todos
              </button>
              @for (cat of categories(); track cat.id) {
              <button
                type="button"
                (click)="filterBy(cat.name)"
                [class.active]="currentFilter() === cat.name"
              >
                {{ cat.name }}
              </button>
              }
            </div>

            <div class="product-selection-grid">
              @for (item of filteredProducts(); track item.id) {
              <div
                class="select-card"
                [class.selected]="selectedProduct()?.id === item.id"
                (click)="selectProduct(item)"
              >
                <div class="card-img">
                  <img [src]="item.image" [alt]="item.title" />
                  @if (selectedProduct()?.id === item.id) {
                  <div class="check-badge">✓</div>
                  }
                </div>
                <div class="card-meta">
                  <span class="name">{{ item.title }}</span>
                  <span class="price">{{ item.price | currency }}</span>
                </div>
              </div>
              } @empty {
              <p class="empty-msg">No hay prendas en esta categoría.</p>
              }
            </div>
            @if (orderForm.get('productId')?.touched && orderForm.get('productId')?.invalid) {
            <p class="error-msg">Por favor, selecciona una prenda de base.</p>
            }
          </div>

          <div class="right-column">
            <!-- STEP 2: UPLOAD IMAGE (PRIORITY) -->
            <div class="section-box glass highlight">
              <h3 class="step-title"><span>02</span> Sube tu diseño</h3>
              <p class="hint">
                JPG, PNG o PDF (Max 10MB). La mejor calidad garantiza un mejor estampado.
              </p>

              <div class="upload-zone" [class.has-file]="previewUrl()">
                <input
                  type="file"
                  id="design-file"
                  (change)="onFileSelected($event)"
                  accept="image/*"
                />
                @if (previewUrl()) {
                <div class="preview-container">
                  <img [src]="previewUrl()" alt="Vista previa del diseño" />
                  <button type="button" class="remove-btn" (click)="removeImage($event)">
                    &times;
                  </button>
                </div>
                } @else {
                <div class="upload-placeholder">
                  <i class="upload-icon">↑</i>
                  <span>Arrastra o haz click para subir</span>
                </div>
                }
              </div>
            </div>

            <!-- STEP 3: DETAILS -->
            <div class="section-box glass">
              <h3 class="step-title"><span>03</span> Detalles y Contacto</h3>

              <div class="form-group">
                <label>Descripción y especificaciones</label>
                <textarea
                  formControlName="description"
                  placeholder="Explícanos tu idea: ubicación del estampado (pecho, espalda, mangas), colores, etc."
                ></textarea>
              </div>

              <div class="form-group">
                <label>Tu WhatsApp o Email</label>
                <input
                  type="text"
                  formControlName="contact"
                  placeholder="¿Dónde te contactamos para el presupuesto?"
                />
              </div>

              <button
                type="submit"
                class="btn-primary full-width submit-btn"
                [disabled]="orderForm.invalid || isSubmitting()"
              >
                @if (isSubmitting()) {
                <span>Enviando...</span>
                } @else {
                <span>Pedir Presupuesto</span>
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [
    `
      .custom-order-page {
        padding: 180px 2rem 6rem;
      }

      .container {
        max-width: 1400px;
        margin: 0 auto;
      }

      .page-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      h2 {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .subtitle {
        color: var(--text-muted);
        font-size: 1.2rem;
      }

      .custom-grid {
        display: grid;
        grid-template-columns: 1fr 450px;
        gap: 2rem;
        align-items: start;
      }

      @media (max-width: 1024px) {
        .custom-grid {
          grid-template-columns: 1fr;
        }
      }

      .section-box {
        padding: 2.5rem;
        border-radius: 25px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .section-box.highlight {
        border-color: var(--primary);
        box-shadow: 0 0 30px rgba(0, 236, 255, 0.1);
      }

      .step-title {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 1.5rem;
        margin-bottom: 2rem;
        text-transform: uppercase;
        font-weight: 800;
      }

      .step-title span {
        background: var(--primary);
        color: black;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 1rem;
      }

      .mini-filters {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
      }

      .mini-filters button {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        padding: 0.4rem 1rem;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        cursor: pointer;
        transition: var(--transition);
      }

      .mini-filters button.active,
      .mini-filters button:hover {
        background: var(--primary);
        color: black;
        border-color: var(--primary);
      }

      .product-selection-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1.5rem;
        max-height: 600px;
        overflow-y: auto;
        padding-right: 1rem;
      }

      .product-selection-grid::-webkit-scrollbar {
        width: 6px;
      }
      .product-selection-grid::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }
      .product-selection-grid::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 10px;
      }

      .select-card {
        cursor: pointer;
        transition: var(--transition);
        border-radius: 15px;
        overflow: hidden;
        border: 2px solid transparent;
        background: rgba(255, 255, 255, 0.03);
      }

      .select-card:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.08);
      }

      .select-card.selected {
        border-color: var(--primary);
        background: rgba(0, 236, 255, 0.05);
        box-shadow: 0 0 20px rgba(0, 236, 255, 0.2);
      }

      .card-img {
        position: relative;
        aspect-ratio: 1;
      }

      .card-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .check-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--primary);
        color: black;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      }

      .card-meta {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .card-meta .name {
        font-weight: 700;
        font-size: 0.9rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-meta .price {
        color: var(--primary);
        font-weight: 900;
        font-size: 0.8rem;
      }

      .upload-zone {
        position: relative;
        height: 250px;
        border: 2px dashed rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
        background: rgba(255, 255, 255, 0.02);
      }

      .upload-zone:hover {
        border-color: var(--primary);
        background: rgba(255, 255, 255, 0.05);
      }

      .upload-zone.has-file {
        border-style: solid;
        border-color: var(--primary);
        padding: 1rem;
      }

      .upload-zone input[type='file'] {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
        z-index: 10;
      }

      .upload-placeholder {
        text-align: center;
        color: var(--text-muted);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .upload-icon {
        font-style: normal;
        font-size: 3rem;
        color: var(--primary);
      }

      .preview-container {
        position: relative;
        height: 100%;
        width: 100%;
        z-index: 20;
      }

      .preview-container img {
        height: 100%;
        width: 100%;
        object-fit: contain;
        border-radius: 10px;
      }

      .remove-btn {
        position: absolute;
        top: -10px;
        right: -10px;
        background: #ff4757;
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 30;
      }

      .hint {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-bottom: 1.5rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        font-size: 0.8rem;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--text-muted);
        margin-bottom: 0.5rem;
      }

      textarea,
      input[type='text'] {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 12px;
        color: white;
        font-family: inherit;
        transition: var(--transition);
      }

      textarea:focus,
      input[type='text']:focus {
        outline: none;
        border-color: var(--primary);
        background: rgba(255, 255, 255, 0.08);
      }

      textarea {
        height: 120px;
        resize: vertical;
      }

      .submit-btn {
        margin-top: 1rem;
        height: 60px;
        font-size: 1.1rem;
        font-weight: 900;
      }

      .empty-msg {
        grid-column: 1 / -1;
        text-align: center;
        color: var(--text-muted);
        padding: 2rem;
      }

      .error-msg {
        color: #ff4757;
        font-size: 0.8rem;
        margin-top: 1rem;
        font-weight: 700;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomOrderComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private ui = inject(UiService);

  categories = this.productService.categories;
  currentFilter = signal('Todos');
  selectedProduct = signal<Product | null>(null);
  previewUrl = signal<string | null>(null);
  isSubmitting = signal(false);

  filteredProducts = computed(() => {
    const products = this.productService.products();
    const filter = this.currentFilter();
    if (filter === 'Todos') return products;
    return products.filter((p) => p.category === filter);
  });

  orderForm = this.fb.group({
    productId: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    contact: ['', Validators.required],
    image: [null as File | null],
  });

  filterBy(category: string) {
    this.currentFilter.set(category);
  }

  selectProduct(product: Product) {
    this.selectedProduct.set(product);
    this.orderForm.patchValue({ productId: product.id });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.orderForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.previewUrl.set(null);
    this.orderForm.patchValue({ image: null });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.isSubmitting.set(true);

      // Simulate API call
      setTimeout(() => {
        console.log('Pedido Personalizado:', {
          ...this.orderForm.value,
          product: this.selectedProduct(),
        });

        this.ui.showToast('¡Presupuesto solicitado con éxito! Te contactaremos pronto.', 'success');

        this.orderForm.reset();
        this.selectedProduct.set(null);
        this.previewUrl.set(null);
        this.isSubmitting.set(false);
      }, 1500);
    }
  }
}
