import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="categories-manager glass animate-fade">
      <header class="tab-header">
        <h3>Categorías del Catálogo</h3>
        <form [formGroup]="categoryForm" (ngSubmit)="addCategory()" class="add-category-form">
          <input type="text" formControlName="name" placeholder="Nueva categoría..." />
          <button type="submit" class="btn-primary" [disabled]="categoryForm.invalid">
            Agregar
          </button>
        </form>
      </header>

      <p class="subtitle">Gestiona las categorías que aparecen al cargar productos.</p>

      <div class="categories-list">
        @for (cat of categories(); track cat.id) {
        <div class="category-item glass">
          <span class="category-name">{{ cat.name }}</span>
          <button class="delete-btn" (click)="deleteCategory(cat.id)">🗑️</button>
        </div>
        } @empty {
        <div class="empty-state">
          <p>No hay categorías personalizadas creadas.</p>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .categories-manager {
        padding: 2rem;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        gap: 2rem;
      }

      h3 {
        font-family: var(--graffiti-font);
        color: var(--primary);
        font-size: 1.4rem;
        text-transform: uppercase;
        margin: 0;
        white-space: nowrap;
      }

      .add-category-form {
        display: flex;
        gap: 1rem;
        flex: 1;
        max-width: 400px;
      }

      input {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.6rem 1rem;
        border-radius: 8px;
        color: white;
        flex: 1;
      }

      .subtitle {
        color: var(--text-muted);
        margin-bottom: 2rem;
        font-size: 0.9rem;
      }

      .categories-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
      }

      .category-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: 0.3s;
      }

      .category-item:hover {
        background: rgba(255, 255, 255, 0.07);
        border-color: rgba(0, 236, 255, 0.2);
      }

      .category-name {
        font-weight: 600;
        letter-spacing: 1px;
      }

      .delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
        opacity: 0.4;
        transition: 0.3s;
      }

      .delete-btn:hover {
        opacity: 1;
        transform: scale(1.2);
      }

      .empty-state {
        text-align: center;
        padding: 4rem;
        color: var(--text-muted);
        grid-column: 1 / -1;
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
export class AdminCategoriesComponent {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private ui = inject(UiService);

  categories = this.productService.categories;

  categoryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  async addCategory() {
    if (this.categoryForm.invalid) return;
    const name = this.categoryForm.value.name!;
    try {
      await this.productService.addCategory(name);
      this.categoryForm.reset();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteCategory(id: string) {
    const confirmed = await this.ui.confirm(
      '¿Borrar Categoría?',
      'Se eliminará esta categoría del sistema. Ten en cuenta que los productos que ya la usen podrían quedar mal clasificados.'
    );
    if (!confirmed) return;
    try {
      await this.productService.deleteCategory(id);
    } catch (error) {
      console.error(error);
    }
  }
}
