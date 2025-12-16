import { expect } from 'vitest';

/**
 * Custom Vitest matchers for common assertions
 */

/**
 * Check if element has specific class
 */
expect.extend({
  toHaveClass(received, className) {
    const { isNot } = this;
    const hasClass = received.classList?.contains(className);
    
    return {
      pass: hasClass,
      message: () =>
        `Expected element ${isNot ? 'not ' : ''}to have class "${className}"`,
    };
  },
});

/**
 * Check if element has specific attribute
 */
expect.extend({
  toHaveAttribute(received, attribute, value) {
    const { isNot } = this;
    const attrValue = received.getAttribute(attribute);
    const hasAttribute = value ? attrValue === value : attrValue !== null;
    
    return {
      pass: hasAttribute,
      message: () =>
        `Expected element ${isNot ? 'not ' : ''}to have attribute "${attribute}"${value ? ` with value "${value}"` : ''}`,
    };
  },
});

/**
 * Check if function was called with specific arguments
 */
expect.extend({
  toHaveBeenCalledWithArgs(received, ...expectedArgs) {
    const { isNot } = this;
    const calls = received.mock?.calls || [];
    const matched = calls.some(call =>
      expectedArgs.every((arg, index) => call[index] === arg)
    );
    
    return {
      pass: matched,
      message: () =>
        `Expected function ${isNot ? 'not ' : ''}to have been called with arguments: ${JSON.stringify(expectedArgs)}`,
    };
  },
});

/**
 * Check if value is a valid date
 */
expect.extend({
  toBeValidDate(received) {
    const { isNot } = this;
    const isValid = received instanceof Date && !isNaN(received.getTime());
    
    return {
      pass: isValid,
      message: () =>
        `Expected ${isNot ? 'not ' : ''}to be a valid date`,
    };
  },
});

/**
 * Check if object has all required keys
 */
expect.extend({
  toHaveRequiredKeys(received, requiredKeys) {
    const { isNot } = this;
    const keys = Object.keys(received);
    const hasAllKeys = requiredKeys.every(key => keys.includes(key));
    
    return {
      pass: hasAllKeys,
      message: () =>
        `Expected object ${isNot ? 'not ' : ''}to have all required keys: ${requiredKeys.join(', ')}`,
    };
  },
});

