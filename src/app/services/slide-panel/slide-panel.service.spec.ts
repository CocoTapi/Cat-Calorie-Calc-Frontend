import { TestBed } from '@angular/core/testing';

import { SlidePanelService } from './slide-panel.service';

describe('SlidePanelService', () => {
  let service: SlidePanelService;
  
  // Mock panel object with spy functions
  let mockPanel: { openPanel: jasmine.Spy; closePanel: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlidePanelService);
    
    // Create fresh mock panel for each test
    mockPanel = {
      openPanel: jasmine.createSpy('openPanel'),
      closePanel: jasmine.createSpy('closePanel')
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should register and open a panel', () => {
    // Register the panel
    service.register('test-panel', mockPanel);
    
    // Open the panel
    service.open('test-panel');
    
    // Check if openPanel was called
    expect(mockPanel.openPanel).toHaveBeenCalled();
  });
  
  it('should not throw error when opening non-existent panel', () => {
    // Should not throw error
    expect(() => service.open('non-existent')).not.toThrow();
  });
  
  it('should register canClose callback', () => {
    const canCloseCallback = jasmine.createSpy('canCloseCallback').and.returnValue(true);
    
    service.canClose('test-panel', canCloseCallback);
    service.register('test-panel', mockPanel);
    
    // Close the panel
    service.close('test-panel');
    
    // Callback should be called
    expect(canCloseCallback).toHaveBeenCalled();
    // Panel should close
    expect(mockPanel.closePanel).toHaveBeenCalled();
  });
  
  it('should not close panel when canClose returns false', () => {
    const canCloseCallback = jasmine.createSpy('canCloseCallback').and.returnValue(false);
    
    service.register('test-panel', mockPanel);
    service.canClose('test-panel', canCloseCallback);
    
    // Close the panel
    service.close('test-panel');
    
    // Callback should be called
    expect(canCloseCallback).toHaveBeenCalled();
    // Panel should not close
    expect(mockPanel.closePanel).not.toHaveBeenCalled();
    // Panel should reopen to restore position
    expect(mockPanel.openPanel).toHaveBeenCalled();
  });
  
  it('should close panel with no canClose callback', () => {
    service.register('test-panel', mockPanel);
    
    // Close the panel
    service.close('test-panel');
    
    // Panel should close
    expect(mockPanel.closePanel).toHaveBeenCalled();
  });
  
  it('should not throw error when closing non-existent panel', () => {
    // Should not throw error
    expect(() => service.close('non-existent')).not.toThrow();
  });
  
  it('should register and trigger onClose callback', () => {
    const onCloseCallback = jasmine.createSpy('onCloseCallback');
    
    service.register('test-panel', mockPanel);
    service.onClose('test-panel', onCloseCallback);
    
    // Trigger the notification
    service.notifyClose('test-panel');
    
    // Callback should be called
    expect(onCloseCallback).toHaveBeenCalled();
  });
  
  it('should not throw error when notifying non-existent panel', () => {
    // Should not throw error
    expect(() => service.notifyClose('non-existent')).not.toThrow();
  });
  
  it('should unregister panel and callbacks', () => {
    const onCloseCallback = jasmine.createSpy('onCloseCallback');
    
    service.register('test-panel', mockPanel);
    service.onClose('test-panel', onCloseCallback);
    
    // Unregister the panel
    service.unregister('test-panel');
    
    // Open should not work after unregister
    service.open('test-panel');
    expect(mockPanel.openPanel).not.toHaveBeenCalled();
    
    // Close should not work after unregister
    service.close('test-panel');
    expect(mockPanel.closePanel).not.toHaveBeenCalled();
    
    // Notify should not trigger callback after unregister
    service.notifyClose('test-panel');
    expect(onCloseCallback).not.toHaveBeenCalled();
  });
  
  // Tests for the validation trigger functionality
  it('should create validation trigger when canClose is registered', () => {
    const canCloseCallback = jasmine.createSpy('canCloseCallback').and.returnValue(true);
    service.canClose('test-panel', canCloseCallback);
    
    const trigger = service.getValidationTrigger('test-panel');
    expect(trigger).toBeTruthy();
  });
  
  it('should create a new validation trigger if one does not exist', () => {
    // Get validation trigger for panel that hasn't been registered yet
    const trigger = service.getValidationTrigger('new-panel');
    
    // Should create a new trigger
    expect(trigger).toBeTruthy();
    
    // Verify it's working by subscribing to it
    const triggerCallback = jasmine.createSpy('triggerCallback');
    trigger.subscribe(triggerCallback);
    
    // Manually emit on the trigger
    trigger.next();
    
    // Callback should have been called
    expect(triggerCallback).toHaveBeenCalled();
  });
  
  it('should emit validation trigger when canClose returns false', () => {
    const canCloseCallback = jasmine.createSpy('canCloseCallback').and.returnValue(false);
    service.register('test-panel', mockPanel);
    service.canClose('test-panel', canCloseCallback);
    
    // Set up trigger subscription
    const triggerCallback = jasmine.createSpy('triggerCallback');
    service.getValidationTrigger('test-panel').subscribe(triggerCallback);
    
    // Try to close the panel
    service.close('test-panel');
    
    // Validation trigger should be called
    expect(triggerCallback).toHaveBeenCalled();
  });
  
  it('should handle case when validation trigger does not exist during close', () => {
    // This is testing the branch where validationTriggers.get(id) might be undefined
    const canCloseCallback = jasmine.createSpy('canCloseCallback').and.returnValue(false);
    
    // Register the panel
    service.register('test-panel', mockPanel);
    
    // Manually set up canCloseCallbacks without creating validation trigger
    // Cast to unknown first to avoid TypeScript errors
    const serviceInternals = service as unknown as {
      canCloseCallbacks: Map<string, () => boolean>;
    };
    
    serviceInternals.canCloseCallbacks.set('test-panel', canCloseCallback);
    
    // This should not throw an error
    expect(() => service.close('test-panel')).not.toThrow();
    
    // Panel should attempt to restore position
    expect(mockPanel.openPanel).toHaveBeenCalled();
  });
  
  it('should clean up validation trigger on unregister', () => {
    const canCloseCallback = jasmine.createSpy('canCloseCallback').and.returnValue(true);
    service.canClose('test-panel', canCloseCallback);
    
    // Get the validation trigger
    const trigger = service.getValidationTrigger('test-panel');
    
    // Set up completed spy
    const completedSpy = jasmine.createSpy('completedSpy');
    trigger.subscribe({ 
      next: () => {}, 
      complete: completedSpy 
    });
    
    // Unregister the panel
    service.unregister('test-panel');
    
    // Completed should be called
    expect(completedSpy).toHaveBeenCalled();
  });
  
  it('should not throw error when unregistering panel with no validation trigger', () => {
    // Register panel without validation trigger
    service.register('test-panel', mockPanel);
    
    // Should not throw error
    expect(() => service.unregister('test-panel')).not.toThrow();
  });
});
