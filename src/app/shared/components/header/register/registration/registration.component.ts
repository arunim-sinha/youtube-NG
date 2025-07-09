import { Component,EventEmitter,Input,Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/core/Services/AuthService/auth.service';
@Component({
  selector: 'app-registration',
  imports: [
    DialogModule,
    ButtonModule,
    MessageModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
Cancel() {
  this.displayRegisterDialog = false;
  this.displayRegisterDialogChange.emit(this.displayRegisterDialog);
  this.ErrorMessage = '';
  this.username = '';
  this.email = '';
  this.password = '';
  this.errormsg = false;
}
  

  @Input() displayRegisterDialog: boolean = false;
  @Output() displayRegisterDialogChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  
  errormsg: boolean = false;
  authService: AuthService;
  ErrorMessage: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
constructor(authService: AuthService) {
    this.authService = authService;
  }
   registerUser() {
    if (
      this.username !== null &&
      this.username !== undefined &&
      this.email !== null &&
      this.email !== undefined &&
      this.password !== null &&
      this.password !== undefined
    ) {
      //console.log(this.username, this.email, this.password);
      this.authService
        .register({
          userName: this.username,
          email: this.email,
          password: this.password,
        })
        .then((response: any) => {
          if (response && response.successCode === 200 && response.success) {
            //console.log(response.message);
            //console.log('User details:', response.data);
            this.displayRegisterDialog = false;
          } else {
            this.errormsg = true;
            this.ErrorMessage = 'Registration failed';
            //console.log('Registration failed');
          }
        })
        .catch((error: any) => {
          this.errormsg = true;
          this.ErrorMessage = 'Registration failed due to unknown error';
          //console.log('Registration failed due to unknown error');
        });
    } else {
      this.errormsg = true;
      this.ErrorMessage = 'Registration failed due to null or undefined inputs';
      //console.log('Registration failed due to null or undefined inputs');
    }
  }
}
