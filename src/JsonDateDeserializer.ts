import { Nullable } from './Nullable';

export function jsonDateDeserializer(): (raw: string) => Date  {
  return (raw: string) =>{
    if (typeof raw !== 'string' || raw === '') {
      throw new Error('Expected non-empty string');
    }
    const date = new Date(raw);
    if (date.toString() === 'Invalid Date') {
      throw new Error('Invalid date string');
    }

    return new Date(raw);
  };
}

export function jsonNullableDateDeserializer(): (raw: Nullable<string>) => Date | null {
  return (raw: Nullable<string>) =>{
    if (raw == null) {
      return null;
    }

    if (typeof raw !== 'string' || raw === '') {
      throw new Error('Expected non-empty string');
    }
    const date = new Date(raw);
    if (date.toString() === 'Invalid Date') {
      throw new Error('Invalid date string');
    }

    return new Date(raw);
  };
}