import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { LoginComponent } from './features/login/login.component';
import { ProductService } from './core/services/product.service';
import { ToastComponent } from './core/components/toast/toast.component';
import { UiService } from './core/services/ui.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, LoginComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected ui = inject(UiService);
  protected productService = inject(ProductService);
  protected socialLinks = this.productService.socialLinks;
  protected readonly title = signal('sector-remeras');
  showLogin = signal(false);

  toggleLogin(event: Event) {
    event.preventDefault();
    this.showLogin.update((v) => !v);
  }
}
