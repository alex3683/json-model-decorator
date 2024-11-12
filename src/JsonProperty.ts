import { Constructor } from './Constructor';

export type RawJson<T> = Partial<Record<keyof T, T[keyof T]>>;

export interface JsonPropertyDefinition<ClassType, PropertyType> {
  // not sure how to type this. unkown is problematic in the createDefinition call
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(rawValue: any, rawObject: Record<keyof ClassType, unknown>): PropertyType;
  serialize(instance: PropertyType): unknown;
}

const definitionMap: Map<Constructor<unknown>, Map<string, JsonPropertyDefinition<unknown, unknown>>> = new Map();

export function asInstance<T extends object>(constructor: Constructor<T>, raw: RawJson<T>): T {
  const instance = new constructor();
  const definitions = definitionMap.get(constructor);
  if (!definitions) {
    (Object.keys(raw) as Array<keyof T>).forEach(key => {
      if (raw[key] !== undefined) {
        instance[key] = raw[key];
      }
    });
    return instance;
  }

  (Array.from(definitions.entries()) as Array<[keyof T, JsonPropertyDefinition<unknown, T[keyof T]>]>).forEach(
    ([key, definition]) => {
      instance[key] = definition.deserialize(raw[key], raw);
    }
  );
  return instance;
}

export function asInstances<T extends object>(constructor: Constructor<T>, raw: RawJson<T>[]): T[] {
  return raw.map(item => asInstance(constructor, item));
}

export function parseAsInstance<T extends object>(constructor: Constructor<T>, jsonString: string): T {
  const raw = JSON.parse(jsonString) as RawJson<T>;
  return asInstance(constructor, raw);
}

export function parseAsInstances<T extends object>(constructor: Constructor<T>, jsonString: string): T[] {
  const raw = JSON.parse(jsonString) as RawJson<T>[];
  return asInstances(constructor, raw);
}

export function cloneInstances<T extends object>(instances: T[]): T[] {
  return instances.map(cloneInstance);
}

export function cloneInstance<T extends object>(instance: T): T {
  return asInstance(
    instance.constructor as Constructor<T>,
    JSON.parse(JSON.stringify(instance)) as RawJson<T>
  );
}

export function jsonProperty<ClassType extends object, PropertyType>(
  definition?: Partial<JsonPropertyDefinition<ClassType, PropertyType>>
) {
  return function (
    _target: ClassAccessorDecoratorTarget<ClassType, PropertyType>,
    context: ClassAccessorDecoratorContext<ClassType, PropertyType>
  ) {
    if (context.static) {
      throw new Error('jsonProperty cannot be used with static properties');
    }

    if (context.kind !== 'accessor') {
      throw new Error(`jsonProperty can only be used on accessors, but set on kind ${context.kind}`);
    }

    let registered = false;
    context.addInitializer(function () {
      if (registered) {
        return;
      }

      const type = this.constructor as Constructor<ClassType>;
      if (!definitionMap.has(type)) {
        definitionMap.set(type, new Map());
      }
      definitionMap.get(type)!.set(context.name.toString(), createDefinition(definition));

       
      type.prototype.toJSON = function()  {
        const definitions = definitionMap.get(type);
        if (!definitions) {
          return {};
        }

        const instance = this as ClassType;
        const result: Record<string, unknown> = {};
        (
          Array.from(definitions.entries()) as Array<[keyof ClassType, JsonPropertyDefinition<unknown, unknown>]>
        ).forEach(([key, definition]) => {
          result[key as string] = definition.serialize(instance[key]);
        });
        return result;
      };
      registered = true;
    });
  };
}

const identity = <T>(x: T): T => x;
function createDefinition<ClassType, PropertyType>(
  definition?: Partial<JsonPropertyDefinition<ClassType, PropertyType>>
): JsonPropertyDefinition<ClassType, PropertyType> {
  return {
    deserialize: definition?.deserialize ?? identity,
    serialize: definition?.serialize ?? identity,
  };
}
