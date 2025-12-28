import { Product } from '../services/product.service';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-1',
    title: 'Remera Graffiti Cyan',
    category: 'Remeras',
    price: 3500,
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974&auto=format&fit=crop',
    description:
      'Nuestra remera clásica con el logo de Sector en un vibrante cyan neón sobre negro profundo.',
    sizes: ['S', 'M', 'L', 'XL'],
    createdAt: new Date(),
  },
  {
    id: 'mock-2',
    title: 'Campera Urban Shield',
    category: 'Camperas',
    price: 8900,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop',
    description: 'Campera rompeviento ultra liviana, ideal para el movimiento en la ciudad.',
    sizes: ['M', 'L', 'XL'],
    outOfStockSizes: ['XL'],
    createdAt: new Date(),
  },
  {
    id: 'mock-3',
    title: 'Pantalón Cargo Black Ops',
    category: 'Pantalones',
    price: 7200,
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop',
    description: 'Pantalón cargo reforzado con múltiples bolsillos y detalles en reflectivo.',
    sizes: ['38', '40', '42', '44'],
    createdAt: new Date(),
  },
  {
    id: 'mock-4',
    title: 'Remera Oversize Tokyo',
    category: 'Remeras',
    price: 4200,
    image:
      'https://images.unsplash.com/photo-1576566582418-413469b6b442?q=80&w=1964&auto=format&fit=crop',
    description: 'Corte oversize premium con estampa inspirada en la tipografía urbana japonesa.',
    sizes: ['XS', 'S', 'M', 'L'],
    isOutOfStock: true,
    createdAt: new Date(),
  },
  {
    id: 'mock-5',
    title: 'Hoodie Sector Ghost',
    category: 'Remeras',
    price: 6500,
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop',
    description: 'Buzo con capucha de algodón pesado. Estampa minimalista "Ghost" en la espalda.',
    sizes: ['S', 'M', 'L'],
    createdAt: new Date(),
  },
  {
    id: 'mock-6',
    title: 'Gorra Urban Mesh',
    category: 'Accesorios',
    price: 2500,
    image:
      'https://images.unsplash.com/photo-1588850567047-3f2751f74492?q=80&w=2070&auto=format&fit=crop',
    description: 'Gorra trucker con ajuste regulable y logo bordado en 3D.',
    createdAt: new Date(),
  },
];

export const MOCK_WORKS = [
  {
    id: 'work-1',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    title: 'Custom Jacket',
    category: 'Custom',
  },
  {
    id: 'work-2',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop',
    title: 'T-shirt Batch',
    category: 'Serigrafía',
  },
  {
    id: 'work-3',
    image:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop',
    title: 'Logo Design',
    category: 'Branding',
  },
  {
    id: 'work-4',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop',
    title: 'Shop View',
    category: 'Local',
  },
  {
    id: 'work-5',
    image:
      'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=2070&auto=format&fit=crop',
    title: 'Screen Printing',
    category: 'Proceso',
  },
  {
    id: 'work-6',
    image:
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2070&auto=format&fit=crop',
    title: 'Packaging',
    category: 'Entrega',
  },
];
