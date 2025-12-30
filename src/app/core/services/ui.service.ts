import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface ConfirmData {
  title: string;
  message: string;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);
  confirmData = signal<ConfirmData | null>(null);

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmData.set({ title, message, resolve });
    });
  }

  resolveConfirm(value: boolean) {
    const data = this.confirmData();
    if (data) {
      data.resolve(value);
      this.confirmData.set(null);
    }
  }

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
