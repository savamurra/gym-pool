import {Component, inject, computed, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import {AnalyticsData} from '../../../core/models/pool.models';
import {SeederService} from '../../../core/services/seeder.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private seeder = inject(SeederService)

  isSeeding = signal(false)
  seedMessage = signal('')

  async seedAll() {
    this.isSeeding.set(true)
    this.seedMessage.set('Заполняю...')

    try {
      const services = await this.seeder.seedServices()
      const pricing = await this.seeder.seedPricing()
      const bookings = await this.seeder.seedBookings(30)

      this.seedMessage.set(
        `✅ Услуг: ${services}, Тарифов: ${pricing}, Заявок: ${bookings}`
      )
    } catch (err) {
      console.error(err)
      this.seedMessage.set('❌ Ошибка, см. консоль')
    } finally {
      this.isSeeding.set(false)
    }
  }

  async clearBookings() {
    if (!confirm('Удалить ВСЕ заявки? Действие необратимо!')) return

    this.isSeeding.set(true)
    const count = await this.seeder.clearBookings()
    this.seedMessage.set(`🗑 Удалено заявок: ${count}`)
    this.isSeeding.set(false)
  }

  private analyticsService = inject(AnalyticsService)

  private defaultData: AnalyticsData = {
    bookings: [],
    services: [],
    totalBookings: 0,
    todayBookings: 0,
    conversionRate: 0,
    potentialRevenue: 0,
    byDay: [],
    byService: [],
    byStatus: { new: 0, processing: 0, confirmed: 0, cancelled: 0 }
  }

  data = toSignal(
    this.analyticsService.getAnalytics(),
    { initialValue: this.defaultData }
  )

  isLoading = signal(true)

  constructor() {
    this.analyticsService.getAnalytics().subscribe(() => {
      this.isLoading.set(false)
    })
  }

  lineChartData = computed<ChartData<'line'>>(() => ({
    labels: this.data().byDay.map(d => d.date),
    datasets: [{
      label: 'Заявки',
      data: this.data().byDay.map(d => d.count),
      borderColor: '#4fc3f7',
      backgroundColor: 'rgba(79, 195, 247, 0.1)',
      fill: true,
      tension: 0.3,
      pointBackgroundColor: '#4fc3f7',
      pointBorderColor: '#4fc3f7',
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  }))

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(128, 128, 128, 0.1)' },
        ticks: { color: '#9ca3af', font: { size: 11 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(128, 128, 128, 0.1)' },
        ticks: { color: '#9ca3af', stepSize: 1, font: { size: 11 } }
      }
    }
  }

  doughnutChartData = computed<ChartData<'doughnut'>>(() => ({
    labels: ['Новые', 'В обработке', 'Подтверждены', 'Отменены'],
    datasets: [{
      data: [
        this.data().byStatus.new,
        this.data().byStatus.processing,
        this.data().byStatus.confirmed,
        this.data().byStatus.cancelled,
      ],
      backgroundColor: ['#4fc3f7', '#f59e0b', '#22c55e', '#ef4444'],
      borderWidth: 0,
    }]
  }))

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          font: { size: 12 },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  }


  barChartData = computed<ChartData<'bar'>>(() => ({
    labels: this.data().byService.map(s => s.title),
    datasets: [{
      label: 'Заявок',
      data: this.data().byService.map(s => s.count),
      backgroundColor: 'rgba(79, 195, 247, 0.8)',
      borderRadius: 6,
    }]
  }))

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: 'rgba(128, 128, 128, 0.1)' },
        ticks: { color: '#9ca3af', stepSize: 1, font: { size: 11 } }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 12 } }
      }
    }
  }
}
