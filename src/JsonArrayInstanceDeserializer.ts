import { Constructor } from './Constructor';
import { asInstance, RawJson } from './JsonProperty';

export function jsonArrayInstanceDeserializer<T extends object>(
  constructor: Constructor<T>
): (raw: RawJson<T>[]) => T[] {
  return (raw: RawJson<T>[]) => {
    if (!Array.isArray(raw)) {
      throw new Error('Expected array');
    }
    return raw.map(item => asInstance(constructor, item));
  };
}