import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PoolService} from '../../core/models/pool.models';
import {ServicesDataService} from '../../core/services/services-data.service';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent  {
 private servicesService = inject(ServicesDataService)

  services = toSignal(
    this.servicesService.getServices(),
    { initialValue: [] as PoolService[] }
  )

  activeId = signal<string | null>(null)

  setActive(id: string | undefined) {
    if (!id) return
    this.activeId.set(id)
  }

  clearActive() {
    this.activeId.set(null)
  }
}
