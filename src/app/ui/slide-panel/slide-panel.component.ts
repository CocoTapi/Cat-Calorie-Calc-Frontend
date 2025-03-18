import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgFor } from '@angular/common';
import { SlidePanelService } from '../../services/slide-panel/slide-panel.service';

@Component({
  selector: 'app-control-panel',
  imports: [NgFor],
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
  title = input<string | undefined>(); 
  @ViewChild('panel', { static: false }) panel!: ElementRef;

  // When the panel size becomes 30% or less of user's screen size, close the screen.
  private thresholdPercent = 70;

  private startY = 0;
  private currentY = 0;
  private isDragging = false;
  private lastPosition = 100; // Store last panel position
  isOpen = false;

  constructor(private renderer: Renderer2, private slidePanelService: SlidePanelService) {}

  ngOnInit(): void {
    this.slidePanelService.register(this);
  }

  // Clean up reference when component is destroyed
  ngOnDestroy() {
    this.slidePanelService.register(null); 
  }
  
  openPanel() {
    this.isOpen = true;
    this.lastPosition = 0;
    setTimeout(() => {
      this.renderer.setStyle(this.panel.nativeElement, 'transform', `translateY(${this.lastPosition}%)`);
    });
  }

  closePanel() {
    this.lastPosition = 100;
    this.renderer.setStyle(this.panel.nativeElement, 'transform', `translateY(${this.lastPosition}%)`);
    setTimeout(() => {
      this.isOpen = false;

      // Notify the service when closing
      this.slidePanelService.notifyClose();
    }, 300);
  }

  onTouchStart(event: TouchEvent | MouseEvent) {
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

  // Calculate moved Difference and get the current position
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
    this.renderer.setStyle(this.panel.nativeElement, 'transform', `translateY(${newPosition}%)`);
  }
  
  onTouchEnd(event: TouchEvent | MouseEvent) {
    event.preventDefault();
    if (!this.isDragging) return;
  
    // Add transition for the dropping animation
    this.renderer.setStyle(this.panel.nativeElement, 'transition', 'transform 0.3s ease-in-out');
   
    const finalPosition = this.getPositionFromDifference();
    
    if (finalPosition > this.thresholdPercent) {
      this.closePanel();
    } else {
      this.lastPosition = finalPosition;
      this.renderer.setStyle(this.panel.nativeElement, 'transform', `translateY(${this.lastPosition}%)`);
    }
    
    this.isDragging = false;
  
    if (!('touches' in event)) {
      window.removeEventListener('mousemove', this.onTouchMove.bind(this));
      window.removeEventListener('mouseup', this.onTouchEnd.bind(this));
    }
  }
}
