import { type PropsWithChildren } from 'react';

const NoProse = ({ children }: PropsWithChildren) => {
  return <div className="not-prose">{children}</div>;
};

export { NoProse };
