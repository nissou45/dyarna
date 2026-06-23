import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent, HttpClientTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 6 featured cities', () => {
    expect(component.featuredCities.length).toBe(6);
  });

  it('should have 12 regions', () => {
    expect(component.regions.length).toBe(12);
  });

  it('should filter by region', () => {
    component.selectedRegion = 'Marrakech-Safi';
    const filtered = (component as any).getFilteredCities();
    expect(filtered.every((c: any) => c.region === 'Marrakech-Safi')).toBe(true);
  });

  it('should reset filters', () => {
    component.selectedRegion = 'Fès-Meknès';
    component.selectedCategory = 'montagne';
    component.resetFilters();
    expect(component.selectedRegion).toBe('');
    expect(component.selectedCategory).toBe('');
  });

  it('should escape HTML in popup', () => {
    const city = { id: 'test', name: '<script>alert("xss")</script>', region: 'Test', category: 'imperiale' as const, lat: 0, lng: 0, featured: false };
    const html = (component as any).escapeHtml(city.name);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
