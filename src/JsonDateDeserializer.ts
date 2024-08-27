export function jsonDateDeserializer(): (raw: any) => Date | null {
  return (raw: any) =>{
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