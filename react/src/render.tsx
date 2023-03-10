import { createElement, Fragment, FunctionComponent } from 'react';

export const renderComponent = (
  element: {
    __typename: string;
    children?: [];
  },
  knownElements: {
    [key: string]: FunctionComponent<{
      theme: {
        name: string;
        scheme: string;
      };
    }>;
  },
  theme: {
    name: string;
    scheme: string;
  },
  key?: any,
): any => {
  if (element.__typename in knownElements) {
    return createElement(
      knownElements[element.__typename],
      {
        theme,
        key,
        ...element,
      },
      element.children &&
        (typeof element.children === 'string'
          ? element.children
          : element.children.map((child: any, key: number) => renderComponent(child, knownElements, theme, key))),
    );
  } else
    return (
      console.warn(
        `The component '${element.__typename}' was not found in the list of known components: [${Object.keys(
          knownElements,
        ).join(', ')}]`,
      ),
      createElement(Fragment, { key }, null)
    );
};
