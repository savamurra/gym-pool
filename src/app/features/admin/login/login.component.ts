import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Router} from '@angular/router';
import {SpinnerComponent} from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authService = inject(AuthService)
  private router = inject(Router)

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  get f() { return this.form.controls }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    await this.authService.login(
      this.f.email.value!,
      this.f.password.value!,
    )
  }
}
