import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';

type Direction = 'row' | 'column';

interface StackProps {
  children: ReactNode;
  direction?: Direction;
  spacing?: number;
  style?: ViewStyle;
}

// Small Stack helper that injects spacing between children by cloning them
export default function Stack({ children, direction = 'column', spacing = 8, style }: StackProps) {
  const isRow = direction === 'row';

  const items = React.Children.toArray(children).map((child, idx, arr) => {
    const isLast = idx === arr.length - 1;

    // if child is a valid React element, inject style
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<any>;
      const childStyle = element.props?.style ?? {};
      const spacingStyle: ViewStyle = isRow
        ? { marginRight: isLast ? 0 : spacing }
        : { marginBottom: isLast ? 0 : spacing };

      const newStyle = Array.isArray(childStyle) ? [...childStyle, spacingStyle] : [childStyle, spacingStyle];

      // cast to any to avoid TS issues with unknown element props
      return React.cloneElement(element, { style: newStyle } as any);
    }

    return child;
  });

  return <View style={[{ flexDirection: direction }, style]}>{items}</View>;
}
