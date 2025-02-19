import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { RouterModule } from '@angular/router';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [FooterComponent, HeaderComponent,RouterModule]
})
export class AppComponent implements OnInit {
  constructor(private _primeng: PrimeNG) { 

  }
  ngOnInit(): void {
    this._primeng.ripple.set(true);
  }
  title = 'youtube-NG';
}
