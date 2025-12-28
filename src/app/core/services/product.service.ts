import { Injectable, inject, computed } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UiService } from './ui.service';
import { MOCK_PRODUCTS, MOCK_WORKS } from '../data/mock-products';

export interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number;
  description?: string;
  sizes?: string[];
  outOfStockSizes?: string[];
  isOutOfStock?: boolean;
  createdAt?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private firestore = inject(Firestore);
  private ui = inject(UiService);

  // --- SIGNALS WITH SMART FALLBACK ---

  // Products: If Firestore collection is empty, returns mocks
  products = toSignal(
    (
      collectionData(query(collection(this.firestore, 'products'), orderBy('createdAt', 'desc')), {
        idField: 'id',
      }) as Observable<Product[]>
    ).pipe(
      map((data) => (data.length > 0 ? data : MOCK_PRODUCTS)),
      catchError(() => of(MOCK_PRODUCTS))
    ),
    { initialValue: MOCK_PRODUCTS }
  );

  // Collage Works: If Firestore collection is empty, returns mocks
  works = toSignal(
    (
      collectionData(query(collection(this.firestore, 'works'), orderBy('createdAt', 'desc')), {
        idField: 'id',
      }) as Observable<any[]>
    ).pipe(
      map((data) => (data.length > 0 ? data : MOCK_WORKS)),
      catchError(() => of(MOCK_WORKS))
    ),
    { initialValue: MOCK_WORKS }
  );

  // Categories: Defaults if empty
  categories = toSignal(
    (
      collectionData(query(collection(this.firestore, 'categories'), orderBy('name', 'asc')), {
        idField: 'id',
      }) as Observable<any[]>
    ).pipe(
      map((data) =>
        data.length > 0
          ? data
          : [
              { id: '1', name: 'Remeras' },
              { id: '2', name: 'Camperas' },
              { id: '3', name: 'Pantalones' },
              { id: '4', name: 'Accesorios' },
            ]
      ),
      catchError(() =>
        of([
          { id: '1', name: 'Remeras' },
          { id: '2', name: 'Camperas' },
          { id: '3', name: 'Pantalones' },
          { id: '4', name: 'Accesorios' },
        ])
      )
    ),
    {
      initialValue: [
        { id: '1', name: 'Remeras' },
        { id: '2', name: 'Camperas' },
        { id: '3', name: 'Pantalones' },
        { id: '4', name: 'Accesorios' },
      ],
    }
  );

  socials = toSignal(
    (
      collectionData(query(collection(this.firestore, 'settings')), {
        idField: 'id',
      }) as Observable<any[]>
    ).pipe(catchError(() => of([]))),
    { initialValue: [] as any[] }
  );

  socialLinks = computed(() => {
    const list = this.socials();
    return list.find((d) => d.id === 'socials') || { instagram: '', facebook: '', whatsapp: '' };
  });

  async getProductById(id: string): Promise<Product | null> {
    // Check mocks first if it's a mock ID
    if (id.startsWith('mock-')) return MOCK_PRODUCTS.find((p) => p.id === id) || null;

    try {
      const docRef = doc(this.firestore, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Product;
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  // --- PRODUCTS ---
  async addProduct(product: Partial<Product>) {
    try {
      const res = await addDoc(collection(this.firestore, 'products'), {
        ...product,
        createdAt: new Date(),
      });
      this.ui.showToast('Producto creado con éxito');
      return res;
    } catch (e) {
      this.ui.showToast('Error al crear producto', 'error');
      throw e;
    }
  }

  async updateProduct(id: string, data: Partial<Product>) {
    try {
      await updateDoc(doc(this.firestore, 'products', id), data);
      this.ui.showToast('Producto actualizado');
    } catch (e) {
      this.ui.showToast('Error al actualizar', 'error');
      throw e;
    }
  }

  async deleteProduct(id: string) {
    try {
      await deleteDoc(doc(this.firestore, 'products', id));
      this.ui.showToast('Producto eliminado');
    } catch (e) {
      this.ui.showToast('Error al eliminar', 'error');
      throw e;
    }
  }

  // --- CATEGORIES ---
  async addCategory(name: string) {
    try {
      const res = await addDoc(collection(this.firestore, 'categories'), {
        name,
        createdAt: new Date(),
      });
      this.ui.showToast(`Categoría "${name}" agregada`);
      return res;
    } catch (e) {
      this.ui.showToast('Error al agregar categoría', 'error');
      throw e;
    }
  }

  async deleteCategory(id: string) {
    try {
      await deleteDoc(doc(this.firestore, 'categories', id));
      this.ui.showToast('Categoría eliminada');
    } catch (e) {
      this.ui.showToast('Error al borrar categoría', 'error');
      throw e;
    }
  }

  // --- COLLAGE / WORKS ---
  async addWork(data: any) {
    try {
      const res = await addDoc(collection(this.firestore, 'works'), {
        ...data,
        createdAt: new Date(),
      });
      this.ui.showToast('Imagen subida al collage');
      return res;
    } catch (e) {
      this.ui.showToast('Error al subir imagen', 'error');
      throw e;
    }
  }

  async deleteWork(id: string) {
    try {
      await deleteDoc(doc(this.firestore, 'works', id));
      this.ui.showToast('Imagen eliminada del collage');
    } catch (e) {
      this.ui.showToast('Error al eliminar imagen', 'error');
      throw e;
    }
  }

  // --- SETTINGS ---
  async updateSocials(data: { instagram: string; facebook: string; whatsapp: string }) {
    try {
      await setDoc(doc(this.firestore, 'settings', 'socials'), data, { merge: true });
      this.ui.showToast('Redes sociales actualizadas');
    } catch (e) {
      this.ui.showToast('Error al guardar redes', 'error');
      throw e;
    }
  }
}
