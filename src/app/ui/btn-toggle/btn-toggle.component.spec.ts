import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnToggleComponent } from './btn-toggle.component';

describe('BtnToggleComponent', () => {
  let component: BtnToggleComponent;
  let fixture: ComponentFixture<BtnToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
