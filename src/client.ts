import {
  BankAccount,
  BankEstablishment,
  BillingSubscription,
  BillingSubscriptionInvoiceLineSection,
  BillingSubscriptionInvoiceLine,
  CategoryGroup,
  Category,
  Customer,
  CompanyCustomer,
  IndividualCustomer,
  CustomerContact,
  Supplier,
  Journal,
  LedgerAccount,
  LedgerEntry,
  LedgerEntryLine,
  CustomerInvoice,
  CustomerInvoiceLine,
  CustomerInvoiceLineSection,
  CustomerInvoiceAppendix,
  CustomerInvoicePayment,
  CustomerInvoiceMatchedTransaction,
  CustomerInvoiceCustomHeaderField,
  SupplierInvoice,
  SupplierInvoiceLine,
  Quote,
  QuoteAppendix,
  QuoteInvoiceLine,
  QuoteInvoiceLineSection,
  CommercialDocument,
  CommercialDocumentAppendix,
  CommercialDocumentInvoiceLine,
  CommercialDocumentInvoiceLineSection,
  Transaction,
  Product,
  FiscalYear,
  TrialBalance,
  WebhookSubscription,
  SepaMandate,
  GocardlessMandate,
  GocardlessMailRequest,
  GocardlessCancellation,
  GocardlessAssociation,
  FileAttachment,
  ExportTask,
  ChangelogEvent,
  EInvoiceImport,
  PurchaseRequest,
  ProAccountMandateRequest,
  ProAccountMandateMigration,
  ProAccountMandate,
  MeUser,
  CustomerInvoiceTemplate,
  CategoryAssignment,
  PaginatedResponse,
} from './types.js';

export interface PennyLaneClientConfig {
  apiKey: string;
  baseUrl?: string;
}

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

