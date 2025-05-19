import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentFeedStatusComponent } from './current-feed-status.component';

describe('CurrentFeedStatusComponent', () => {
  let component: CurrentFeedStatusComponent;
  let fixture: ComponentFixture<CurrentFeedStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentFeedStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentFeedStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
