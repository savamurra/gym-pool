import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PoolDataService, PoolService} from '../../core/services/pool.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  private poolService = inject(PoolDataService)

  services = signal<PoolService[]>([])

  activeId = signal<number | null>(null)

  ngOnInit() {
    this.services.set(this.poolService.getServices())
  }

  setActive(id: number) {
    this.activeId.set(id)
  }

  clearActive() {
    this.activeId.set(null)
  }
}
