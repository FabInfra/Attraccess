import { Transform } from 'class-transformer';

export const ToBoolean = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    }
  );

  const toClass = (target: unknown, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToBoolean(obj[key]);
      },
      {
        toClassOnly: true,
      }
    )(target, key);
  };

  return function (target: unknown, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const valueToBoolean = (value: unknown) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (['true', 'on', 'yes', '1'].includes((value as string).toLowerCase())) {
    return true;
  }

  if (['false', 'off', 'no', '0'].includes((value as string).toLowerCase())) {
    return false;
  }

  return undefined;
};
