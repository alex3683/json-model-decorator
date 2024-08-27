import { describe, expect, it } from 'vitest';
import { jsonArrayInstanceDeserializer } from './JsonArrayInstanceDeserializer';


class Person {
  public name!: string;
  public age!: number;
}

describe('JsonArrayInstanceDeserializer', () => {
  it('should deserialize an array of objects', () => {
    const jsonArray = [
      { name: 'John', age: 25 },
      { name: 'Jane', age: 22 },
    ];
    const deserializer = jsonArrayInstanceDeserializer(Person);
    const instances = deserializer(jsonArray);
    expect(instances[0].constructor).toBe(Person);
    expect(instances[0].name).toBe('John');
    expect(instances[0].age).toBe(25);
    expect(instances[1].constructor).toBe(Person);
    expect(instances[1].name).toBe('Jane');
    expect(instances[1].age).toBe(22);
  });

  describe('when the input is null', () => {
    it('should throw an error', () => {
      const deserializer = jsonArrayInstanceDeserializer(Person);
      expect(() => deserializer(null!)).toThrowError('Expected array');
    });
  });

  describe('when the input is not an array', () => {
    it('should throw an error', () => {
      const deserializer = jsonArrayInstanceDeserializer(Person);
      // @ts-expect-error testing invalid input
      expect(() => deserializer({ name: 'John', age: 25 })).toThrowError('Expected array');
    });
  });

  describe('when the input is an empty array', () => {
    it('should return an empty array', () => {
      const deserializer = jsonArrayInstanceDeserializer(Person);
      const instances = deserializer([]);
      expect(instances).toEqual([]);
    });
  });
});