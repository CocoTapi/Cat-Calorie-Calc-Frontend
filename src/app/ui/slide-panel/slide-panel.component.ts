import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, input, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { SlidePanelService } from '../../services/slide-panel/slide-panel.service';

@Component({
  selector: 'app-slide-panel',
  imports: [],
  templateUrl: './slide-panel.component.html',
  styleUrl: './slide-panel.component.scss',
  animations: [
    trigger('slidePanel', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.3s ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class SlidePanelComponent implements OnInit, OnDestroy {
  // Unique ID for the panel
  @Input({ required: true }) panelId!: string; 

  title = input<string | undefined>();
  @ViewChild('panel', { static: false }) panel!: ElementRef;
  @ViewChild('content', { static: false }) content!: ElementRef;

  // Change this when you want to change closing timing
  private thresholdPercent = 70;

  private startY = 0;
  private currentY = 0;
  private isDragging = false;
  private lastPosition = 100; // Store last panel position
  isOpen = false;

  constructor(private renderer: Renderer2, private slidePanelService: SlidePanelService) { }

  ngOnInit(): void {
    this.slidePanelService.register(this.panelId, this);
  }

  // Clean up reference when component is destroyed
  ngOnDestroy() {
    this.slidePanelService.unregister(this.panelId);
  }

  // Set the panel's y position
  setYPosition(position: number) {
    if (position < 0 || position > 100) throw new Error ('position is invalid. Required between 0 and 100.') ;

    return this.renderer.setStyle(this.panel.nativeElement, 'transform', `translateY(${position}%)`);
  }

  openPanel() {
    this.isOpen = true;
    this.lastPosition = 0;
    setTimeout(() => {
      this.setYPosition(this.lastPosition);
    });
  }

  closePanel() {
    this.lastPosition = 100;
    this.setYPosition(this.lastPosition);
    setTimeout(() => {
      this.isOpen = false;

      // Notify the service when closing
      this.slidePanelService.notifyClose(this.panelId);
    }, 300);
  }

  // TODO: reconsider the function. 
  // When top content is displayed and user scroll down, stop interaction and close the panel
  // Checks if the user interacted with a form field, and if so, it prevents the event handler from running. 
  private checkUserInteraction(event: TouchEvent | MouseEvent): boolean {
    const target = event.target as HTMLElement;

    // List of elements that should not trigger dragging
    const excludedTags = ['INPUT', 'TEXTAREA', 'BUTTON', 'SPAN', 'MAT-ICON', 'PATH', 'svg'];

    // If the touched element is any of the excluded tags, return false
    if (excludedTags.includes(target.tagName)) return false;

    // For custom selection
    const classList = ['mat-mdc-select-value', "mat-mdc-form-field-infix"]
    if (classList.includes(target.className)) return false;

    return true;
  }

  onTouchStart(event: TouchEvent | MouseEvent) {
    if (!this.checkUserInteraction(event)) return;

    event.preventDefault(); 

    // Get the Difference of start position
    if ('touches' in event) {
      this.startY = event.touches[0].clientY;
    } else {
      this.startY = event.clientY;
      window.addEventListener('mousemove', this.onTouchMove.bind(this));
      window.addEventListener('mouseup', this.onTouchEnd.bind(this));
    }

    this.isDragging = true;
    this.currentY = this.startY; // Ensure currentY is initialized

    // Remove transition so it follows the finger instantly
    this.renderer.setStyle(this.panel.nativeElement, 'transition', 'none');
  }

  // Calculate moved area and get the current position
  private getPositionFromDifference(): number {
    const diff = this.currentY - this.startY;
    let position = this.lastPosition + (diff / window.innerHeight) * 100;
    position = Math.max(0, Math.min(position, 100));

    return position;
  }

  onTouchMove(event: TouchEvent | MouseEvent) {
    if (!this.isDragging) return;

    if ('touches' in event) {
      this.currentY = event.touches[0].clientY;
    } else {
      this.currentY = event.clientY;
    }

    const newPosition = this.getPositionFromDifference();

    // if user is moving the panel, add the transition to move the panel with dragging
    this.setYPosition(newPosition);
  }

  onTouchEnd(event: TouchEvent | MouseEvent) {
    if (!this.isDragging) return;

    // Add transition for the dropping animation
    this.renderer.setStyle(this.panel.nativeElement, 'transition', 'transform 0.3s ease-in-out');

    const finalPosition = this.getPositionFromDifference();

    if (finalPosition > this.thresholdPercent) {
      // this.closePanel();
      this.slidePanelService.close(this.panelId); // will check canClose before closing
    } else {
      // this.lastPosition = finalPosition;
      this.setYPosition(this.lastPosition);
    }

    this.isDragging = false;

    if (!('touches' in event)) {
      window.removeEventListener('mousemove', this.onTouchMove.bind(this));
      window.removeEventListener('mouseup', this.onTouchEnd.bind(this));
    }
  }
}
