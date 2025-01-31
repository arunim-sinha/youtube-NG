import { Component } from '@angular/core';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [FooterComponent, HeaderComponent,RouterModule]
})
export class AppComponent {
  title = 'youtube-NG';
}
