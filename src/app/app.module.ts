import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Import the main app component
//import { AppRoutingModule } from './app-routing.module'; // Import routing module

@NgModule({
  declarations: [
     // Declare your main app component here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
 //   AppRoutingModule, // Import routing module to handle app routing
  ],
  providers: [],
  bootstrap: [] // Bootstrap the main app component
})
export class AppModule {}
