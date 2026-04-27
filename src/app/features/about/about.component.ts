import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Advantage} from '../../core/models/pool.models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  advantages = signal<Advantage[]>([
    {
      id: 1,
      icon: '🏊',
      title: 'Олимпийский бассейн',
      description: '50-метровый бассейн с профессиональным оборудованием и чистейшей водой'
    },
    {
      id: 2,
      icon: '👨‍🏫',
      title: 'Опытные тренеры',
      description: 'Команда сертифицированных тренеров с опытом подготовки чемпионов'
    },
    {
      id: 3,
      icon: '🕐',
      title: 'Удобное расписание',
      description: 'Работаем с 7 утра до 10 вечера — тренируйся в удобное время'
    },
    {
      id: 4,
      icon: '🚿',
      title: 'Современная инфраструктура',
      description: 'Просторные раздевалки, сауна, джакузи и зона отдыха'
    }
  ])
}
