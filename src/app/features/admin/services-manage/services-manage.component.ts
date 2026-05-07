import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesDataService } from '../../../core/services/services-data.service';
import { PoolService } from '../../../core/models/pool.models';
import { toSignal } from '@angular/core/rxjs-interop';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ServiceFormComponent } from './service-form/service-form.component';

@Component({
  selector: 'app-services-manage',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ServiceFormComponent],
  templateUrl: './services-manage.component.html',
  styleUrl: './services-manage.component.scss'
})
export class ServicesManageComponent {

  private servicesService = inject(ServicesDataService)

  services = toSignal(
    this.servicesService.getServices(),
    { initialValue: [] as PoolService[] }
  )

  isLoading = signal(true)

  isFormOpen = signal(false)
  editingService = signal<PoolService | null>(null)

  constructor() {
    this.servicesService.getServices().subscribe(() => {
      this.isLoading.set(false)
    })
  }

  openCreateForm() {
    this.editingService.set(null)
    this.isFormOpen.set(true)
  }

  openEditForm(service: PoolService) {
    this.editingService.set(service)
    this.isFormOpen.set(true)
  }

  closeForm() {
    this.isFormOpen.set(false)
    this.editingService.set(null)
  }

  onSaved() {
    this.closeForm()
  }

  deleteService(service: PoolService) {
    if (!service.id) return
    if (!confirm(`Удалить услугу "${service.title}"?`)) return

    this.servicesService.deleteService(service.id).subscribe({
      error: (err) => console.error('Ошибка удаления:', err)
    })
  }
}
