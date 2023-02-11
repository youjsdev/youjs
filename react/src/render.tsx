import { createElement } from 'react';
import React = require('react');

export const renderComponent = (
  element: {
    __typename: string;
    children?: [];
  },
  knownElements: {
    [key: string]: React.FunctionComponent;
  },
  key?: any,
): any => {
  if (element.__typename in knownElements) {
    return createElement(
      knownElements[element.__typename],
      {
        key,
        ...element,
      },
      element.children &&
        (typeof element.children === 'string'
          ? element.children
          : element.children.map((child: any, key: number) => renderComponent(child, knownElements, key))),
    );
  } else
    return (
      console.warn(
        `The component '${element.__typename}' was not found in the list of known components: [${Object.keys(
          knownElements,
        ).join(', ')}]`,
      ),
      React.createElement(React.Fragment, { key }, null)
    );
};
