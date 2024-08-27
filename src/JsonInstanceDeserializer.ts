import { Constructor } from './Constructor';
import { asInstance } from './JsonProperty';

export function jsonInstanceDeserializer<T extends object>(
  constructor: Constructor<T>,
  fallbackValueFactory?: () => T
): (raw: any) => T | null{
  return (raw: any) => {
    if (raw == null) {
      return fallbackValueFactory ? fallbackValueFactory() : null;
    }

    if (typeof raw !== 'object' || Array.isArray(raw)) {
      throw new Error('Expected object');
    }

    return asInstance(constructor, raw);
  };
}