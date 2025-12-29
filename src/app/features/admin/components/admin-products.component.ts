import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService, Product } from '../../../core/services/product.service';
import { CurrencyPipe } from '@angular/common';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `
    <div class="admin-grid animate-fade">
      <!-- Formulario -->
      <div class="glass-card glass">
        <h3>{{ isEditing() ? 'Editar Producto' : 'Cargar Nuevo Producto' }}</h3>
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nombre del Producto</label>
            <input type="text" formControlName="title" placeholder="Ej: Remera Graffiti Cyan" />
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label>Categoría</label>
              <select formControlName="category">
                @for (cat of categories(); track cat.id) {
                <option [value]="cat.name">{{ cat.name }}</option>
                } @empty {
                <option value="Remeras">Remeras (Default)</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Precio</label>
              <input type="number" formControlName="price" />
            </div>
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea
              formControlName="description"
              rows="2"
              placeholder="Detalles de la prenda..."
            ></textarea>
          </div>

          <div class="form-group">
            <label>Tallas Disponibles (Separadas por coma)</label>
            <input type="text" formControlName="sizesRaw" placeholder="S, M, L, XL" />
            <small class="hint">Ej: S, M, L, XL</small>
          </div>

          <div class="stock-control glass">
            <label class="toggle-label">
              <input type="checkbox" formControlName="isOutOfStock" />
              <span class="toggle-text">¿Fuera de Stock Global?</span>
            </label>

            @if (!productForm.value.isOutOfStock) {
            <div class="sizes-stock">
              <label>Tallas SIN stock (Separadas por coma)</label>
              <input type="text" formControlName="outOfStockSizesRaw" placeholder="L, XL" />
            </div>
            }
          </div>

          <div class="form-group">
            <label>Imagen</label>
            @if (isEditing() && existingImageUrl()) {
            <div class="current-img">
              <img [src]="existingImageUrl()" alt="Actual" />
              <span>Cambiar imagen (opcional):</span>
            </div>
            }
            <input type="file" (change)="onFileSelected($event)" accept="image/*" />
          </div>

          <div class="actions">
            <button type="submit" class="btn-primary full-width" [disabled]="loading()">
              {{
                loading() ? 'Procesando...' : isEditing() ? 'Guardar Cambios' : 'Cargar Producto'
              }}
            </button>
            @if (isEditing()) {
            <button type="button" class="btn-secondary full-width" (click)="cancelEdit()">
              Cancelar Edición
            </button>
            }
          </div>
        </form>
      </div>

      <!-- Listado -->
      <div class="products-list glass">
        <h3>Gestionar Catálogo</h3>
        <div class="list-container">
          @for (p of products(); track p.id) {
          <div
            class="item glass"
            [class.editing]="editingId() === p.id"
            [class.out-of-stock]="p.isOutOfStock"
          >
            <div class="img-wrapper">
              <img [src]="p.image" [alt]="p.title" />
              @if (p.isOutOfStock) {
              <span class="sold-out-badge">SOLD OUT</span>
              }
            </div>
            <div class="item-meta">
              <h4>{{ p.title }}</h4>
              <p class="price">{{ p.price | currency }}</p>
              <span class="cat-tag">{{ p.category }}</span>
              <div class="sizes-row">
                @for (s of p.sizes; track s) {
                <span class="size-badge" [class.no-stock]="p.outOfStockSizes?.includes(s)">
                  {{ s }}
                </span>
                }
              </div>
            </div>
            <div class="item-actions">
              <button class="edit-btn" (click)="startEdit(p)">✏️</button>
              <button class="delete-btn" (click)="deleteProduct(p.id!)">🗑️</button>
            </div>
          </div>
          } @empty {
          <p class="empty">No hay productos cargados todavía.</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-grid {
        display: grid;
        grid-template-columns: 480px 1fr;
        gap: 2rem;
      }

      .glass-card,
      .products-list {
        padding: 2rem;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      h3 {
        font-family: var(--graffiti-font);
        color: var(--primary);
        margin-bottom: 1.5rem;
        font-size: 1.4rem;
        text-transform: uppercase;
      }

      .form-group {
        margin-bottom: 1.2rem;
      }

      .current-img {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .current-img img {
        max-height: 200px;
        width: auto;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        object-fit: contain;
      }

      label {
        display: block;
        margin-bottom: 0.4rem;
        color: var(--text-muted);
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 1px;
      }

      input,
      select,
      textarea {
        width: 100%;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.8rem;
        border-radius: 8px;
        color: white;
        font-family: var(--body-font);
      }

      .stock-control {
        background: rgba(0, 0, 0, 0.4);
        padding: 1rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .toggle-label {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        user-select: none;
      }

      .toggle-label input {
        width: 20px;
        height: 20px;
        accent-color: var(--primary);
      }

      .toggle-text {
        color: #fff;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
      }

      .sizes-stock {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }

      .hint {
        font-size: 0.65rem;
        color: #666;
        margin-top: 0.3rem;
        display: block;
      }

      .list-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 80vh;
        overflow-y: auto;
      }

      .item {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        padding: 1rem;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        transition: 0.3s;
        border: 1px solid transparent;
      }

      .item.out-of-stock {
        opacity: 0.7;
        background: rgba(255, 71, 87, 0.05);
      }

      .img-wrapper {
        position: relative;
        width: 70px;
        height: 70px;
        flex-shrink: 0;
      }

      .img-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
      }

      .sold-out-badge {
        position: absolute;
        inset: 0;
        background: rgba(255, 71, 87, 0.8);
        color: white;
        font-size: 0.6rem;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        transform: rotate(-15deg) scale(0.9);
      }

      .item-meta {
        flex: 1;
      }

      .price {
        color: var(--primary);
        font-weight: 800;
        font-size: 0.9rem;
      }

      .sizes-row {
        display: flex;
        gap: 0.4rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
      }

      .size-badge {
        font-size: 0.65rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        color: #aaa;
      }

      .size-badge.no-stock {
        text-decoration: line-through;
        background: rgba(255, 71, 87, 0.2);
        color: #ff4757;
      }

      .item-actions {
        display: flex;
        gap: 0.8rem;
      }

      .edit-btn,
      .delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0.4;
        transition: 0.3s;
      }

      .edit-btn:hover,
      .delete-btn:hover {
        opacity: 1;
        transform: scale(1.2);
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
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

      .animate-fade {
        animation: fadeIn 0.4s ease;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsComponent {
  private storage = inject(Storage);
  private fb = inject(FormBuilder);
  protected productService = inject(ProductService);
  private ui = inject(UiService);

  loading = signal(false);
  isEditing = signal(false);
  editingId = signal<string | null>(null);
  existingImageUrl = signal<string | null>(null);

  products = this.productService.products;
  categories = this.productService.categories;
  selectedFile: File | null = null;

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['Remeras', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    sizesRaw: [''],
    isOutOfStock: [false],
    outOfStockSizesRaw: [''],
  });

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  startEdit(p: Product) {
    this.isEditing.set(true);
    this.editingId.set(p.id);
    this.existingImageUrl.set(p.image);

    this.productForm.patchValue({
      title: p.title,
      description: p.description || '',
      category: p.category,
      price: p.price,
      sizesRaw: p.sizes?.join(', ') || '',
      isOutOfStock: p.isOutOfStock || false,
      outOfStockSizesRaw: p.outOfStockSizes?.join(', ') || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.existingImageUrl.set(null);
    this.productForm.reset({
      category: 'Remeras',
      price: 0,
      isOutOfStock: false,
    });
    this.selectedFile = null;
  }

  async deleteProduct(id: string) {
    if (!confirm('¿Seguro que quieres borrar este producto?')) return;
    try {
      await this.productService.deleteProduct(id);
      if (this.editingId() === id) this.cancelEdit();
    } catch (error) {
      console.error(error);
    }
  }

  async onSubmit() {
    if (this.productForm.invalid) return;
    if (!this.isEditing() && !this.selectedFile) {
      this.ui.showToast('Por favor selecciona una imagen', 'error');
      return;
    }

    this.loading.set(true);
    try {
      let imageUrl = this.existingImageUrl();

      if (this.selectedFile) {
        const path = `products/${Date.now()}_${this.selectedFile.name}`;
        const storageRef = ref(this.storage, path);
        await uploadBytes(storageRef, this.selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const sizes = this.parseCommaString(this.productForm.value.sizesRaw!);
      const outOfStockSizes = this.parseCommaString(this.productForm.value.outOfStockSizesRaw!);

      const productData = {
        title: this.productForm.value.title!,
        description: this.productForm.value.description!,
        category: this.productForm.value.category!,
        price: this.productForm.value.price!,
        image: imageUrl!,
        sizes,
        isOutOfStock: this.productForm.value.isOutOfStock || false,
        outOfStockSizes,
      };

      if (this.isEditing() && this.editingId()) {
        await this.productService.updateProduct(this.editingId()!, productData);
      } else {
        await this.productService.addProduct(productData);
      }

      this.cancelEdit();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  private parseCommaString(str: string): string[] {
    if (!str) return [];
    return str
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s !== '');
  }
}
