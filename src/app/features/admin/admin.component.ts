import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <section class="admin-page">
      <div class="container">
        <header class="admin-header">
          <h2 class="graffiti-text">Admin Panel</h2>
          <nav class="admin-tabs">
            <a routerLink="/admin/productos" routerLinkActive="active">Productos</a>
            <a routerLink="/admin/collage" routerLinkActive="active">Home Collage</a>
            <a routerLink="/admin/categorias" routerLinkActive="active">Categorías</a>
            <a routerLink="/admin/redes" routerLinkActive="active">Redes</a>
            <a routerLink="/admin/estadisticas" routerLinkActive="active">Estadísticas</a>
          </nav>
        </header>

        <div class="admin-content">
          <router-outlet />
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .admin-page {
        padding: 200px 2rem 4rem;
        min-height: 100vh;
        position: relative;
        z-index: 5;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
        border-bottom: 1px solid rgba(0, 236, 255, 0.2);
        padding-bottom: 1rem;
      }

      .admin-header h2 {
        font-size: 2rem;
        margin: 0;
        color: var(--primary);
      }

      .admin-tabs {
        display: flex;
        gap: 1rem;
      }

      .admin-tabs a {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        padding: 0.8rem 1.5rem;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 700;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .admin-tabs a:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.3);
      }

      .admin-tabs a.active {
        background: rgba(0, 236, 255, 0.15);
        border-color: var(--primary);
        color: var(--primary);
        box-shadow: 0 0 20px rgba(0, 236, 255, 0.3);
      }

      .admin-content {
        position: relative;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {}
