import { Component, ChangeDetectionStrategy, signal, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="urban-header">
      <div class="nav-art-container">
        <!-- The user's graffiti image -->
        <img src="/assets/graffiti.png" alt="" class="nav-graffiti-img" />

        <div class="header-content">
          <div class="logo">
            <a routerLink="/" class="graffiti-text">Sector Remeras</a>
          </div>

          <nav [class.open]="isMenuOpen()">
            <ul class="nav-links">
              <li>
                <a
                  routerLink="/"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  (click)="closeMenu()"
                  >Home</a
                >
              </li>
              <li>
                <a routerLink="/productos" routerLinkActive="active" (click)="closeMenu()"
                  >Catálogo</a
                >
              </li>
              <li>
                <a
                  routerLink="/pedido-personalizado"
                  routerLinkActive="active"
                  (click)="closeMenu()"
                  >Pedido Custom</a
                >
              </li>
              @if (isLoggedIn()) {
              <li class="admin-dropdown-container">
                <button class="admin-tab-btn" (click)="toggleAdminMenu($event)">
                  <div class="admin-pill glass">
                    <span class="admin-icon">⚙️</span>
                    <span>Admin</span>
                  </div>
                </button>

                @if (isAdminMenuOpen()) {
                <div class="admin-dropdown glass animate-fade">
                  <a routerLink="/admin" (click)="closeAdminMenu()">Panel Control</a>
                  <button class="logout-btn" (click)="logout()">Cerrar Sesión</button>
                </div>
                }
              </li>
              }
              <li>
                <a
                  routerLink="/carrito"
                  class="cart-container"
                  (click)="closeMenu()"
                  routerLinkActive="active"
                >
                  <div class="cart-pill glass">
                    <span class="cart-icon">🛒</span>
                    <span class="cart-count">{{ cart.totalCount() }}</span>
                  </div>
                </a>
              </li>
            </ul>
          </nav>

          <button class="menu-toggle" (click)="toggleMenu()">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .urban-header {
        position: absolute; /* Changed to absolute so it scrolls away */
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        background: transparent;
        pointer-events: none; /* Allow clicking through transparent parts */
      }

      .nav-art-container {
        position: relative;
        width: 100%;
        height: 180px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .nav-graffiti-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: fill; /* Forzamos que ocupe todo el ancho */
        z-index: -1;
        pointer-events: none;
      }

      .header-content {
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
        padding: 0 4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 120px;
        pointer-events: auto; /* Re-enable clicks for logo and nav */
      }

      .logo a {
        font-size: 3.2rem;
        text-decoration: none;
        color: #e0faff; /* Lighter core */
        font-family: var(--graffiti-font);
        animation: neon-flicker 5s infinite;
        letter-spacing: 3px;
        text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px var(--primary), 0 0 40px var(--primary),
          0 0 60px var(--primary), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
          2px 2px 0 #000;
        transition: var(--transition);
      }

      .nav-links {
        display: flex;
        list-style: none;
        gap: 3.5rem;
        align-items: center;
      }

      .nav-links a {
        text-decoration: none;
        color: #fff;
        font-weight: 900;
        text-transform: uppercase;
        font-size: 1.1rem;
        font-family: var(--graffiti-font);
        transition: var(--transition);
        letter-spacing: 1px;
        /* Much stronger dark outline to pop out */
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000,
          2px 2px 4px rgba(0, 0, 0, 1);
      }

      .nav-links a:hover,
      .nav-links a.active {
        color: var(--primary);
        text-shadow: 0 0 5px #000, 0 0 10px var(--primary), 0 0 20px var(--primary);
        transform: scale(1.1) rotate(-1deg);
      }

      .cart-pill {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        background: rgba(0, 0, 0, 0.8);
        padding: 0.6rem 1.2rem;
        border-radius: 12px;
        border: 2px solid rgba(0, 236, 255, 0.5);
        transition: var(--transition);
      }

      .cart-count {
        background: var(--primary);
        color: #000;
        font-size: 0.85rem;
        font-weight: 800;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-family: var(--body-font);
      }

      .admin-pill {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        background: rgba(0, 0, 0, 0.8);
        padding: 0.6rem 1.2rem;
        border-radius: 12px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        transition: var(--transition);
        color: #fff;
        font-size: 0.8rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .admin-pill:hover {
        border-color: var(--primary);
        background: rgba(0, 236, 255, 0.1);
        transform: translateY(-2px);
      }

      .admin-dropdown-container {
        position: relative;
      }

      .admin-tab-btn {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
      }

      .admin-dropdown {
        position: absolute;
        top: calc(100% + 15px);
        right: 0;
        min-width: 180px;
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid rgba(0, 236, 255, 0.3);
        border-radius: 12px;
        padding: 0.8rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1001;
      }

      .admin-dropdown a,
      .admin-dropdown .logout-btn {
        padding: 0.8rem 1.2rem;
        border-radius: 8px;
        font-size: 0.9rem;
        font-family: var(--body-font);
        text-transform: uppercase;
        font-weight: 700;
        text-align: left;
        width: 100%;
        transition: 0.3s;
        text-decoration: none;
        color: #fff;
        background: none;
        border: none;
        cursor: pointer;
        white-space: nowrap;
      }

      .admin-dropdown a:hover {
        background: rgba(0, 236, 255, 0.1);
        color: var(--primary);
      }

      .admin-dropdown .logout-btn {
        color: #ff4757;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        margin-top: 0.5rem;
        padding-top: 1rem;
      }

      .admin-dropdown .logout-btn:hover {
        background: rgba(255, 71, 87, 0.1);
      }

      .animate-fade {
        animation: fadeIn 0.3s ease;
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

      .menu-toggle {
        display: none;
        flex-direction: column;
        gap: 6px;
        background: none;
      }

      .bar {
        width: 35px;
        height: 4px;
        background: var(--primary);
        transition: var(--transition);
      }

      @media (max-width: 1000px) {
        .header-content {
          padding: 0 2rem;
        }
        .logo a {
          font-size: 2rem;
        }
        .menu-toggle {
          display: flex;
        }
        nav {
          position: fixed; /* Keep menu fixed on mobile for UX */
          top: 0;
          right: -100%;
          width: 80%;
          max-width: 300px;
          height: 100vh;
          background: rgba(0, 0, 0, 0.98);
          border-left: 2px solid var(--primary);
          padding-top: 7rem;
          transition: 0.4s ease-out;
        }
        nav.open {
          right: 0;
        }
        .nav-links {
          flex-direction: column;
          gap: 2rem;
        }
        .nav-links a {
          font-size: 1.8rem;
        }
      }

      @keyframes neon-flicker {
        0%,
        18%,
        22%,
        25%,
        53%,
        57%,
        100% {
          text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px var(--primary), 0 0 40px var(--primary),
            0 0 60px var(--primary), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000,
            2px 2px 0 #000;
          opacity: 1;
        }
        20%,
        24%,
        55% {
          text-shadow: none;
          opacity: 0.5;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected cart = inject(CartService);
  private auth = inject(AuthService);
  isLoggedIn = toSignal(this.auth.user$);
  isMenuOpen = signal(false);
  isAdminMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleAdminMenu(event: Event) {
    event.stopPropagation();
    this.isAdminMenuOpen.update((v) => !v);
  }

  closeAdminMenu() {
    this.isAdminMenuOpen.set(false);
  }

  logout() {
    this.closeAdminMenu();
    this.auth.logout().subscribe();
  }

  @HostListener('document:click')
  clickout() {
    this.closeAdminMenu();
  }
}
