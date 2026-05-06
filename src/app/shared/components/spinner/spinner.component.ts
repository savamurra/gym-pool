import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'sm' | 'md' | 'lg'

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  size = input<SpinnerSize>('md')
  fullscreen = input<boolean>(false)
}
