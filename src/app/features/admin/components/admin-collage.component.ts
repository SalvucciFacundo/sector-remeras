import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { ProductService } from '../../../core/services/product.service';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-admin-collage',
  standalone: true,
  imports: [],
  template: `
    <div class="collage-manager glass animate-fade">
      <header class="tab-header">
        <h3>Gestionar Collage del Home</h3>
        <div class="upload-zone">
          <input
            type="file"
            (change)="uploadWorks($event)"
            accept="image/*"
            id="work-upload"
            [disabled]="loading()"
            multiple
            hidden
          />
          <label for="work-upload" class="btn-primary" [class.loading]="loading()">
            {{ loading() ? 'Subiendo...' : 'Subir Trabajos' }}
          </label>
        </div>
      </header>

      <p class="subtitle">Puedes seleccionar varias imágenes a la vez para el collage.</p>

      <div class="works-grid">
        @for (w of works(); track w.id) {
        <div class="work-item glass">
          <img [src]="w.image" alt="Trabajo" />
          <button class="delete-overlay" (click)="deleteWork(w.id)">
            <span>Eliminar</span>
          </button>
        </div>
        } @empty {
        <div class="empty-state">
          <p>No hay trabajos cargados aún.</p>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .collage-manager {
        padding: 2rem;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      h3 {
        font-family: var(--graffiti-font);
        color: var(--primary);
        font-size: 1.4rem;
        text-transform: uppercase;
        margin: 0;
      }

      .btn-primary.loading {
        opacity: 0.7;
        pointer-events: none;
      }

      .subtitle {
        color: var(--text-muted);
        margin-bottom: 2rem;
        font-size: 0.9rem;
      }

      .works-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .work-item {
        position: relative;
        aspect-ratio: 1;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .work-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .delete-overlay {
        position: absolute;
        inset: 0;
        background: rgba(255, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: 0.3s;
        backdrop-filter: blur(4px);
        border: none;
        cursor: pointer;
      }

      .work-item:hover .delete-overlay {
        opacity: 1;
      }

      .delete-overlay span {
        color: #fff;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.8rem;
        background: #ff4444;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
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
export class AdminCollageComponent {
  private storage = inject(Storage);
  private productService = inject(ProductService);
  private ui = inject(UiService);

  loading = signal(false);
  works = this.productService.works;

  async deleteWork(id: string) {
    if (!confirm('¿Eliminar este trabajo del collage?')) return;
    try {
      await this.productService.deleteWork(id);
    } catch (error) {
      console.error(error);
    }
  }

  async uploadWorks(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    this.loading.set(true);
    let successCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `works/${Date.now()}_${file.name}`;
        const storageRef = ref(this.storage, path);

        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);

        await this.productService.addWork({
          image: imageUrl,
          title: 'Trabajo Realizado',
          category: 'Personalizado',
        });
        successCount++;
      }

      if (files.length > 1) {
        this.ui.showToast(`¡Se subieron ${successCount} imágenes con éxito!`);
      }
    } catch (error) {
      console.error(error);
      this.ui.showToast('Error en la subida masiva', 'error');
    } finally {
      this.loading.set(false);
      event.target.value = ''; // Reset input
    }
  }
}
