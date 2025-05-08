// src/agents/quickbooks-data-agent.ts
import { BaseAgent } from './base-agent';
import { MCP } from '../mcp/types';
import { quickbooksService } from '../services/quickbooks';

export class QuickBooksDataAgent extends BaseAgent {
  id = "quickbooks-data-agent";
  name = "QuickBooks Financial Data Agent";
  description = "Retrieves and analyzes financial data from QuickBooks";
  capabilities = ["financial_data_retrieval", "invoice_analysis", "expense_analysis"];
  consumesContext = ["financial_query", "date_range"];
  producesContext = ["financial_data", "invoices", "expenses", "financial_analysis"];

  private async getHighValueSales(context: MCP.ReadonlyContextStore) {
    const lastYear = new Date().getFullYear() - 1;
    const startDate = `${lastYear}-01-01`;
    const endDate = `${lastYear}-12-31`;
    
    return await quickbooksService.runQuery(
      `SELECT * FROM Invoice 
       WHERE TxnDate >= '${startDate}' 
       AND TxnDate <= '${endDate}' 
       AND TotalAmt > 100 
       ORDER BY TotalAmt DESC`
    );
  }

  async process(context: MCP.ReadonlyContextStore): Promise<MCP.ContextOperation[]> {
    const financialQuery = context.get<string>("financial_query");
    
    if (!financialQuery) {
      this.log('debug', 'No financial query found, skipping');
      return [];
    }
    
    const query = financialQuery.value.toLowerCase();
    const operations: MCP.ContextOperation[] = [];
    
    try {
      if (query.includes('sales') && query.includes('hundred') && query.includes('last year')) {
        const highValueSales = await this.getHighValueSales(context);
        operations.push(BaseAgent.createAddOperation(
          'high_value_sales',
          highValueSales,
          0.95,
          "Retrieved from QuickBooks",
          ["financial_query"]
        ));
        
        // Add summary analysis
        const analysis = {
          totalSales: highValueSales.length,
          totalAmount: highValueSales.reduce((sum, sale) => sum + parseFloat(sale.TotalAmt || 0), 0).toFixed(2),
          averageAmount: (highValueSales.reduce((sum, sale) => sum + parseFloat(sale.TotalAmt || 0), 0) / highValueSales.length || 0).toFixed(2)
        };
        
        operations.push(BaseAgent.createAddOperation(
          'financial_analysis',
          analysis,
          0.85,
          "Generated from QuickBooks high-value sales analysis",
          ["high_value_sales"]
        ));
      }
      // Determine what type of financial data is being requested
      if (query.includes('invoice') || query.includes('sales')) {
        const invoices = await this.getInvoiceData(context);
        operations.push(BaseAgent.createAddOperation(
          'invoices',
          invoices,
          0.95,
          "Retrieved from QuickBooks",
          ["financial_query"]
        ));
        
        // Add summary analysis
        const analysis = this.analyzeInvoices(invoices);
        operations.push(BaseAgent.createAddOperation(
          'financial_analysis',
          analysis,
          0.85,
          "Generated from QuickBooks invoice data analysis",
          ["invoices"]
        ));
      } 
      else if (query.includes('expense') || query.includes('spending')) {
        const expenses = await this.getExpenseData(context);
        operations.push(BaseAgent.createAddOperation(
          'expenses',
          expenses,
          0.95,
          "Retrieved from QuickBooks",
          ["financial_query"]
        ));
        
        // Add summary analysis
        const analysis = this.analyzeExpenses(expenses);
        operations.push(BaseAgent.createAddOperation(
          'financial_analysis',
          analysis,
          0.85,
          "Generated from QuickBooks expense data analysis",
          ["expenses"]
        ));
      }
      else {
        // Generic financial data
        const financialData = await this.getFinancialOverview(context);
        operations.push(BaseAgent.createAddOperation(
          'financial_data',
          financialData,
          0.90,
          "Retrieved from QuickBooks",
          ["financial_query"]
        ));
      }
      
      this.log('info', 'Successfully processed QuickBooks financial data');
    } catch (error) {
      this.log('error', 'Error processing QuickBooks data', error);
    }
    
    return operations;
  }
  
  // Helper methods for QuickBooks data retrieval
  private async getInvoiceData(context: MCP.ReadonlyContextStore) {
    const dateRange = context.get<{ start: string, end: string }>("date_range");
    
    // Default to last 30 days if no date range specified
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = dateRange?.value?.start || 
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return await quickbooksService.runQuery(
      `SELECT * FROM Invoice WHERE TxnDate >= '${startDate}' AND TxnDate <= '${endDate}' ORDER BY TxnDate DESC`
    );
  }
  
  private async getExpenseData(context: MCP.ReadonlyContextStore) {
    const dateRange = context.get<{ start: string, end: string }>("date_range");
    
    // Default to last 30 days if no date range specified
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = dateRange?.value?.start || 
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return await quickbooksService.runQuery(
      `SELECT * FROM Purchase WHERE TxnDate >= '${startDate}' AND TxnDate <= '${endDate}' ORDER BY TxnDate DESC`
    );
  }
  
  private async getFinancialOverview(context: MCP.ReadonlyContextStore) {
    // Get a general financial overview
    const customers = await quickbooksService.runQuery("SELECT COUNT(*) FROM Customer");
    const invoices = await quickbooksService.runQuery("SELECT COUNT(*) FROM Invoice");
    const expenses = await quickbooksService.runQuery("SELECT COUNT(*) FROM Purchase");
    
    return {
      summary: {
        customerCount: customers[0]?.COUNT || 0,
        invoiceCount: invoices[0]?.COUNT || 0,
        expenseCount: expenses[0]?.COUNT || 0,
      },
      timestamp: new Date().toISOString()
    };
  }
  
  // Analysis methods
  private analyzeInvoices(invoices: any[]) {
    // Simple analysis example - could be much more sophisticated
    const totalAmount = invoices.reduce((sum, inv) => sum + parseFloat(inv.TotalAmt || 0), 0);
    const averageAmount = totalAmount / (invoices.length || 1);
    const paidInvoices = invoices.filter(inv => inv.Balance === 0).length;
    const unpaidInvoices = invoices.length - paidInvoices;
    
    return {
      totalAmount: totalAmount.toFixed(2),
      averageAmount: averageAmount.toFixed(2),
      invoiceCount: invoices.length,
      paidCount: paidInvoices,
      unpaidCount: unpaidInvoices,
      paidPercentage: ((paidInvoices / (invoices.length || 1)) * 100).toFixed(1) + '%'
    };
  }
  
  private analyzeExpenses(expenses: any[]) {
    // Simple analysis example - could be more sophisticated with categorization
    const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.TotalAmt || 0), 0);
    const averageAmount = totalAmount / (expenses.length || 1);
    
    // Group by month
    const byMonth: Record<string, number> = {};
    expenses.forEach(exp => {
      const month = exp.TxnDate.substring(0, 7); // YYYY-MM format
      byMonth[month] = (byMonth[month] || 0) + parseFloat(exp.TotalAmt || 0);
    });
    
    return {
      totalAmount: totalAmount.toFixed(2),
      averageAmount: averageAmount.toFixed(2),
      expenseCount: expenses.length,
      byMonth
    };
  }
}