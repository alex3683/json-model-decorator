import { describe, expect, it } from 'vitest';
import { jsonInstanceDeserializer } from './JsonInstanceDeserializer';

class Person {
  public name!: string;
  public age!: number;
}

describe('JsonInstanceDeserializer', () => {
  it('should deserialize an object', () => {
    const jsonObject = { name: 'John', age: 25 };
    const deserializer = jsonInstanceDeserializer(Person);
    const instance = deserializer(jsonObject)!;
    expect(instance.constructor).toBe(Person);
    expect(instance.name).toBe('John');
    expect(instance.age).toBe(25);
  });

  describe('when the input is null or undefined', () => {
    it('should return null', () => {
      const deserializer = jsonInstanceDeserializer(Person);
      expect(deserializer(null)).toBeNull();
      expect(deserializer(undefined)).toBeNull();
    });
  });

  describe('when the input is not an object', () => {
    it('should throw an error', () => {
      const deserializer = jsonInstanceDeserializer(Person);
      expect(() => deserializer([1, 2, 3])).toThrowError('Expected object');
      expect(() => deserializer('not an object')).toThrowError('Expected object');
      expect(() => deserializer(() => false)).toThrowError('Expected object');
    });
  });

  describe('when the input is an empty object', () => {
    it('should return an empty object', () => {
      const deserializer = jsonInstanceDeserializer(Person);
      const instance = deserializer({});
      expect(instance).toEqual({});
    });
  });
});