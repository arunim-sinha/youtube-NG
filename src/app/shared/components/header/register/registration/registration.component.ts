import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/core/Services/AuthService/auth.service';
@Component({
  selector: 'app-registration',
  imports: [
    DialogModule,
    ButtonModule,
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  @Input() displayRegisterDialog: boolean = false;
  @Output() displayRegisterDialogChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  registerForm: FormGroup;
  loading: boolean = false;
  errormsg: boolean = false;
  ErrorMessage: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  Cancel() {
    this.displayRegisterDialog = false;
    this.displayRegisterDialogChange.emit(this.displayRegisterDialog);
    this.resetForm();
  }

  resetForm() {
    this.registerForm.reset();
    this.ErrorMessage = '';
    this.errormsg = false;
    this.loading = false;
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errormsg = false;
    const { username, email, password } = this.registerForm.value;

    this.authService
      .register({
        userName: username,
        email: email,
        password: password,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res && res['successCode'] === 200 && res['success'] !== false) {
            this.Cancel();
          } else {
            this.errormsg = true;
            this.ErrorMessage = res['message'] || 'Registration failed';
          }
        },
        error: (err) => {
          this.loading = false;
          this.errormsg = true;
          this.ErrorMessage = 'Registration failed due to unknown error';
        },
      });
  }
}
