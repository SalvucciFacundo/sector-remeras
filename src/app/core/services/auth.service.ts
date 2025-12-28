import { Injectable, inject } from '@angular/core';
import { Auth, user, signOut, signInWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  user$ = user(this.auth);

  login(email: string, pass: string) {
    return from(signInWithEmailAndPassword(this.auth, email, pass));
  }

  logout() {
    return from(signOut(this.auth));
  }
}
