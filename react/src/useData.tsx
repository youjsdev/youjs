import { createContext, useContext, useState } from 'react';

const DataContext = createContext({});

export const DataProvider = ({ data, children }: any) => {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => {
  return useContext(DataContext);
};

export const useDataPoint = (point: string) => {
  const [state, setState] = useState();
  const [status, setStatus] = useState<'default' | 'Loading...' | 'Success!' | 'An unexpected error occurred.'>(
    'default',
  );

  const data = useData();

  const recurseEnter = (_obj: any, points: string[]): any => {
    if (!_obj) return;
    if (points.length <= 0) return _obj;
    let point: any = points.shift()!;
    try {
      point = JSON.parse(point);
    } catch (error) {
      //   console.error(error);
    }
    const obj =
      typeof point === 'object'
        ? _obj.find((props: any) =>
            Object.keys(point).every((key: string) => Object.hasOwn(props, key) && props[key] === point[key as string]),
          )
        : _obj[point];
    return recurseEnter(obj, points) as any;
  };

  return recurseEnter(data, point.split('.'));
};
