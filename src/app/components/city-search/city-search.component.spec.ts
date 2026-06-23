import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitySearchComponent } from './city-search.component';
import { CITIES } from '../../data/cities';

describe('CitySearchComponent', () => {
  let component: CitySearchComponent;
  let fixture: ComponentFixture<CitySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitySearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit city on select', () => {
    let selected: any = null;
    component.citySelected.subscribe(c => selected = c);
    const city = CITIES.find(c => c.id === 'marrakech')!;
    (component as any).select(city);
    expect(selected).toBeTruthy();
    expect(selected.id).toBe('marrakech');
  });

  it('should clear query when cleared', () => {
    (component as any).query.set('Marrakech');
    (component as any).clear();
    expect((component as any).query()).toBe('');
    expect((component as any).open()).toBe(false);
  });
});
