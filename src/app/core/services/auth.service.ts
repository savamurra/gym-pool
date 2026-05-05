import {computed, inject, Injectable, signal} from '@angular/core';
import {Auth, signInWithEmailAndPassword, signOut, user} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import { FirebaseError } from 'firebase/app'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public auth = inject(Auth)
  private router = inject(Router)

  currentUser = toSignal(user(this.auth))

  isAuthenticated = computed(() => !!this.currentUser())

  isLoading = signal(false)
  error = signal<string | null>(null)

  async login(email: string, password: string) {
    this.isLoading.set(true)
    this.error.set(null)

    try {
      await signInWithEmailAndPassword(this.auth, email, password)
      await this.router.navigate(['/admin/dashboard'])
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err) {
        const code = (err as { code: string }).code
        this.error.set(this.getErrorMessage(code))
      } else {
        this.error.set('Произошла неизвестная ошибка')
      }
    } finally {
      this.isLoading.set(false)
    }
  }

  async logout() {
    await signOut(this.auth)
    await this.router.navigate(['/admin/login'])
  }

  private getErrorMessage(code: string): string {
    const errors: Record<string, string> = {
      'auth/invalid-credential': 'Неверный email или пароль',
      'auth/user-not-found': 'Пользователь не найден',
      'auth/wrong-password': 'Неверный пароль',
      'auth/too-many-requests': 'Слишком много попыток, попробуйте позже',
    }
    return errors[code] || 'Произошла ошибка, попробуйте снова'
  }
}
