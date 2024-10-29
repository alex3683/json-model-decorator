import { describe, expect, it } from 'vitest';
import { jsonDateDeserializer, jsonNullableDateDeserializer } from './JsonDateDeserializer';

describe('JsonDateDeserializer', () => {
  it('should deserialize a date string', () => {
    const deserializer = jsonDateDeserializer();
    const date = deserializer('2023-10-01T15:40:30Z');
    expect(date).toBeInstanceOf(Date);
    expect(date!.toISOString()).toBe('2023-10-01T15:40:30.000Z');
  });

  describe('when the input is null or undefined', () => {
    it('should throw an error', () => {
      const deserializer = jsonDateDeserializer();
      // @ts-expect-error testing invalid input
      expect(() => deserializer(null)).toThrowError('Expected non-empty string');
      // @ts-expect-error testing invalid input
      expect(() => deserializer(undefined)).toThrowError('Expected non-empty string');
    });
  });

  describe('when the input is not a string', () => {
    it('should throw an error', () => {
      const deserializer = jsonDateDeserializer();
    // @ts-expect-error testing invalid input
      expect(() => deserializer(123)).toThrowError('Expected non-empty string');
    });
  });

  describe('when the input is an empty string', () => {
    it('should throw an error', () => {
      const deserializer = jsonDateDeserializer();
      expect(() => deserializer('')).toThrowError('Expected non-empty string');
    });
  });

  describe('when the input is an invalid string', () => {
    it('should throw an error', () => {
      const deserializer = jsonDateDeserializer();
      expect(() => deserializer('not a date')).toThrowError('Invalid date string');
    });
  });
});

describe('JsonNullableDateDeserializer', () => {
  it('should deserialize a date string', () => {
    const deserializer = jsonNullableDateDeserializer();
    const date = deserializer('2023-10-01T15:40:30Z');
    expect(date).toBeInstanceOf(Date);
    expect(date!.toISOString()).toBe('2023-10-01T15:40:30.000Z');
  });

  it('should deserialize null or undefined', () => {
    const deserializer = jsonNullableDateDeserializer();
    expect(deserializer(null)).toBeNull();
    // @ts-expect-error testing invalid input
    expect(deserializer(undefined)).toBeNull();
  });

  describe('when the input is not a string or null', () => {
    it('should throw an error', () => {
      const deserializer = jsonNullableDateDeserializer();
      // @ts-expect-error testing invalid input
      expect(() => deserializer(123)).toThrowError('Expected non-empty string');
    });
  });

  describe('when the input is an empty string', () => {
    it('should throw an error', () => {
      const deserializer = jsonNullableDateDeserializer();
      expect(() => deserializer('')).toThrowError('Expected non-empty string');
    });
  });

  describe('when the input is an invalid string', () => {
    it('should throw an error', () => {
      const deserializer = jsonNullableDateDeserializer();
      expect(() => deserializer('not a date')).toThrowError('Invalid date string');
    });
  });
});