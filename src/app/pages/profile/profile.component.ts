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
      this.user = this.storage.getUser();
    }
  }
}
