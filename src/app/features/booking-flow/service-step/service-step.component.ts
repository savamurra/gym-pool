import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesDataService } from '../../../core/services/services-data.service';
import { PoolService } from '../../../core/models/pool.models';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { signal } from '@angular/core';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-service-step',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './service-step.component.html',
  styleUrl: './service-step.component.scss'
})
export class ServiceStepComponent {

  private servicesService = inject(ServicesDataService)

  isLoading = signal(true)

  services = toSignal(
    this.servicesService.getServices().pipe(
      tap(() => this.isLoading.set(false))
    ),
    { initialValue: [] as PoolService[] }
  )

  serviceSelected = output<PoolService>()

  onSelect(service: PoolService) {
    this.serviceSelected.emit(service)
  }
}
