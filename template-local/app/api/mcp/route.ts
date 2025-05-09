import { QuickBooksDataAgent } from '../../../agents/quickbooks-data-agent';
import { MCP } from '../../../mcp/types';

// Initialize agents
const agents = [
  new QuickBooksDataAgent()
];

export async function POST(req: Request) {
  try {
    const { context } = await req.json();
    
    // Create a context store from the incoming context
    const contextStore: MCP.ContextStore = {
      get<T>(key: string) {
        const value = context[key];
        return value ? { value: value as T } : undefined;
      }
    };
    
    // Process context through all agents
    const operations: MCP.ContextOperation[] = [];
    
    for (const agent of agents) {
      console.log(`Processing with agent: ${agent.name}`);
      try {
        const agentOperations = await agent.process(contextStore);
        operations.push(...agentOperations);
      } catch (error) {
        console.error(`Error processing with agent ${agent.name}:`, error);
      }
    }
    
    // Apply operations to create new context
    const newContext = { ...context };
    
    for (const op of operations) {
      if (op.type === 'add') {
        newContext[op.key] = op.value;
      }
    }
    
    return new Response(JSON.stringify({
      context: newContext,
      operations
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing MCP request:', error);
    return new Response(JSON.stringify({
      error: 'Error processing request',
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// GET endpoint to list available agents and their capabilities
export async function GET() {
  const agentInfo = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    capabilities: agent.capabilities,
    consumesContext: agent.consumesContext,
    producesContext: agent.producesContext
  }));
  
  return new Response(JSON.stringify({
    agents: agentInfo
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}