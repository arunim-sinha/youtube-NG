import { Component } from '@angular/core';
import { LocalStorageUtility } from '@app/core/Utils/LocalStorage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = {};
  constructor( private storage: LocalStorageUtility) {
    const token = this.storage.getToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      this.user = decodedToken;
    }
  }
}
