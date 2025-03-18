import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlidePanelService {
  private slidePanel!: { openPanel: () => void; closePanel: () => void } | null;
  private onCloseCallback?: () => void;

  register(panel: { openPanel: () => void; closePanel: () => void } | null) {
    this.slidePanel = panel;
  }

  // For button to open the slide panel
  open() {
    this.slidePanel?.openPanel();
  }

  // Use this to close panel
  close() {
    this.slidePanel?.closePanel();
  }

  // Use this To detect when the panel has closed and execute a function (like submitting a form)
  onClose(callback: () => void) {
    this.onCloseCallback = callback; // Keep the latest callback
  }



  // This is only for SlidePanelComponent 
  // Called when the panel has completely closed
  notifyClose() {
    this.onCloseCallback?.(); // Execute the callback every time the panel closes
  }
}
