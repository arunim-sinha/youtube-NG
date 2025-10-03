import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { LocalStorageUtil } from '@app/core/Utils/LocalStorage.util';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule , InputTextModule, PasswordModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = {
    name: '',
    email: '',
    profilePicture: '',
    password: ''
  };
editEmail: any;
editPassword: any;
userForm: any;
  constructor( private storage: LocalStorageUtil) {
    const token = this.storage.getToken();
    console.log('Token loaded from storage:', token);
    if (token) {
      this.user.name = this.storage.getUser();
      console.log('User data loaded from storage:', this.user);
    }
  }
}
