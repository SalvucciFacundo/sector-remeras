import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./features/products/products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./features/products/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'pedido-personalizado',
    loadComponent: () =>
      import('./features/custom-order/custom-order.component').then((m) => m.CustomOrderComponent),
  },
  {
    path: 'carrito',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [() => import('./core/guards/auth.guard').then((m) => m.authGuard)],
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/admin/components/admin-products.component').then(
            (m) => m.AdminProductsComponent
          ),
      },
      {
        path: 'collage',
        loadComponent: () =>
          import('./features/admin/components/admin-collage.component').then(
            (m) => m.AdminCollageComponent
          ),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/admin/components/admin-categories.component').then(
            (m) => m.AdminCategoriesComponent
          ),
      },
      {
        path: 'redes',
        loadComponent: () =>
          import('./features/admin/components/admin-socials.component').then(
            (m) => m.AdminSocialsComponent
          ),
      },
      {
        path: 'estadisticas',
        loadComponent: () =>
          import('./features/admin/components/admin-stats.component').then(
            (m) => m.AdminStatsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
