import { TestBed } from '@angular/core/testing';
import { appConfig } from './app.config';
import { ErrorStateMatcher } from '@angular/material/core';
import { OnlyTouchedErrorStateMatcher } from './utils/only-touched-error-state-matcher';

describe('AppConfig', () => {
  it('should provide OnlyTouchedErrorStateMatcher as ErrorStateMatcher', () => {
    // Create a TestBed with the app config
    TestBed.configureTestingModule({
      providers: appConfig.providers
    });

    // Get the ErrorStateMatcher from the DI
    const errorStateMatcher = TestBed.inject(ErrorStateMatcher);

    // Check that it's an instance of our custom matcher
    expect(errorStateMatcher).toBeInstanceOf(OnlyTouchedErrorStateMatcher);
  });
}); 