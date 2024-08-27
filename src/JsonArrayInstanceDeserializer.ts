import { Constructor } from './Constructor';
import { asInstance } from './JsonProperty';

export function jsonArrayInstanceDeserializer<T extends object>(
  constructor: Constructor<T>
): (raw: any[]) => T[] {
  return (raw: any[]) => {
    if (!Array.isArray(raw)) {
      throw new Error('Expected array');
    }
    return raw.map(item => asInstance(constructor, item));
  };
}