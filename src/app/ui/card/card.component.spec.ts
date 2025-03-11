import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(CardComponent);
      component = fixture.componentInstance;
    })


  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
