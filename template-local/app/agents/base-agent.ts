import { MCP } from '../mcp/types';

export abstract class BaseAgent {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract capabilities: string[];
  abstract consumesContext: string[];
  abstract producesContext: string[];

  public log(level: 'debug' | 'info' | 'error', message: string, error?: any) {
    console.log(`[${level}] ${message}`, error || '');
  }

  static createAddOperation(
    key: string,
    value: any,
    confidence: number,
    source: string,
    dependencies: string[]
  ): MCP.ContextOperation {
    return {
      type: 'add',
      key,
      value,
      confidence,
      source,
      dependencies
    };
  }

  abstract process(context: MCP.ReadonlyContextStore): Promise<MCP.ContextOperation[]>;
} 