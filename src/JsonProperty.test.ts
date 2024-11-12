import { beforeEach, describe, expect, it } from 'vitest';
import { jsonDateDeserializer } from './JsonDateDeserializer';
import { jsonNullableInstanceDeserializer } from './JsonInstanceDeserializer';
import { asInstance, asInstances, jsonProperty, parseAsInstance, parseAsInstances } from './JsonProperty';

class Wheel {
  @jsonProperty({serialize: (value: number) => value * 2})
  public accessor size: number = 22;
}

class Car {
  @jsonProperty({ deserialize: jsonNullableInstanceDeserializer(Wheel) })
  public accessor wheel: Wheel | null = null;

  @jsonProperty({ deserialize: jsonDateDeserializer() })
  public accessor buildDate!: Date;

  public accessor ignored!: string;
}

class PlainCar {
  public accessor wheel!: Wheel;

  public accessor buildDate!: Date;

  public accessor ignored!: string;
}

const jsonString =
  '{"wheel": {"size": 25}, "buildDate": "2023-10-01T15:40:30Z", "ignored": "hello!", "iWasNotHereInTheFirstPlace": true}';

describe('jsonProperty', () => {
  it('throws when used on static properties', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @jsonProperty()
        public static accessor prop = 1;
      }
    }).toThrow('jsonProperty cannot be used with static properties');
  });

  it('throws when used on unsupported kinds', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        // @ts-expect-error a method is not a valid target
        @jsonProperty()
        public method() {}
      }
    }).toThrow('jsonProperty can only be used on accessors, but set on kind method');
  });
});

describe('asInstance', () => {

  describe('for model with decorators', () => {
    let instance: Car;

    beforeEach(() => {
      const obj = JSON.parse(jsonString);
      instance = asInstance(Car, obj);
    });

    it('can make an instance from parsed JSON', () => {
      expect(instance.constructor).toBe(Car);
      expect(instance.wheel).toBeDefined();
      
      expect(instance.wheel!.constructor).toBe(Wheel);
      expect(instance.wheel!.size).toBe(25);
      expect(instance.buildDate.constructor).toBe(Date);
      expect(instance.buildDate.getMonth()).toBe(9);
    });

    it('can make an instance from a raw JSON string', () => {
      instance = parseAsInstance(Car, jsonString);

      expect(instance.constructor).toBe(Car);
      expect(instance.wheel).toBeDefined();
      expect(instance.wheel!.constructor).toBe(Wheel);
      expect(instance.wheel!.size).toBe(25);
      expect(instance.buildDate.constructor).toBe(Date);
      expect(instance.buildDate.getMonth()).toBe(9);
    });

    it('ignores fields that are not decorated', () => {
      expect(instance.ignored).toBeUndefined();
      // @ts-expect-error testing invalid input
      expect(instance.iWasNotHereInTheFirstPlace).toBeUndefined();
    });
  });

  describe('for a model without decorators', () => {
    let instance: PlainCar;

    beforeEach(() => {
      const obj = JSON.parse(jsonString);
      instance = asInstance(PlainCar, obj);
    });

    it('sets all provided properties of the instance', () => {
      expect(instance.constructor).toBe(PlainCar);
      expect(instance.wheel.constructor).toBe(Object);
      expect(instance.buildDate.constructor).toBe(String);
    });

    it('sets all provided properties not part of the instance', () => {
      expect(instance.ignored).toBe('hello!');
      // @ts-expect-error testing invalid input
      expect(instance.iWasNotHereInTheFirstPlace).toBe(true);
    });

    it('does not apply deserialization for complex objects', () => {
      expect(instance.wheel.constructor).not.toBe(Wheel);
    });
  });
});

describe('asInstances', () => {
  it('can make multiple instances from parsed JSON', () => {
    const instances = asInstances(Car, [JSON.parse(jsonString), JSON.parse(jsonString)]);

    expect(instances.length).toBe(2);
    expect(instances[0].constructor).toBe(Car);
    expect(instances[1].constructor).toBe(Car);
  });
});

describe('parseAsInstance',() => {
  it('can make an instance from a raw JSON string', () => {
    const instance = parseAsInstance(Car, jsonString);

    expect(instance.constructor).toBe(Car);
    expect(instance.wheel).toBeDefined();
    expect(instance.wheel!.constructor).toBe(Wheel);
    expect(instance.wheel!.size).toBe(25);
    expect(instance.buildDate.constructor).toBe(Date);
    expect(instance.buildDate.getMonth()).toBe(9);
  });
});

describe('parseAsInstances', () => {
  it('can make multiple instances from a raw JSON string', () => {
    const instances = parseAsInstances(Car, `[${jsonString},${jsonString}]`);

    expect(instances.length).toBe(2);
    expect(instances[0].constructor).toBe(Car);
    expect(instances[1].constructor).toBe(Car);
  });
});

describe('on serialization', () => {
  it('calls a custom serialize function', () => {
    const instance = parseAsInstance(Car, jsonString);
    instance.wheel!.size = 30;
    const clone = asInstance(Car, JSON.parse(JSON.stringify(instance)));

    expect(clone.wheel!.size).toBe(60);
    expect(instance.wheel!.size).toBe(30);
  });
});