import { Constructor } from './Constructor';

export interface JsonPropertyDefinition<T> {
  deserialize(rawValue: any, rawObject: Partial<Record<keyof T, any>>): T;
  serialize(instance: T): string;
}

const definitionMap: Map<Constructor<any>, Map<string, JsonPropertyDefinition<any>>> = new Map();

export function asInstance<T extends object>(
  constructor: Constructor<T>,
  raw: Partial<Record<keyof T, any>>
): T {
  const instance = new constructor();
  const definitions = definitionMap.get(constructor);
  if (!definitions) {
    Object.keys(raw).forEach(key => {
      instance[key as keyof T] = raw[key as keyof T];
    });
    return instance;
  }

  Array.from(definitions.entries()).forEach(([key, definition]) => {
    instance[key as keyof T] = definition.deserialize(raw[key as keyof T], raw);
  });
  return instance;
}

export function asInstances<T extends object>(
  constructor: Constructor<T>,
  raw: Partial<Record<keyof T, any>>[]
): T[] {
  return raw.map(item => asInstance(constructor, item));
}

export function parseAsInstance<T extends object>(constructor: Constructor<T>, jsonString: string): T {
  const raw = JSON.parse(jsonString);
  return asInstance(constructor, raw);
}

export function parseAsInstances<T extends object>(constructor: Constructor<T>, jsonString: string): T[] {
  const raw = JSON.parse(jsonString);
  return asInstances(constructor, raw);
}

export function jsonProperty<T>(definition?: Partial<JsonPropertyDefinition<T>>) {
  return function (_property: any, context: ClassFieldDecoratorContext | ClassAccessorDecoratorContext): any {
    if (context.static) {
      throw new Error('jsonProperty cannot be used with static properties');
    }

    if (!['accessor', 'field'].includes(context.kind)) {
      throw new Error(`jsonProperty can only be used on field or accessors, but set on kind ${context.kind}`);
    }

    let registered = false;
    context.addInitializer(function () {
      if (registered) {
        return;
      }

      const type = (this as object).constructor as Constructor<T>;
      if (!definitionMap.has(type)) {
        definitionMap.set(type, new Map());
      }
      definitionMap.get(type)!.set(context.name.toString(), createDefinition(definition));
      registered = true;
    });
    return _property;
  };
}

const identity = (x: any): any => x;
function createDefinition<T>(definition?: Partial<JsonPropertyDefinition<T>>): JsonPropertyDefinition<T> {
  return {
    deserialize: definition?.deserialize ?? identity,
    serialize: definition?.serialize ?? identity,
  };
}