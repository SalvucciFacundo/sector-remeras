import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1 class="graffiti-text animate-pop">Personaliza tu Estilo</h1>
        <p>Estampados exclusivos en remeras, camperas y pantalones. Tu diseño, tu regla.</p>
        <button class="btn-hero" routerLink="/productos">Ver Catálogo</button>
      </div>
    </section>

    <section class="gallery">
      <h2 class="section-title">Nuestros Trabajos</h2>
      <div class="collage-area">
        <div class="collage-grid">
          @for (item of works(); track item.id; let i = $index) {
          <div
            class="poster-card"
            [style.--rotation]="(i % 2 === 0 ? 10 + i * 2 : -10 - i * 2) + 'deg'"
            [style.--tx]="(i % 3 === 0 ? -70 : i % 2 === 0 ? 70 : 0) + 'px'"
            [style.--ty]="(i % 4 === 0 ? -50 : i % 3 === 0 ? 50 : 0) + 'px'"
            [style.--height]="300 + (i % 3) * 120 + 'px'"
            [style.--scale]="0.9 + (i % 2) * 0.15"
            [style.z-index]="i % 10"
            (click)="openImage(item.image)"
          >
            <div class="poster-wrapper">
              <div class="torn-paper">
                <div class="image-inner">
                  <img [src]="item.image" [alt]="item.title" loading="lazy" />
                </div>
                <!-- Paper texture overlay -->
                <div class="paper-texture"></div>

                <div class="poster-overlay">
                  <span class="graffiti-text">VIEW</span>
                </div>
              </div>
            </div>
          </div>
          } @empty {
          <div class="empty-state">
            <p class="no-products">Cargando los mejores diseños...</p>
          </div>
          }
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    @if (selectedImage()) {
    <div class="lightbox" (click)="closeImage()">
      <img [src]="selectedImage()" alt="Trabajo Realizado" />
      <button class="close-btn">&times;</button>
    </div>
    }
  `,
  styles: [
    `
      .hero {
        min-height: 90vh;
        padding-top: 15rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.7) 100%);
      }

      .hero-content {
        z-index: 100;
        max-width: 800px;
        padding: 2rem;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 30px;
      }

      h1 {
        font-size: clamp(3rem, 8vw, 6rem);
        margin-bottom: 1rem;
        line-height: 1;
      }

      .section-title {
        font-family: var(--graffiti-font);
        font-size: 3.5rem;
        text-align: center;
        color: var(--primary);
        text-transform: uppercase;
        margin: 6rem 0 0;
        text-shadow: 0 0 15px rgba(0, 236, 255, 0.6);
      }

      .collage-area {
        position: relative;
        padding: 4rem 2rem 12rem;
        display: flex;
        justify-content: center;
        overflow: hidden;
      }

      .collage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 0;
        width: 100%;
        max-width: 1400px;
        justify-items: center;
        align-items: center;
      }

      .poster-card {
        position: relative;
        cursor: pointer;
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform: translate(var(--tx), var(--ty)) rotate(var(--rotation)) scale(var(--scale));
        height: var(--height);
        width: 100%;
        max-width: 340px;
      }

      .poster-card:hover {
        transform: translate(0, 0) rotate(0) scale(1.15);
        z-index: 100 !important;
      }

      .poster-wrapper {
        height: 100%;
        width: 100%;
        /* filter: drop-shadow is better for clip-path shapes */
        filter: drop-shadow(15px 15px 25px rgba(0, 0, 0, 0.8));
      }

      .torn-paper {
        height: 100%;
        width: 100%;
        background: #f0f0f0;
        padding: 12px;
        position: relative;
        /* More aggressive and randomized torn look */
        clip-path: polygon(
          2% 4%,
          8% 1%,
          15% 3%,
          25% 0%,
          35% 2%,
          45% 0%,
          55% 3%,
          65% 1%,
          75% 2%,
          85% 0%,
          94% 2%,
          100% 5%,
          98% 15%,
          100% 25%,
          97% 35%,
          99% 45%,
          97% 55%,
          100% 65%,
          98% 75%,
          100% 85%,
          97% 94%,
          95% 100%,
          85% 98%,
          75% 100%,
          65% 97%,
          55% 99%,
          45% 97%,
          35% 100%,
          25% 98%,
          15% 100%,
          5% 97%,
          0% 94%,
          2% 85%,
          0% 75%,
          3% 65%,
          0% 55%,
          2% 45%,
          0% 35%,
          3% 25%,
          0% 15%
        );
      }

      .image-inner {
        height: 100%;
        width: 100%;
        overflow: hidden;
        clip-path: polygon(1% 2%, 99% 1%, 98% 99%, 2% 98%);
      }

      .paper-texture {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0.2;
        background-image: url('https://www.transparenttextures.com/patterns/cardboard-flat.png');
        mix-blend-mode: multiply;
      }

      .poster-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: contrast(1.1) brightness(0.8) sepia(0.2);
        transition: 0.3s;
      }

      .poster-card:hover img {
        filter: contrast(1) brightness(1) sepia(0);
      }

      .poster-overlay {
        position: absolute;
        bottom: 25px;
        right: 25px;
        background: var(--primary);
        padding: 6px 18px;
        transform: rotate(-4deg);
        box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
        border: 2px solid black;
      }

      .poster-overlay span {
        color: black;
        font-weight: 900;
        font-size: 1.4rem;
        letter-spacing: 1px;
      }

      .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(15px);
      }

      .lightbox img {
        max-height: 85vh;
        max-width: 90vw;
        border: 15px solid #fff;
        box-shadow: 0 0 60px rgba(0, 236, 255, 0.4);
      }

      .close-btn {
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: none;
        border: none;
        color: white;
        font-size: 4rem;
        cursor: pointer;
      }

      .btn-hero {
        background: var(--primary);
        color: black;
        border: none;
        padding: 1.2rem 3rem;
        font-size: 1.2rem;
        font-weight: 800;
        text-transform: uppercase;
        border-radius: 50px;
        cursor: pointer;
        transition: 0.3s;
        box-shadow: 0 0 20px rgba(0, 236, 255, 0.4);
      }

      .btn-hero:hover {
        transform: scale(1.1);
        box-shadow: 0 0 40px rgba(0, 236, 255, 0.6);
      }

      .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem;
        color: var(--text-muted);
      }

      .animate-pop {
        animation: pop 0.5s ease-out;
      }

      @keyframes pop {
        0% {
          transform: scale(0.8);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private productService = inject(ProductService);

  works = this.productService.works;
  selectedImage = signal<string | null>(null);

  openImage(url: string) {
    this.selectedImage.set(url);
  }

  closeImage() {
    this.selectedImage.set(null);
  }
}
