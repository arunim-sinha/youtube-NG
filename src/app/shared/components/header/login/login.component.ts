import { Component, Input,Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@app/core/Services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [DialogModule, ButtonModule , FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService: AuthService; //injected service
  @Input() displayLoginDialog: boolean = false;
  @Output() displayLoginDialogChange: EventEmitter<boolean>  = new EventEmitter<boolean>(); 
  username: string = '';
  email: string = '';
  password: string = '';
  isLoggedIn: boolean = false; // Set to false initially to simulate logged-out state
  ErrorMessage: string = '';
  errormsg: boolean = false;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  loginUser() {
    if (
      this.username !== null &&
      this.username !== undefined &&
      this.password !== null &&
      this.password !== undefined
    ) {
      //console.log(this.username, this.password); // Log the email and password
      this.authService
        .login({ userName: this.username, password: this.password }) // Pass the email and password to the login method
        .then((response: any) => {
          if (response && response.successCode === 200 && response.success) {
            //console.log(response.message);
            //console.log('User details:', response.data);
            this.displayLoginDialog = false;
            this.isLoggedIn = true;
            const accessToken = response.data.accessToken;
            localStorage.setItem('token', accessToken);
            document.cookie = `jwt=${accessToken}; path=/`;
          } else {
            this.errormsg = true;
            this.ErrorMessage = 'Login failed';
            //console.log('Login failed');
            this.displayLoginDialog = false;
            this.isLoggedIn = false;
          }
        })
        .catch((error: any) => {
          this.errormsg = true;
          this.ErrorMessage = 'Login failed due to unknown error';
          //console.log('Login failed due to unknown error');
          this.displayLoginDialog = false;
          this.isLoggedIn = false;
        });
    } else {
      this.errormsg = true;
      this.ErrorMessage = 'Login failed due to null or undefined inputs';
      //console.log('Login failed due to null or undefined inputs');
      this.displayLoginDialog = false;
      this.isLoggedIn = false;
    }
  }
}