export class PennyLaneClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: PennyLaneClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://app.pennylane.com';
  }

  private async request<T>(
    method: string,
    path: string,
    query?: QueryParams,
    body?: unknown,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET' && method !== 'DELETE') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PennyLane API error ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json() as Promise<T>;
    }

    return response.text() as unknown as Promise<T>;
  }

  private async requestMultipart<T>(
    method: string,
    path: string,
    query?: QueryParams,
    formData?: FormData,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
      body: formData,
    };

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PennyLane API error ${response.status}: ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  // ==================== Bank Accounts ====================

  async listBankAccounts(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<BankAccount>> {
    return this.request('GET', '/api/external/v2/bank_accounts', query);
  }

  async getBankAccount(id: number): Promise<BankAccount> {
    return this.request('GET', `/api/external/v2/bank_accounts/${id}`);
  }

  async createBankAccount(body: {
    name: string;
    last_four?: string;
    bank_name?: string;
    iban?: string;
    bic?: string;
    currency?: string;
  }): Promise<BankAccount> {
    return this.request('POST', '/api/external/v2/bank_accounts', undefined, body);
  }

  // ==================== Bank Establishments ====================

  async listBankEstablishments(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<BankEstablishment>> {
    return this.request('GET', '/api/external/v2/bank_establishments', query);
  }

  // ==================== Billing Subscriptions ====================

  async listBillingSubscriptions(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<BillingSubscription>> {
    return this.request('GET', '/api/external/v2/billing_subscriptions', query);
  }

  async getBillingSubscription(id: number): Promise<BillingSubscription> {
    return this.request('GET', `/api/external/v2/billing_subscriptions/${id}`);
  }

  async createBillingSubscription(body: {
    name: string;
    customer_id: number;
  }): Promise<BillingSubscription> {
    return this.request('POST', '/api/external/v2/billing_subscriptions', undefined, body);
  }

  async updateBillingSubscription(id: number, body: {
    name?: string;
    customer_id?: number;
    next_invoice_date?: string;
  }): Promise<BillingSubscription> {
    return this.request('PUT', `/api/external/v2/billing_subscriptions/${id}`, undefined, body);
  }

  async listBillingSubscriptionInvoiceLineSections(billingSubscriptionId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<BillingSubscriptionInvoiceLineSection>> {
    return this.request('GET', `/api/external/v2/billing_subscriptions/${billingSubscriptionId}/invoice_line_sections`, query);
  }

  async listBillingSubscriptionInvoiceLines(billingSubscriptionId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<BillingSubscriptionInvoiceLine>> {
    return this.request('GET', `/api/external/v2/billing_subscriptions/${billingSubscriptionId}/invoice_lines`, query);
  }

  // ==================== Categories ====================

  async listCategories(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<Category>> {
    return this.request('GET', '/api/external/v2/categories', query);
  }

  async getCategory(id: number): Promise<Category> {
    return this.request('GET', `/api/external/v2/categories/${id}`);
  }

  async createCategory(body: {
    name: string;
    color?: string;
    category_group_id?: number;
  }): Promise<Category> {
    return this.request('POST', '/api/external/v2/categories', undefined, body);
  }

  async updateCategory(id: number, body: {
    name?: string;
    color?: string;
    category_group_id?: number;
  }): Promise<Category> {
    return this.request('PUT', `/api/external/v2/categories/${id}`, undefined, body);
  }

  // ==================== Category Groups ====================

  async listCategoryGroups(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<CategoryGroup>> {
    return this.request('GET', '/api/external/v2/category_groups', query);
  }

  async getCategoryGroup(id: number): Promise<CategoryGroup> {
    return this.request('GET', `/api/external/v2/category_groups/${id}`);
  }

  async listCategoryGroupCategories(categoryGroupId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<Category>> {
    return this.request('GET', `/api/external/v2/category_groups/${categoryGroupId}/categories`, query);
  }

  // ==================== Customers ====================

  async listCustomers(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<Customer>> {
    return this.request('GET', '/api/external/v2/customers', query);
  }

  async getCustomer(id: number): Promise<Customer> {
    return this.request('GET', `/api/external/v2/customers/${id}`);
  }

  async listCustomerCategories(customerId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<Category>> {
    return this.request('GET', `/api/external/v2/customers/${customerId}/categories`, query);
  }

  async updateCustomerCategories(customerId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]> {
    return this.request('PUT', `/api/external/v2/customers/${customerId}/categories`, undefined, body);
  }

  async listCustomerContacts(customerId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<CustomerContact>> {
    return this.request('GET', `/api/external/v2/customers/${customerId}/contacts`, query);
  }

  // ==================== Company Customers ====================

  async getCompanyCustomer(id: number): Promise<CompanyCustomer> {
    return this.request('GET', `/api/external/v2/company_customers/${id}`);
  }

  async createCompanyCustomer(body: {
    name: string;
    email?: string;
    phone?: string;
    vat_number?: string;
    external_reference?: string;
    postal_address?: {
      address: string;
      postal_code: string;
      city: string;
      country_alpha2: string;
    };
  }): Promise<CompanyCustomer> {
    return this.request('POST', '/api/external/v2/company_customers', undefined, body);
  }

  async updateCompanyCustomer(id: number, body: {
    name?: string;
    email?: string;
    phone?: string;
    vat_number?: string;
    external_reference?: string;
    postal_address?: {
      address: string;
      postal_code: string;
      city: string;
      country_alpha2: string;
    };
  }): Promise<CompanyCustomer> {
    return this.request('PUT', `/api/external/v2/company_customers/${id}`, undefined, body);
  }

  // ==================== Individual Customers ====================

  async getIndividualCustomer(id: number): Promise<IndividualCustomer> {
    return this.request('GET', `/api/external/v2/individual_customers/${id}`);
  }

  async createIndividualCustomer(body: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    external_reference?: string;
  }): Promise<IndividualCustomer> {
    return this.request('POST', '/api/external/v2/individual_customers', undefined, body);
  }

  async updateIndividualCustomer(id: number, body: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    external_reference?: string;
  }): Promise<IndividualCustomer> {
    return this.request('PUT', `/api/external/v2/individual_customers/${id}`, undefined, body);
  }

  // ==================== Suppliers ====================

  async listSuppliers(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<Supplier>> {
    return this.request('GET', '/api/external/v2/suppliers', query);
  }

  async getSupplier(id: number): Promise<Supplier> {
    return this.request('GET', `/api/external/v2/suppliers/${id}`);
  }

  async createSupplier(body: {
    name: string;
    establishment_no?: string;
    reg_no?: string;
    vat_number?: string;
    emails?: string[];
    iban?: string;
    postal_address?: {
      address: string;
      postal_code: string;
      city: string;
      country_alpha2: string;
    };
    supplier_payment_method?: string;
    supplier_due_date_delay?: number;
    supplier_due_date_rule?: string;
    external_reference?: string;
  }): Promise<Supplier> {
    return this.request('POST', '/api/external/v2/suppliers', undefined, body);
  }

  async updateSupplier(id: number, body: {
    name?: string;
    establishment_no?: string;
    reg_no?: string;
    vat_number?: string;
    emails?: string[];
    iban?: string;
    postal_address?: {
      address: string;
      postal_code: string;
      city: string;
      country_alpha2: string;
    };
    supplier_payment_method?: string;
    supplier_due_date_delay?: number;
    supplier_due_date_rule?: string;
    external_reference?: string;
  }): Promise<Supplier> {
    return this.request('PUT', `/api/external/v2/suppliers/${id}`, undefined, body);
  }

  async listSupplierCategories(supplierId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<Category>> {
    return this.request('GET', `/api/external/v2/suppliers/${supplierId}/categories`, query);
  }

  async updateSupplierCategories(supplierId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]> {
    return this.request('PUT', `/api/external/v2/suppliers/${supplierId}/categories`, undefined, body);
  }

  // ==================== Journals ====================

  async listJournals(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<Journal>> {
    return this.request('GET', '/api/external/v2/journals', query);
  }

  async getJournal(id: number): Promise<Journal> {
    return this.request('GET', `/api/external/v2/journals/${id}`);
  }

  async createJournal(body: {
    name: string;
    code: string;
    type: string;
  }): Promise<Journal> {
    return this.request('POST', '/api/external/v2/journals', undefined, body);
  }

  // ==================== Ledger Accounts ====================

  async listLedgerAccounts(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<LedgerAccount>> {
    return this.request('GET', '/api/external/v2/ledger_accounts', query);
  }

  async getLedgerAccount(id: number): Promise<LedgerAccount> {
    return this.request('GET', `/api/external/v2/ledger_accounts/${id}`);
  }

  async createLedgerAccount(body: {
    number: string;
    name: string;
    code?: string;
  }): Promise<LedgerAccount> {
    return this.request('POST', '/api/external/v2/ledger_accounts', undefined, body);
  }

  async updateLedgerAccount(id: number, body: {
    number?: string;
    name?: string;
    code?: string;
  }): Promise<LedgerAccount> {
    return this.request('PUT', `/api/external/v2/ledger_accounts/${id}`, undefined, body);
  }

  // ==================== Ledger Entries ====================

  async listLedgerEntries(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<LedgerEntry>> {
    return this.request('GET', '/api/external/v2/ledger_entries', query);
  }

  async getLedgerEntry(id: number): Promise<LedgerEntry> {
    return this.request('GET', `/api/external/v2/ledger_entries/${id}`);
  }

  async createLedgerEntry(body: {
    journal_id: number;
    date: string;
    reference: string;
    label?: string;
  }): Promise<LedgerEntry> {
    return this.request('POST', '/api/external/v2/ledger_entries', undefined, body);
  }

  // ==================== Ledger Entry Lines ====================

  async listLedgerEntryLines(ledgerEntryId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<LedgerEntryLine>> {
    return this.request('GET', `/api/external/v2/ledger_entries/${ledgerEntryId}/ledger_entry_lines`, query);
  }

  async getLedgerEntryLine(id: number): Promise<LedgerEntryLine> {
    return this.request('GET', `/api/external/v2/ledger_entry_lines/${id}`);
  }

  async createLedgerEntryLine(body: {
    ledger_entry_id: number;
    label?: string;
    amount: string;
    currency: string;
    currency_amount: string;
    ledger_account_id: number;
  }): Promise<LedgerEntryLine> {
    return this.request('POST', '/api/external/v2/ledger_entry_lines', undefined, body);
  }

  async getLedgerEntryLineLettering(ledgerEntryLineId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<LedgerEntryLine>> {
    return this.request('GET', `/api/external/v2/ledger_entry_lines/${ledgerEntryLineId}/lettered_ledger_entry_lines`, query);
  }

  async letterLedgerEntryLines(body: {
    ledger_entry_line_ids: number[];
  }): Promise<LedgerEntryLine[]> {
    return this.request('POST', '/api/external/v2/ledger_entry_lines/lettering', undefined, body);
  }

  async getLedgerEntryLineCategories(ledgerEntryLineId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<Category>> {
    return this.request('GET', `/api/external/v2/ledger_entry_lines/${ledgerEntryLineId}/categories`, query);
  }

  async updateLedgerEntryLineCategories(ledgerEntryLineId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]> {
    return this.request('PUT', `/api/external/v2/ledger_entry_lines/${ledgerEntryLineId}/categories`, undefined, body);
  }

  // ==================== Ledger Attachments ====================

  async uploadLedgerAttachment(body: {
    file_attachment_id: number;
    ledger_entry_id: number;
  }): Promise<FileAttachment> {
    return this.request('POST', '/api/external/v2/ledger_attachments', undefined, body);
  }

  // ==================== Customer Invoices ====================

  async listCustomerInvoices(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<CustomerInvoice>> {
    return this.request('GET', '/api/external/v2/customer_invoices', query);
  }

  async getCustomerInvoice(id: number): Promise<CustomerInvoice> {
    return this.request('GET', `/api/external/v2/customer_invoices/${id}`);
  }

  async createCustomerInvoice(body: {
    customer_id: number;
    date: string;
    deadline?: string;
    currency?: string;
    external_reference?: string;
    label?: string;
    invoice_lines: Array<{
      label: string;
      description?: string;
      quantity?: number;
      unit_amount?: string;
      currency_amount: string;
      currency_tax: string;
      vat_rate: string;
      ledger_account_id: number;
    }>;
  }): Promise<CustomerInvoice> {
    return this.request('POST', '/api/external/v2/customer_invoices', undefined, body);
  }

  async updateCustomerInvoice(id: number, body: {
    customer_id?: number;
    date?: string;
    deadline?: string;
    currency?: string;
    external_reference?: string;
    label?: string;
    invoice_lines?: {
      create?: Array<{
        label: string;
        description?: string;
        quantity?: number;
        unit_amount?: string;
        currency_amount: string;
        currency_tax: string;
        vat_rate: string;
        ledger_account_id: number;
      }>;
      update?: Array<{
        id: number;
        label?: string;
        description?: string;
        quantity?: number;
        unit_amount?: string;
        currency_amount?: string;
        currency_tax?: string;
        vat_rate?: string;
        ledger_account_id?: number;
      }>;
      delete?: Array<{ id: number }>;
    };
  }): Promise<CustomerInvoice> {
    return this.request('PUT', `/api/external/v2/customer_invoices/${id}`, undefined, body);
  }

  async deleteCustomerInvoice(id: number): Promise<void> {
    await this.request('DELETE', `/api/external/v2/customer_invoices/${id}`);
  }

  async finalizeCustomerInvoice(id: number): Promise<CustomerInvoice> {
    return this.request('PUT', `/api/external/v2/customer_invoices/${id}/finalize`);
  }

  async markAsPaid(id: number): Promise<CustomerInvoice> {
    return this.request('PUT', `/api/external/v2/customer_invoices/${id}/mark_as_paid`);
  }

  async sendByEmail(id: number, body?: { recipients?: string[] }): Promise<void> {
    await this.request('POST', `/api/external/v2/customer_invoices/${id}/send_by_email`, undefined, body);
  }

  async sendToPa(id: number): Promise<void> {
    await this.request('POST', `/api/external/v2/customer_invoices/${id}/send_to_pa`);
  }

  async importCustomerInvoice(body: {
    file_attachment_id: number;
    supplier_id?: number;
    import_as_incomplete?: boolean;
    date?: string;
    deadline?: string;
    invoice_number?: string;
    currency?: string;
    currency_amount_before_tax?: string;
    currency_amount?: string;
    currency_tax?: string;
    label?: string;
    transaction_reference?: {
      banking_provider: string;
      provider_field_name: string;
      provider_field_value: string;
    };
    invoice_lines?: Array<{
      label: string;
      description?: string;
      currency_amount?: string;
      currency_tax?: string;
      vat_rate: string;
      ledger_account_id?: number;
    }>;
    external_reference?: string;
  }): Promise<CustomerInvoice> {
    return this.request('POST', '/api/external/v2/customer_invoices/import', undefined, body);
  }

  async importEInvoice(body: {
    file: Buffer;
    invoice_options?: {
      supplier_id?: number;
      invoice_lines?: Array<{
        e_invoice_line_id: string;
        ledger_account_id?: number;
      }>;
    };
  }): Promise<CustomerInvoice> {
    const formData = new FormData();
    formData.append('file', new Blob([body.file as any]), 'invoice.xml');
    if (body.invoice_options) {
      formData.append('invoice_options', JSON.stringify(body.invoice_options));
    }
    return this.requestMultipart('POST', '/api/external/v2/customer_invoices/e_invoices/imports', undefined, formData);
  }

  async createFromQuote(quoteId: number): Promise<CustomerInvoice> {
    return this.request('POST', '/api/external/v2/customer_invoices/create_from_quote', { quote_id: quoteId });
  }

  async linkCreditNote(id: number, body: {
    credit_note_id: number;
  }): Promise<CustomerInvoice> {
    return this.request('POST', `/api/external/v2/customer_invoices/${id}/link_credit_note`, undefined, body);
  }

  async updateImported(id: number, body: {
    status: string;
  }): Promise<CustomerInvoice> {
    return this.request('PUT', `/api/external/v2/customer_invoices/${id}/update_imported`, undefined, body);
  }

  async listCustomerInvoiceLines(customerInvoiceId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<CustomerInvoiceLine>> {
    return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/invoice_lines`, query);
  }

  async listCustomerInvoiceLineSections(customerInvoiceId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<CustomerInvoiceLineSection>> {
    return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/invoice_line_sections`, query);
  }

  async listCustomerInvoiceAppendices(customerInvoiceId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<CustomerInvoiceAppendix>> {
    return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/appendices`, query);
  }

  async uploadCustomerInvoiceAppendix(customerInvoiceId: number, file: Buffer): Promise<CustomerInvoiceAppendix> {
    const formData = new FormData();
    formData.append('file', new Blob([file as any]), 'attachment.pdf');
    return this.requestMultipart('POST', `/api/external/v2/customer_invoices/${customerInvoiceId}/appendices`, undefined, formData);
  }

  async listCustomerInvoiceCategories(customerInvoiceId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<Category>> {
    return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/categories`, query);
  }

  async updateCustomerInvoiceCategories(customerInvoiceId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]> {
    return this.request('PUT', `/api/external/v2/customer_invoices/${customerInvoiceId}/categories`, undefined, body);
  }

  async listCustomerInvoiceMatchedTransactions(customerInvoiceId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<CustomerInvoiceMatchedTransaction>> {
    return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/matched_transactions`, query);
  }

  async matchCustomerInvoiceTransaction(customerInvoiceId: number, body: {
    transaction_id: number;
  }): Promise<CustomerInvoiceMatchedTransaction> {
    return this.request('POST', `/api/external/v2/customer_invoices/${customerInvoiceId}/matched_transactions`, undefined, body);
  }

  async unmatchCustomerInvoiceTransaction(customerInvoiceId: number, transactionId: number): Promise<void> {
    await this.request('DELETE', `/api/external/v2/customer_invoices/${customerInvoiceId}/matched_transactions/${transactionId}`);
  }

  async listCustomerInvoicePayments(customerInvoiceId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<CustomerInvoicePayment>> {
    return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/payments`, query);
  }

  async listCustomerInvoiceCustomHeaderFields(customerInvoiceId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<CustomerInvoiceCustomHeaderField>> {
    return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/custom_header_fields`, query);
  }

  // ==================== Supplier Invoices ====================

  async listSupplierInvoices(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<SupplierInvoice>> {
    return this.request('GET', '/api/external/v2/supplier_invoices', query);
  }

  async getSupplierInvoice(id: number): Promise<SupplierInvoice> {
    return this.request('GET', `/api/external/v2/supplier_invoices/${id}`);
  }

  async updateSupplierInvoice(id: number, body: {
    supplier_id?: number;
    date?: string;
    deadline?: string;
    invoice_number?: string;
    label?: string;
    currency?: string;
    currency_amount_before_tax?: string;
    currency_amount?: string;
    currency_tax?: string;
    amount?: string;
    tax?: string;
    transaction_reference?: {
      banking_provider: string;
      provider_field_name: string;
      provider_field_value: string;
    };
    invoice_lines?: {
      create?: Array<{
        label: string;
        description?: string;
        currency_amount: string;
        currency_tax: string;
        vat_rate: string;
        ledger_account_id?: number;
      }>;
      update?: Array<{
        id: number;
        label?: string;
        description?: string;
        currency_amount?: string;
        currency_tax?: string;
        vat_rate?: string;
        ledger_account_id?: number;
      }>;
      delete?: Array<{ id: number }>;
    };
    external_reference?: string;
  }): Promise<SupplierInvoice> {
    return this.request('PUT', `/api/external/v2/supplier_invoices/${id}`, undefined, body);
  }

  async listSupplierInvoiceLines(supplierInvoiceId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<SupplierInvoiceLine>> {
    return this.request('GET', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/invoice_lines`, query);
  }

  async listSupplierInvoiceCategories(supplierInvoiceId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<Category>> {
    return this.request('GET', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/categories`, query);
  }

  async updateSupplierInvoiceCategories(supplierInvoiceId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]> {
    return this.request('PUT', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/categories`, undefined, body);
  }

  async listSupplierInvoicePayments(supplierInvoiceId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<CustomerInvoicePayment>> {
    return this.request('GET', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/payments`, query);
  }

  async updateSupplierInvoicePaymentStatus(supplierInvoiceId: number, body: {
    payment_status: 'paid' | 'to_be_paid';
  }): Promise<void> {
    await this.request('PUT', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/payment_status`, undefined, body);
  }

  async listSupplierInvoiceMatchedTransactions(supplierInvoiceId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<CustomerInvoiceMatchedTransaction>> {
    return this.request('GET', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/matched_transactions`, query);
  }

  async matchSupplierInvoiceTransaction(supplierInvoiceId: number, body: {
    transaction_id: number;
  }): Promise<CustomerInvoiceMatchedTransaction> {
    return this.request('POST', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/matched_transactions`, undefined, body);
  }

  async unmatchSupplierInvoiceTransaction(supplierInvoiceId: number, transactionId: number): Promise<void> {
    await this.request('DELETE', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/matched_transactions/${transactionId}`);
  }

  async linkSupplierInvoicePurchaseRequest(supplierInvoiceId: number, body: {
    purchase_request_id: number;
  }): Promise<PurchaseRequest> {
    return this.request('POST', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/linked_purchase_requests`, undefined, body);
  }

  async updateSupplierInvoiceEInvoiceStatus(supplierInvoiceId: number, body: {
    status: 'disputed' | 'refused' | 'approved';
    reason?: string;
  }): Promise<void> {
    await this.request('PUT', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/e_invoice_status`, undefined, body);
  }

  async validateSupplierInvoiceAccounting(id: number): Promise<SupplierInvoice> {
    return this.request('PUT', `/api/external/v2/supplier_invoices/${id}/validate_accounting`);
  }

  async importSupplierInvoice(body: {
    file_attachment_id: number;
    supplier_id: number;
    date: string;
    deadline: string;
    currency_amount_before_tax: string;
    currency_amount: string;
    currency_tax: string;
    invoice_lines: Array<{
      label: string;
      currency_amount?: string;
      currency_tax?: string;
      vat_rate: string;
      ledger_account_id?: number;
    }>;
    import_as_incomplete?: boolean;
    invoice_number?: string;
    currency?: string;
    external_reference?: string;
  }): Promise<SupplierInvoice> {
    return this.request('POST', '/api/external/v2/supplier_invoices/import', undefined, body);
  }

  async importSupplierEInvoice(body: {
    file: Buffer;
    invoice_options?: {
      supplier_id?: number;
      invoice_lines?: Array<{
        e_invoice_line_id: string;
        ledger_account_id?: number;
      }>;
    };
  }): Promise<SupplierInvoice> {
    const formData = new FormData();
    formData.append('file', new Blob([body.file as any]), 'invoice.xml');
    if (body.invoice_options) {
      formData.append('invoice_options', JSON.stringify(body.invoice_options));
    }
    return this.requestMultipart('POST', '/api/external/v2/supplier_invoices/e_invoices/imports', undefined, formData);
  }

  // ==================== Quotes ====================

  async listQuotes(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<Quote>> {
    return this.request('GET', '/api/external/v2/quotes', query);
  }

  async getQuote(id: number): Promise<Quote> {
    return this.request('GET', `/api/external/v2/quotes/${id}`);
  }

  async sendQuoteByEmail(id: number, body?: { recipients?: string[] }): Promise<void> {
    await this.request('POST', `/api/external/v2/quotes/${id}/send_by_email`, undefined, body);
  }

  async updateQuoteStatus(id: number, body: {
    status: 'pending' | 'accepted' | 'denied' | 'invoiced' | 'expired';
  }): Promise<Quote> {
    return this.request('PUT', `/api/external/v2/quotes/${id}/update_status`, undefined, body);
  }

  async listQuoteAppendices(quoteId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<QuoteAppendix>> {
    return this.request('GET', `/api/external/v2/quotes/${quoteId}/appendices`, query);
  }

  async uploadQuoteAppendix(quoteId: number, file: Buffer): Promise<QuoteAppendix> {
    const formData = new FormData();
    formData.append('file', new Blob([file as any]), 'attachment.pdf');
    return this.requestMultipart('POST', `/api/external/v2/quotes/${quoteId}/appendices`, undefined, formData);
  }

  async listQuoteInvoiceLines(quoteId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<QuoteInvoiceLine>> {
    return this.request('GET', `/api/external/v2/quotes/${quoteId}/invoice_lines`, query);
  }

  async listQuoteInvoiceLineSections(quoteId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<QuoteInvoiceLineSection>> {
    return this.request('GET', `/api/external/v2/quotes/${quoteId}/invoice_line_sections`, query);
  }

  // ==================== Commercial Documents ====================

  async listCommercialDocuments(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<CommercialDocument>> {
    return this.request('GET', '/api/external/v2/commercial_documents', query);
  }

  async getCommercialDocument(id: number): Promise<CommercialDocument> {
    return this.request('GET', `/api/external/v2/commercial_documents/${id}`);
  }

  async listCommercialDocumentAppendices(commercialDocumentId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<CommercialDocumentAppendix>> {
    return this.request('GET', `/api/external/v2/commercial_documents/${commercialDocumentId}/appendices`, query);
  }

  async uploadCommercialDocumentAppendix(commercialDocumentId: number, file: Buffer): Promise<CommercialDocumentAppendix> {
    const formData = new FormData();
    formData.append('file', new Blob([file as any]), 'attachment.pdf');
    return this.requestMultipart('POST', `/api/external/v2/commercial_documents/${commercialDocumentId}/appendices`, undefined, formData);
  }

  async listCommercialDocumentInvoiceLines(commercialDocumentId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<CommercialDocumentInvoiceLine>> {
    return this.request('GET', `/api/external/v2/commercial_documents/${commercialDocumentId}/invoice_lines`, query);
  }

  async listCommercialDocumentInvoiceLineSections(commercialDocumentId: number, query?: { cursor?: string; limit?: number; sort?: string }): Promise<PaginatedResponse<CommercialDocumentInvoiceLineSection>> {
    return this.request('GET', `/api/external/v2/commercial_documents/${commercialDocumentId}/invoice_line_sections`, query);
  }

  // ==================== Transactions ====================

  async listTransactions(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<Transaction>> {
    return this.request('GET', '/api/external/v2/transactions', query);
  }

  async getTransaction(id: number): Promise<Transaction> {
    return this.request('GET', `/api/external/v2/transactions/${id}`);
  }

  async createTransaction(body: {
    bank_account_id: number;
    label: string;
    date: string;
    amount: string;
    fee?: string;
  }): Promise<Transaction> {
    return this.request('POST', '/api/external/v2/transactions', undefined, body);
  }

  async updateTransaction(id: number, body: {
    customer_id?: number;
    supplier_id?: number;
  }): Promise<Transaction> {
    return this.request('PUT', `/api/external/v2/transactions/${id}`, undefined, body);
  }

  async listTransactionCategories(transactionId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<Category>> {
    return this.request('GET', `/api/external/v2/transactions/${transactionId}/categories`, query);
  }

  async updateTransactionCategories(transactionId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]> {
    return this.request('PUT', `/api/external/v2/transactions/${transactionId}/categories`, undefined, body);
  }

  async listTransactionMatchedInvoices(transactionId: number, query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<CustomerInvoice>> {
    return this.request('GET', `/api/external/v2/transactions/${transactionId}/matched_invoices`, query);
  }

  // ==================== Products ====================

  async listProducts(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<Product>> {
    return this.request('GET', '/api/external/v2/products', query);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request('GET', `/api/external/v2/products/${id}`);
  }

  async updateProduct(id: number, body: {
    name?: string;
    description?: string;
    sales_ledger_account_id?: number;
    purchase_ledger_account_id?: number;
    vat_rate?: string;
    sales_amount?: string;
    purchase_amount?: string;
    sales_currency?: string;
    purchase_currency?: string;
    external_reference?: string;
  }): Promise<Product> {
    return this.request('PUT', `/api/external/v2/products/${id}`, undefined, body);
  }

  // ==================== Fiscal Years ====================

  async listFiscalYears(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<FiscalYear>> {
    return this.request('GET', '/api/external/v2/fiscal_years', query);
  }

  // ==================== Trial Balance ====================

  async getTrialBalance(query: {
    period_start: string;
    period_end: string;
    is_auxiliary?: boolean;
    cursor?: string;
    limit?: number;
  }): Promise<PaginatedResponse<TrialBalance>> {
    return this.request('GET', '/api/external/v2/trial_balance', query);
  }

  // ==================== Webhook Subscriptions ====================

  async listWebhookSubscriptions(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<WebhookSubscription>> {
    return this.request('GET', '/api/external/v2/webhook_subscriptions', query);
  }

  async getWebhookSubscription(id: number): Promise<WebhookSubscription> {
    return this.request('GET', `/api/external/v2/webhook_subscriptions/${id}`);
  }

  async createWebhookSubscription(body: {
    callback_url: string;
    events: string[];
    enabled?: boolean;
  }): Promise<WebhookSubscription> {
    return this.request('POST', '/api/external/v2/webhook_subscriptions', undefined, body);
  }

  async updateWebhookSubscription(id: number, body: {
    callback_url?: string;
    events?: string[];
    enabled?: boolean;
  }): Promise<WebhookSubscription> {
    return this.request('PUT', `/api/external/v2/webhook_subscriptions/${id}`, undefined, body);
  }

  async deleteWebhookSubscription(id: number): Promise<void> {
    await this.request('DELETE', `/api/external/v2/webhook_subscriptions/${id}`);
  }

  // ==================== SEPA Mandates ====================

  async listSepaMandates(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<SepaMandate>> {
    return this.request('GET', '/api/external/v2/sepa_mandates', query);
  }

  async getSepaMandate(id: number): Promise<SepaMandate> {
    return this.request('GET', `/api/external/v2/sepa_mandates/${id}`);
  }

  async createSepaMandate(body: {
    bank: string;
    bic: string;
    iban: string;
    signed_at: string;
    identifier: string;
    customer_id: number;
    sequence_type?: 'FRST' | 'OOFF' | 'RCUR' | 'FNAL';
  }): Promise<SepaMandate> {
    return this.request('POST', '/api/external/v2/sepa_mandates', undefined, body);
  }

  async updateSepaMandate(id: number, body: {
    bank?: string;
    bic?: string;
    iban?: string;
    signed_at?: string;
    identifier?: string;
    customer_id?: number;
    sequence_type?: 'FRST' | 'OOFF' | 'RCUR' | 'FNAL';
  }): Promise<SepaMandate> {
    return this.request('PUT', `/api/external/v2/sepa_mandates/${id}`, undefined, body);
  }

  async deleteSepaMandate(id: number): Promise<void> {
    await this.request('DELETE', `/api/external/v2/sepa_mandates/${id}`);
  }

  // ==================== GoCardless Mandates ====================

  async listGocardlessMandates(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<GocardlessMandate>> {
    return this.request('GET', '/api/external/v2/gocardless_mandates', query);
  }

  async getGocardlessMandate(id: number): Promise<GocardlessMandate> {
    return this.request('GET', `/api/external/v2/gocardless_mandates/${id}`);
  }

  async associateGocardlessMandate(mandateId: number, body: {
    customer_id: number;
  }): Promise<GocardlessAssociation> {
    return this.request('POST', `/api/external/v2/gocardless_mandates/${mandateId}/associations`, undefined, body);
  }

  async cancelGocardlessMandate(mandateId: number, body: {
    reason: string;
  }): Promise<GocardlessCancellation> {
    return this.request('POST', `/api/external/v2/gocardless_mandates/${mandateId}/cancellations`, undefined, body);
  }

  async sendGocardlessMailRequest(body: {
    gocardless_mandate_ids: number[];
  }): Promise<GocardlessMailRequest> {
    return this.request('POST', '/api/external/v2/gocardless_mandates/mail_requests', undefined, body);
  }

  // ==================== File Attachments ====================

  async uploadFile(body: {
    file: Buffer;
    name?: string;
  }): Promise<FileAttachment> {
    const formData = new FormData();
    formData.append('file', new Blob([body.file as any]), body.name || 'file');
    return this.requestMultipart('POST', '/api/external/v2/file_attachments', undefined, formData);
  }

  // ==================== Exports ====================

  async createGeneralLedgerExport(body: {
    fiscal_year_id: number;
    period_start?: string;
    period_end?: string;
    is_auxiliary?: boolean;
  }): Promise<ExportTask> {
    return this.request('POST', '/api/external/v2/exports/general_ledgers', undefined, body);
  }

  async getExport(id: number): Promise<ExportTask> {
    return this.request('GET', `/api/external/v2/exports/general_ledgers/${id}`);
  }

  async createFecExport(body: {
    fiscal_year_id: number;
    period_start?: string;
    period_end?: string;
  }): Promise<ExportTask> {
    return this.request('POST', '/api/external/v2/exports/fecs', undefined, body);
  }

  async createAnalyticalLedgerExport(body: {
    fiscal_year_id: number;
    period_start?: string;
    period_end?: string;
  }): Promise<ExportTask> {
    return this.request('POST', '/api/external/v2/exports/analytical_general_ledgers', undefined, body);
  }

  // ==================== Changelogs ====================

  async getCustomerInvoiceChangelogs(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ChangelogEvent>> {
    return this.request('GET', '/api/external/v2/changelogs/customer_invoices', query);
  }

  async getSupplierInvoiceChangelogs(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ChangelogEvent>> {
    return this.request('GET', '/api/external/v2/changelogs/supplier_invoices', query);
  }

  async getCustomerChangelogs(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ChangelogEvent>> {
    return this.request('GET', '/api/external/v2/changelogs/customers', query);
  }

  async getSupplierChangelogs(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ChangelogEvent>> {
    return this.request('GET', '/api/external/v2/changelogs/suppliers', query);
  }

  async getProductChangelogs(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ChangelogEvent>> {
    return this.request('GET', '/api/external/v2/changelogs/products', query);
  }

  async getLedgerEntryLineChangelogs(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ChangelogEvent>> {
    return this.request('GET', '/api/external/v2/changelogs/ledger_entry_lines', query);
  }

  async getTransactionChangelogs(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ChangelogEvent>> {
    return this.request('GET', '/api/external/v2/changelogs/transactions', query);
  }

  async getQuoteChangelogs(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ChangelogEvent>> {
    return this.request('GET', '/api/external/v2/changelogs/quotes', query);
  }

  // ==================== Purchase Requests ====================

  async listPurchaseRequests(query?: { cursor?: string; limit?: number; filter?: string; sort?: string }): Promise<PaginatedResponse<PurchaseRequest>> {
    return this.request('GET', '/api/external/v2/purchase_requests', query);
  }

  async getPurchaseRequest(id: number): Promise<PurchaseRequest> {
    return this.request('GET', `/api/external/v2/purchase_requests/${id}`);
  }

  async importPurchaseRequest(body: {
    file: Buffer;
  }): Promise<PurchaseRequest> {
    const formData = new FormData();
    formData.append('file', new Blob([body.file as any]), 'purchase_request.xml');
    return this.requestMultipart('POST', '/api/external/v2/purchase_requests/imports', undefined, formData);
  }

  // ==================== E-Invoices ====================

  async importEInvoiceGeneral(body: {
    file: Buffer;
  }): Promise<EInvoiceImport> {
    const formData = new FormData();
    formData.append('file', new Blob([body.file as any]), 'invoice.xml');
    return this.requestMultipart('POST', '/api/external/v2/e-invoices/imports', undefined, formData);
  }

  // ==================== Pro Account ====================

  async listProAccountMandateRequests(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ProAccountMandateRequest>> {
    return this.request('GET', '/api/external/v2/pro_account/mandate_requests', query);
  }

  async listProAccountMandateMigrations(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ProAccountMandateMigration>> {
    return this.request('GET', '/api/external/v2/pro_account/mandate_migrations', query);
  }

  async listProAccountMandates(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<ProAccountMandate>> {
    return this.request('GET', '/api/external/v2/pro_account/mandates', query);
  }

  // ==================== Me ====================

  async getMe(): Promise<MeUser> {
    return this.request('GET', '/api/external/v2/me');
  }

  // ==================== Customer Invoice Templates ====================

  async listCustomerInvoiceTemplates(query?: { cursor?: string; limit?: number }): Promise<PaginatedResponse<CustomerInvoiceTemplate>> {
    return this.request('GET', '/api/external/v2/customer_invoice_templates', query);
  }
}
