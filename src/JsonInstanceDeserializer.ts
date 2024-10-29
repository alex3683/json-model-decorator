import { Constructor } from './Constructor';
import { asInstance, RawJson } from './JsonProperty';
import { Nullable } from './Nullable';

export function jsonInstanceDeserializer<T extends object>(
  constructor: Constructor<T>,
  fallbackValueFactory?: () => T
): (raw: Nullable<RawJson<T>>) => T {
  return (raw: Nullable<RawJson<T>>) => {
    if (!raw && !fallbackValueFactory) {
      throw new Error('Expected object or fallback factory');
    }

    if (raw && (typeof raw !== 'object' || Array.isArray(raw))) {
      throw new Error('Expected object');
    }

    return (raw ? asInstance(constructor, raw) : fallbackValueFactory?.()) as T
  };
}

export function jsonNullableInstanceDeserializer<T extends object>(
  constructor: Constructor<T>,
  fallbackValueFactory?: () => Nullable<T>
): (raw: Nullable<RawJson<T>>) => Nullable<T> {
  return (raw: Nullable<RawJson<T>>) => {
    if (raw && (typeof raw !== 'object' || Array.isArray(raw))) {
      throw new Error('Expected object');
    }
    
    return (raw ? asInstance(constructor, raw) : fallbackValueFactory?.()) as Nullable<T> ?? null;
  }
}
