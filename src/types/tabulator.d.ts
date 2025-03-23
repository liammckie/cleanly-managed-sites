
// Type definitions for react-tabulator

declare module 'react-tabulator' {
  import React from 'react';

  export interface ReactTabulatorOptions {
    height?: string | number;
    layout?: string;
    columnMinWidth?: number;
    columnVertAlign?: string;
    responsiveLayout?: string;
    responsiveLayoutCollapseStartOpen?: boolean;
    pagination?: string | boolean;
    paginationSize?: number;
    paginationSizeSelector?: number[];
    movableColumns?: boolean;
    resizableRows?: boolean;
    resizableColumns?: boolean;
    initialSort?: Array<{ column: string; dir: string }>;
    groupBy?: string | string[];
    groupStartOpen?: boolean | Function;
    groupHeader?: Function;
    footerElement?: string | Function;
    placeholder?: string;
    [key: string]: any;
  }

  export interface ReactTabulatorProps {
    columns: any[];
    data: any[];
    options?: ReactTabulatorOptions;
    events?: any;
    className?: string;
    ref?: any;
  }

  export class ReactTabulator extends React.Component<ReactTabulatorProps> {
    constructor(props: ReactTabulatorProps);
    ref: any;
    download: (fileType: string, fileName?: string) => void;
    setData: (data: any[]) => void;
    getTable: () => any;
  }
}
