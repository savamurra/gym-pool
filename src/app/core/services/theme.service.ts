import {computed, effect, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {Theme} from '../models/pool.models';
import {isPlatformBrowser} from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private platformId = inject(PLATFORM_ID)

  private savedTheme = this.getSavedTheme()
  theme = signal<Theme>(this.savedTheme)

  isDark = computed(() => this.theme() === 'dark')

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const currentTheme = this.theme()

        document.body.classList.remove('theme-dark', 'theme-light')
        document.body.classList.add(`theme-${currentTheme}`)
        localStorage.setItem('theme', currentTheme)
      }
    });
  }

  toggleTheme() {
    this.theme.set(this.isDark() ? 'light' : 'dark')
  }

  private getSavedTheme(): Theme {
    if (isPlatformBrowser(this.platformId)) {
      return (localStorage.getItem('theme') as Theme) || 'dark'
    }
    return 'dark'
  }
}
