import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceSelectorComponent } from './force-selector.component';

describe('ForceSelectorComponent', () => {
  let component: ForceSelectorComponent;
  let fixture: ComponentFixture<ForceSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForceSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForceSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
