import React from 'react';

const ReactMarkdown = ({ children }: { children: string }) => {
  return <div data-testid="markdown-content">{children}</div>;
};

export default ReactMarkdown;