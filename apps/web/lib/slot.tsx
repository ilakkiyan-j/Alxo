'use client';

import * as React from 'react';

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

/**
 * Minimal Slot — renders its child while merging the consumer's props and
 * className onto it. Used to compose buttons/focusables (e.g. <Button asChild>).
 */
export function Slot({ children, className, ...props }: SlotProps) {
  const childrenArray = React.Children.toArray(children);
  const validChild = childrenArray.find(React.isValidElement) as React.ReactElement<SlotProps> | undefined;

  if (validChild) {
    return React.cloneElement(validChild, {
      ...props,
      className: [className, validChild.props.className].filter(Boolean).join(' '),
    });
  }
  return <>{children}</>;
}