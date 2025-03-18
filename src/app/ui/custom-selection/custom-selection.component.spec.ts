import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectionComponent } from './custom-selection.component';

describe('CustomSelectionComponent', () => {
  let component: CustomSelectionComponent;
  let fixture: ComponentFixture<CustomSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
