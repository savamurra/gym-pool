import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GalleryImage} from '../../core/models/pool.models';
import {GalleryCardComponent} from './gallery-card/gallery-card.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, GalleryCardComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  images = signal<GalleryImage[]>([
    { id: 1, image: 'https://i.pinimg.com/736x/7b/af/76/7baf76dcbb4d807ab6b926c5ac065474.jpg', title: 'Утренняя тренировка', category: 'Плавание' },
    { id: 2, image: 'https://i.pinimg.com/1200x/ad/52/03/ad52033ebd4aa443c030e5169fd8d2ed.jpg', title: 'Аквафитнес группа', category: 'Фитнес' },
    { id: 3, image: 'https://i.pinimg.com/webp80/736x/f5/78/28/f5782817d71f0043a3fd7df8167a9221.webp', title: 'Аквайога', category: 'Йога' },
    { id: 4, image: 'https://i.pinimg.com/1200x/1e/06/69/1e06690af00e44b4e339f91fecb939bf.jpg', title: 'Детские занятия', category: 'Дети' },
    { id: 5, image: 'https://i.pinimg.com/736x/c7/a8/85/c7a885ad9acf65a42cf62bb6fb1a18d8.jpg', title: 'Соревнования 2024', category: 'События' },
    { id: 6, image: 'https://i.pinimg.com/736x/e9/31/30/e93130e575f71927fac1228ff20ed0a3.jpg', title: 'Олимпийский бассейн', category: 'Инфраструктура' },
  ])

  selectedImage = signal<GalleryImage | null>(null)

  openModal(image: GalleryImage) {
    this.selectedImage.set(image)
  }

  closeModal() {
    this.selectedImage.set(null)
  }
}
