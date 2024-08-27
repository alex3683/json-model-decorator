import { describe, expect, it } from 'vitest';
import { jsonDateDeserializer } from './JsonDateDeserializer';

describe('JsonDateDeserializer', () => {
  it('should deserialize a date string', () => {
    const deserializer = jsonDateDeserializer();
    const date = deserializer('2023-10-01T15:40:30Z');
    expect(date).toBeInstanceOf(Date);
    expect(date!.toISOString()).toBe('2023-10-01T15:40:30.000Z');
  });

  describe('when the input is null or undefined', () => {
    it('should return null', () => {
      const deserializer = jsonDateDeserializer();
      expect(deserializer(null)).toBeNull();
      expect(deserializer(undefined)).toBeNull();
    });
  });

  describe('when the input is not a string', () => {
    it('should throw an error', () => {
      const deserializer = jsonDateDeserializer();
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