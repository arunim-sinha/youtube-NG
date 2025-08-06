import { Component } from '@angular/core';
import { LocalStorageUtil } from '@app/core/Utils/LocalStorage.util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = {};
  constructor( private storage: LocalStorageUtil) {
    const token = this.storage.getToken();
    if (token) {
      this.user = this.storage.getUser();
    }
  }
}
