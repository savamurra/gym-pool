import {Component, input, output} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {GalleryImage} from '../../../core/models/pool.models';

@Component({
  selector: 'app-gallery-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './gallery-card.component.html',
  styleUrl: './gallery-card.component.scss'
})
export class GalleryCardComponent {
  image = input.required<GalleryImage>()

  imageClick = output<GalleryImage>()

  onCardClick() {
    this.imageClick.emit(this.image())
  }
}
