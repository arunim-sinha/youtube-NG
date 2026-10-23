import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    localStorage.removeItem('playframe-theme');
    document.documentElement.classList.remove('app-dark');

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideHttpClient(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles and persists the dark theme', () => {
    component.toggleDarkMode();

    expect(document.documentElement.classList.contains('app-dark')).toBeTrue();
    expect(localStorage.getItem('playframe-theme')).toBe('dark');

    component.toggleDarkMode();

    expect(document.documentElement.classList.contains('app-dark')).toBeFalse();
    expect(localStorage.getItem('playframe-theme')).toBe('light');
  });

  it('restores the selected theme on initialization', () => {
    localStorage.setItem('playframe-theme', 'dark');
    component.ngOnInit();

    expect(component.isDarkMode).toBeTrue();
    expect(document.documentElement.classList.contains('app-dark')).toBeTrue();
  });
});
