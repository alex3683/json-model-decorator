import { describe, expect, it } from 'vitest';
import { jsonInstanceDeserializer, jsonNullableInstanceDeserializer } from './JsonInstanceDeserializer';

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
      const deserializer = jsonNullableInstanceDeserializer(Person);
      expect(deserializer(null)).toBeNull();
      // @ts-expect-error testing invalid input
      expect(deserializer(undefined)).toBeNull();
    });
  });

  describe('when the input is not an object', () => {
    it('should throw an error', () => {
      const deserializer = jsonInstanceDeserializer(Person);
      // @ts-expect-error testing invalid input
      expect(() => deserializer([1, 2, 3])).toThrowError('Expected object');
      // @ts-expect-error testing invalid input
      expect(() => deserializer('not an object')).toThrowError('Expected object');
      // @ts-expect-error testing invalid input
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

describe('JsonNullableInstanceDeserializer', () => {
  it('should deserialize an object', () => {
    const jsonObject = { name: 'John', age: 25 };
    const deserializer = jsonNullableInstanceDeserializer(Person);
    const instance = deserializer(jsonObject)!;
    expect(instance.constructor).toBe(Person);
    expect(instance.name).toBe('John');
    expect(instance.age).toBe(25);
  });

  it('should deserialize null or undefined', () => {
    const deserializer = jsonNullableInstanceDeserializer(Person);
    expect(deserializer(null)).toBeNull();
    // @ts-expect-error testing invalid input
    expect(deserializer(undefined)).toBeNull();
  });

  describe('when the input is not an object or null', () => {
    it('should throw an error', () => {
      const deserializer = jsonNullableInstanceDeserializer(Person);
      // @ts-expect-error testing invalid input
      expect(() => deserializer([1, 2, 3])).toThrowError('Expected object');
      // @ts-expect-error testing invalid input
      
      expect(() => deserializer('not an object')).toThrowError('Expected object');
      // @ts-expect-error testing invalid input
      expect(() => deserializer(() => false)).toThrowError('Expected object');
    });
  });
});