import { describe, expect, it } from 'vitest';
import { Constructor } from '../src/Constructor';

class MyClass {
  constructor() {
    // constructor implementation
  }
}

describe('Constructor', () => {
  it('should create an instance of the specified class', () => {
    const myClassConstructor: Constructor<MyClass> = MyClass;
    const instance = new myClassConstructor();
    expect(instance).toBeInstanceOf(MyClass);
  });
});