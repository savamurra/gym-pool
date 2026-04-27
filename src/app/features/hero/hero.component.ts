import {
  Component, signal, computed,
  OnDestroy, ElementRef, AfterViewInit,
  inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit, OnDestroy {

  clientsCount = signal(0)
  yearsCount = signal(0)
  poolsCount = signal(0)

  clientsDisplay = computed(() => `${this.clientsCount()}+`)

  private intervals: ReturnType<typeof setInterval>[] = []
  private observer: IntersectionObserver | null = null


  private el = inject(ElementRef)
  private platformId = inject(PLATFORM_ID)

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startCounters()
            this.observer?.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    const statsEl = this.el.nativeElement.querySelector('.hero__stats')
    if (statsEl) {
      this.observer.observe(statsEl)
    }
  }

  private startCounters() {
    this.animateCounter(this.clientsCount, 2000, 1000)
    this.animateCounter(this.yearsCount, 10, 800)
    this.animateCounter(this.poolsCount, 5, 600)
  }

  private animateCounter(
    counterSignal: ReturnType<typeof signal<number>>,
    target: number,
    duration: number
  ) {
    const steps = 60
    const stepValue = target / steps
    const stepTime = duration / steps
    let current = 0

    const interval = setInterval(() => {
      current += stepValue
      if (current >= target) {
        counterSignal.set(target)
        clearInterval(interval)
      } else {
        counterSignal.set(Math.floor(current))
      }
    }, stepTime)

    this.intervals.push(interval)
  }

  ngOnDestroy() {
    this.intervals.forEach(interval => clearInterval(interval))
    this.observer?.disconnect()
  }
}
