import { Injectable } from '@angular/core';
import { SlidePanelComponent } from '../../ui/slide-panel/slide-panel.component';

@Injectable({
  providedIn: 'root'
})
export class SlidePanelService {
  private panelInstance: SlidePanelComponent | null = null;
  private closeCallback: (() => void) | null = null;

  register(panel: SlidePanelComponent | null) {
    this.panelInstance = panel;
  }

  // For button to open the slide panel
  open() {
    this.panelInstance?.openPanel();
  }

  // Use this to close panel
  close() {
    this.panelInstance?.closePanel();
  }

  // Use this To detect when the panel has closed and execute a function (like submitting a form)
  onClose(callback: () => void) {
    this.closeCallback = callback; // Keep the latest callback
  }



  // This is only for SlidePanelComponent 
  // Called when the panel has completely closed
  notifyClose() {
    if (this.closeCallback) {
      this.closeCallback();
    }
  }
}
