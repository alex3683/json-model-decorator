import { beforeEach, describe, expect, it } from 'vitest';
import { jsonDateDeserializer } from './JsonDateDeserializer';
import { jsonInstanceDeserializer } from './JsonInstanceDeserializer';
import { asInstance, asInstances, jsonProperty, parseAsInstance, parseAsInstances } from './JsonProperty';

class Wheel {
  @jsonProperty()
  public size: number = 22;
}

class Car {
  @jsonProperty({ deserialize: jsonInstanceDeserializer(Wheel) })
  public wheel: Wheel | null = null;

  @jsonProperty({ deserialize: jsonDateDeserializer() })
  public accessor buildDate!: Date;

  public ignored!: string;
}

class PlainCar {
  public wheel!: Wheel;

  public buildDate!: Date;

  public ignored!: string;
}

const jsonString =
  '{"wheel": {"size": 25}, "buildDate": "2023-10-01T15:40:30Z", "ignored": "hello!", "iWasNotHereInTheFirstPlace": true}';

describe('jsonProperty', () => {
  it('throws when used on static properties', () => {
    expect(() => {
      class Test {
        @jsonProperty()
        public static prop = 1;
      }
    }).toThrow('jsonProperty cannot be used with static properties');
  });

  it('throws when used on unsupported kinds', () => {
    expect(() => {
      class Test {
        // @ts-expect-error
        @jsonProperty()
        public method() {}
      }
    }).toThrow('jsonProperty can only be used on field or accessors, but set on kind method');
  });
});

describe('asInstance', () => {

  describe('for model with decorators', () => {
    let instance: any;

    beforeEach(() => {
      const obj = JSON.parse(jsonString);
      instance = asInstance(Car, obj);
    });

    it('can make an instance from parsed JSON', () => {
      expect(instance.constructor).toBe(Car);
      expect(instance.wheel).toBeDefined();
      
      expect(instance.wheel.constructor).toBe(Wheel);
      expect(instance.wheel.size).toBe(25);
      expect(instance.buildDate.constructor).toBe(Date);
      expect(instance.buildDate.getMonth()).toBe(9);
    });

    it('can make an instance from a raw JSON string', () => {
      instance = parseAsInstance(Car, jsonString);

      expect(instance.constructor).toBe(Car);
      expect(instance.wheel).toBeDefined();
      expect(instance.wheel.constructor).toBe(Wheel);
      expect(instance.wheel.size).toBe(25);
      expect(instance.buildDate.constructor).toBe(Date);
      expect(instance.buildDate.getMonth()).toBe(9);
    });

    it('ignores fields that are not decorated', () => {
      expect(instance.ignored).toBeUndefined();
      expect(instance.iWasNotHereInTheFirstPlace).toBeUndefined();
    });
  });

  describe('for a model without decorators', () => {
    let instance: any;

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