import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SlidePanelComponent } from './slide-panel.component';
import { SlidePanelService } from '../../services/slide-panel/slide-panel.service';
import { ElementRef, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SlidePanelComponent', () => {
  let component: SlidePanelComponent;
  let fixture: ComponentFixture<SlidePanelComponent>;
  let slidePanelService: jasmine.SpyObj<SlidePanelService>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;

  beforeEach(async () => {
    // Create spy object for SlidePanelService
    slidePanelService = jasmine.createSpyObj('SlidePanelService', [
      'register', 'unregister', 'notifyClose', 'close'
    ]);

    // Create mock renderer
    mockRenderer = jasmine.createSpyObj('Renderer2', ['setStyle']);

    await TestBed.configureTestingModule({
      imports: [
        SlidePanelComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SlidePanelService, useValue: slidePanelService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidePanelComponent);
    component = fixture.componentInstance;
    component.panelId = 'test-panel';
    
    // Mock ViewChild Elements
    component.panel = { nativeElement: document.createElement('div') } as ElementRef;
    component.content = { nativeElement: document.createElement('div') } as ElementRef;
    
    // Override the renderer with our mock
    component['renderer'] = mockRenderer;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register with SlidePanelService on init', () => {
    expect(slidePanelService.register).toHaveBeenCalledWith('test-panel', component);
  });

  it('should unregister from SlidePanelService on destroy', () => {
    component.ngOnDestroy();
    expect(slidePanelService.unregister).toHaveBeenCalledWith('test-panel');
  });

  it('should set Y position correctly', () => {
    component.setYPosition(50);
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      component.panel.nativeElement,
      'transform',
      'translateY(50%)'
    );
  });

  it('should throw error for invalid Y position', () => {
    expect(() => component.setYPosition(-10)).toThrow();
    expect(() => component.setYPosition(110)).toThrow();
  });

  it('should open panel correctly', fakeAsync(() => {
    component.openPanel();
    
    expect(component.isOpen).toBe(true);
    expect(component['lastPosition']).toBe(0);
    
    tick();
    
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      component.panel.nativeElement,
      'transform',
      'translateY(0%)'
    );
  }));

  it('should close panel correctly', fakeAsync(() => {
    component.closePanel();
    
    expect(component['lastPosition']).toBe(100);
    
    // Should set the position immediately
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      component.panel.nativeElement,
      'transform',
      'translateY(100%)'
    );
    
    // After timeout, should set isOpen to false and notify service
    tick(300);
    
    expect(component.isOpen).toBe(false);
    expect(slidePanelService.notifyClose).toHaveBeenCalledWith('test-panel');
  }));

  it('should handle checkUserInteraction correctly for excluded elements', () => {
    const inputEvent = { target: document.createElement('INPUT') } as unknown as TouchEvent;
    const buttonEvent = { target: document.createElement('BUTTON') } as unknown as TouchEvent;
    
    expect(component['checkUserInteraction'](inputEvent)).toBe(false);
    expect(component['checkUserInteraction'](buttonEvent)).toBe(false);
  });

  it('should handle checkUserInteraction correctly for allowed elements', () => {
    const divEvent = { target: document.createElement('DIV') } as unknown as TouchEvent;
    
    expect(component['checkUserInteraction'](divEvent)).toBe(true);
  });

  it('should handle checkUserInteraction correctly for custom selection', () => {
    const div = document.createElement('DIV');
    div.className = 'mat-mdc-select-value';
    const customEvent = { target: div } as unknown as TouchEvent;
    
    expect(component['checkUserInteraction'](customEvent)).toBe(false);
  });

  it('should handle touch start correctly', () => {
    const mockTouchEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      touches: [{ clientY: 100 }],
      target: document.createElement('DIV')
    } as unknown as TouchEvent;
    
    component.onTouchStart(mockTouchEvent);
    
    expect(mockTouchEvent.preventDefault).toHaveBeenCalled();
    expect(component['startY']).toBe(100);
    expect(component['currentY']).toBe(100);
    expect(component['isDragging']).toBe(true);
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      component.panel.nativeElement,
      'transition',
      'none'
    );
  });

  it('should ignore touch start for excluded elements', () => {
    const mockTouchEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      touches: [{ clientY: 100 }],
      target: document.createElement('INPUT')
    } as unknown as TouchEvent;
    
    component.onTouchStart(mockTouchEvent);
    
    expect(mockTouchEvent.preventDefault).not.toHaveBeenCalled();
    expect(component['isDragging']).toBe(false);
  });

  it('should handle mouse start correctly', () => {
    const spyAddEventListener = spyOn(window, 'addEventListener');
    const mockMouseEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      clientY: 100,
      target: document.createElement('DIV')
    } as unknown as MouseEvent;
    
    component.onTouchStart(mockMouseEvent);
    
    expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
    expect(component['startY']).toBe(100);
    expect(component['isDragging']).toBe(true);
    expect(spyAddEventListener).toHaveBeenCalledTimes(2);
    expect(spyAddEventListener).toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    expect(spyAddEventListener).toHaveBeenCalledWith('mouseup', jasmine.any(Function));
  });

  it('should calculate position from difference correctly', () => {
    // Set up test conditions
    component['startY'] = 100;
    component['currentY'] = 150; // Moved 50px down
    component['lastPosition'] = 0;
    
    // Mock window.innerHeight
    spyOnProperty(window, 'innerHeight').and.returnValue(500);
    
    const position = component['getPositionFromDifference']();
    
    // (150 - 100) / 500 * 100 = 10% + 0% (lastPosition) = 10%
    expect(position).toBe(10);
  });

  it('should handle touch move correctly', () => {
    // Set up drag mode
    component['isDragging'] = true;
    component['startY'] = 100;
    
    const mockTouchEvent = {
      touches: [{ clientY: 150 }]
    } as unknown as TouchEvent;
    
    // Spy on getPositionFromDifference
    // @ts-expect-error: Accessing private method for testing
    spyOn(component, 'getPositionFromDifference').and.returnValue(10);
    
    component.onTouchMove(mockTouchEvent);
    
    expect(component['currentY']).toBe(150);
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      component.panel.nativeElement,
      'transform',
      'translateY(10%)'
    );
  });

  it('should handle mouse move correctly', () => {
    // Set up drag mode
    component['isDragging'] = true;
    component['startY'] = 100;
    
    const mockMouseEvent = {
      clientY: 150
    } as unknown as MouseEvent;
    
    // Spy on getPositionFromDifference
    // @ts-expect-error: Accessing private method for testing
    spyOn(component, 'getPositionFromDifference').and.returnValue(10);
    
    component.onTouchMove(mockMouseEvent);
    
    expect(component['currentY']).toBe(150);
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      component.panel.nativeElement,
      'transform',
      'translateY(10%)'
    );
  });

  it('should do nothing on touch move if not dragging', () => {
    // Not in drag mode
    component['isDragging'] = false;
    
    const mockTouchEvent = {
      touches: [{ clientY: 150 }]
    } as unknown as TouchEvent;
    
    // Reset renderer spy
    mockRenderer.setStyle.calls.reset();
    
    component.onTouchMove(mockTouchEvent);
    
    expect(mockRenderer.setStyle).not.toHaveBeenCalled();
  });

  it('should handle touch end with close action', () => {
    // Set up drag mode
    component['isDragging'] = true;
    
    // Position is above threshold to close
    // @ts-expect-error: Accessing private method for testing
    spyOn(component, 'getPositionFromDifference').and.returnValue(80);
    
    const mockTouchEvent = {} as unknown as TouchEvent;
    
    component.onTouchEnd(mockTouchEvent);
    
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      component.panel.nativeElement,
      'transition',
      'transform 0.3s ease-in-out'
    );
    
    expect(slidePanelService.close).toHaveBeenCalledWith('test-panel');
    expect(component['isDragging']).toBe(false);
  });

  it('should handle touch end with stay open action', () => {
    // Set up drag mode
    component['isDragging'] = true;
    component['lastPosition'] = 0;
    
    // Position is below threshold to close
    // @ts-expect-error: Accessing private method for testing
    spyOn(component, 'getPositionFromDifference').and.returnValue(30);
    
    const mockTouchEvent = {} as unknown as TouchEvent;
    
    component.onTouchEnd(mockTouchEvent);
    
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      component.panel.nativeElement,
      'transition',
      'transform 0.3s ease-in-out'
    );
    
    // Should restore to last position
    expect(mockRenderer.setStyle).toHaveBeenCalledWith(
      component.panel.nativeElement,
      'transform',
      'translateY(0%)'
    );
    
    expect(slidePanelService.close).not.toHaveBeenCalled();
    expect(component['isDragging']).toBe(false);
  });

  it('should clean up event listeners on mouse end', () => {
    // Set up drag mode
    component['isDragging'] = true;
    
    const spyRemoveEventListener = spyOn(window, 'removeEventListener');
    const mockMouseEvent = {} as unknown as MouseEvent;
    
    // Position is below threshold to close
    // @ts-expect-error: Accessing private method for testing
    spyOn(component, 'getPositionFromDifference').and.returnValue(30);
    
    component.onTouchEnd(mockMouseEvent);
    
    expect(spyRemoveEventListener).toHaveBeenCalledTimes(2);
    expect(spyRemoveEventListener).toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    expect(spyRemoveEventListener).toHaveBeenCalledWith('mouseup', jasmine.any(Function));
  });

  it('should do nothing on touch end if not dragging', () => {
    // Not in drag mode
    component['isDragging'] = false;
    
    const mockTouchEvent = {} as unknown as TouchEvent;
    
    // Reset renderer spy
    mockRenderer.setStyle.calls.reset();
    
    component.onTouchEnd(mockTouchEvent);
    
    expect(mockRenderer.setStyle).not.toHaveBeenCalled();
  });
});
