export namespace MCP {
  export interface ContextStore {
    get<T>(key: string): { value: T } | undefined;
  }

  export type ReadonlyContextStore = Readonly<ContextStore>;

  export interface ContextOperation {
    type: 'add';
    key: string;
    value: any;
    confidence: number;
    source: string;
    dependencies: string[];
  }
} 