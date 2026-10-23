import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from 'environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('registers users through the backend users route', () => {
    const request = {
      userName: 'creator',
      email: 'creator@example.com',
      password: 'safe-password',
    };

    service.register(request).subscribe();

    const httpRequest = httpTesting.expectOne(`${environment.apiUrl}/users/register`);
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush({ successCode: 201, success: true });
  });

  it('logs users in through the backend users route', () => {
    const request = { userName: 'creator', password: 'safe-password' };

    service.login(request).subscribe();

    const httpRequest = httpTesting.expectOne(`${environment.apiUrl}/users/login`);
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush({ successCode: 200, success: true });
  });
});
