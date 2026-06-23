import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CitiesApiService } from './cities-api.service';

describe('CitiesApiService', () => {
  let service: CitiesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CitiesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cities from API', () => {
    const mockResponse = { cities: [{ id: 'marrakech', name: 'Marrakech' }] };
    service.getCities().subscribe(cities => {
      expect(cities).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/api/cities');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
