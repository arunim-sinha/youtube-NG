import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: boolean = false; // Set to false initially to simulate logged-out state

  // Function to handle login action (simulating successful login)
  login() {
    this.isLoggedIn = true;
  }

  // Function to handle logout (optional)
  logout() {
    this.isLoggedIn = false;
  }
}
