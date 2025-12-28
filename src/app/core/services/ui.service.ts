import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);

  showToast(message: string, type: ToastType = 'success') {
    const id = this.nextId++;
    this.toasts.update((t) => [...t, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  }

  removeToast(id: number) {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }
}
