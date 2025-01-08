import React from 'react';
import Docs from '../components/Docs';

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Docs />
      </div>
    </div>
  );
}
