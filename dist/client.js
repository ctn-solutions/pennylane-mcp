export class PennyLaneClient {
    apiKey;
    baseUrl;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://app.pennylane.com';
    }
    async request(method, path, query, body) {
        const url = new URL(`${this.baseUrl}${path}`);
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            });
        }
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        const options = {
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
            return response.json();
        }
        return response.text();
    }
    async requestMultipart(method, path, query, formData) {
        const url = new URL(`${this.baseUrl}${path}`);
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            });
        }
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
        };
        const options = {
            method,
            headers,
            body: formData,
        };
        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`PennyLane API error ${response.status}: ${errorText}`);
        }
        return response.json();
    }
    // ==================== Bank Accounts ====================
    async listBankAccounts(query) {
        return this.request('GET', '/api/external/v2/bank_accounts', query);
    }
    async getBankAccount(id) {
        return this.request('GET', `/api/external/v2/bank_accounts/${id}`);
    }
    async createBankAccount(body) {
        return this.request('POST', '/api/external/v2/bank_accounts', undefined, body);
    }
    // ==================== Bank Establishments ====================
    async listBankEstablishments(query) {
        return this.request('GET', '/api/external/v2/bank_establishments', query);
    }
    // ==================== Billing Subscriptions ====================
    async listBillingSubscriptions(query) {
        return this.request('GET', '/api/external/v2/billing_subscriptions', query);
    }
    async getBillingSubscription(id) {
        return this.request('GET', `/api/external/v2/billing_subscriptions/${id}`);
    }
    async createBillingSubscription(body) {
        return this.request('POST', '/api/external/v2/billing_subscriptions', undefined, body);
    }
    async updateBillingSubscription(id, body) {
        return this.request('PUT', `/api/external/v2/billing_subscriptions/${id}`, undefined, body);
    }
    async listBillingSubscriptionInvoiceLineSections(billingSubscriptionId, query) {
        return this.request('GET', `/api/external/v2/billing_subscriptions/${billingSubscriptionId}/invoice_line_sections`, query);
    }
    async listBillingSubscriptionInvoiceLines(billingSubscriptionId, query) {
        return this.request('GET', `/api/external/v2/billing_subscriptions/${billingSubscriptionId}/invoice_lines`, query);
    }
    // ==================== Categories ====================
    async listCategories(query) {
        return this.request('GET', '/api/external/v2/categories', query);
    }
    async getCategory(id) {
        return this.request('GET', `/api/external/v2/categories/${id}`);
    }
    async createCategory(body) {
        return this.request('POST', '/api/external/v2/categories', undefined, body);
    }
    async updateCategory(id, body) {
        return this.request('PUT', `/api/external/v2/categories/${id}`, undefined, body);
    }
    // ==================== Category Groups ====================
    async listCategoryGroups(query) {
        return this.request('GET', '/api/external/v2/category_groups', query);
    }
    async getCategoryGroup(id) {
        return this.request('GET', `/api/external/v2/category_groups/${id}`);
    }
    async listCategoryGroupCategories(categoryGroupId, query) {
        return this.request('GET', `/api/external/v2/category_groups/${categoryGroupId}/categories`, query);
    }
    // ==================== Customers ====================
    async listCustomers(query) {
        return this.request('GET', '/api/external/v2/customers', query);
    }
    async getCustomer(id) {
        return this.request('GET', `/api/external/v2/customers/${id}`);
    }
    async listCustomerCategories(customerId, query) {
        return this.request('GET', `/api/external/v2/customers/${customerId}/categories`, query);
    }
    async updateCustomerCategories(customerId, body) {
        return this.request('PUT', `/api/external/v2/customers/${customerId}/categories`, undefined, body);
    }
    async listCustomerContacts(customerId, query) {
        return this.request('GET', `/api/external/v2/customers/${customerId}/contacts`, query);
    }
    // ==================== Company Customers ====================
    async getCompanyCustomer(id) {
        return this.request('GET', `/api/external/v2/company_customers/${id}`);
    }
    async createCompanyCustomer(body) {
        return this.request('POST', '/api/external/v2/company_customers', undefined, body);
    }
    async updateCompanyCustomer(id, body) {
        return this.request('PUT', `/api/external/v2/company_customers/${id}`, undefined, body);
    }
    // ==================== Individual Customers ====================
    async getIndividualCustomer(id) {
        return this.request('GET', `/api/external/v2/individual_customers/${id}`);
    }
    async createIndividualCustomer(body) {
        return this.request('POST', '/api/external/v2/individual_customers', undefined, body);
    }
    async updateIndividualCustomer(id, body) {
        return this.request('PUT', `/api/external/v2/individual_customers/${id}`, undefined, body);
    }
    // ==================== Suppliers ====================
    async listSuppliers(query) {
        return this.request('GET', '/api/external/v2/suppliers', query);
    }
    async getSupplier(id) {
        return this.request('GET', `/api/external/v2/suppliers/${id}`);
    }
    async createSupplier(body) {
        return this.request('POST', '/api/external/v2/suppliers', undefined, body);
    }
    async updateSupplier(id, body) {
        return this.request('PUT', `/api/external/v2/suppliers/${id}`, undefined, body);
    }
    async listSupplierCategories(supplierId, query) {
        return this.request('GET', `/api/external/v2/suppliers/${supplierId}/categories`, query);
    }
    async updateSupplierCategories(supplierId, body) {
        return this.request('PUT', `/api/external/v2/suppliers/${supplierId}/categories`, undefined, body);
    }
    // ==================== Journals ====================
    async listJournals(query) {
        return this.request('GET', '/api/external/v2/journals', query);
    }
    async getJournal(id) {
        return this.request('GET', `/api/external/v2/journals/${id}`);
    }
    async createJournal(body) {
        return this.request('POST', '/api/external/v2/journals', undefined, body);
    }
    // ==================== Ledger Accounts ====================
    async listLedgerAccounts(query) {
        return this.request('GET', '/api/external/v2/ledger_accounts', query);
    }
    async getLedgerAccount(id) {
        return this.request('GET', `/api/external/v2/ledger_accounts/${id}`);
    }
    async createLedgerAccount(body) {
        return this.request('POST', '/api/external/v2/ledger_accounts', undefined, body);
    }
    async updateLedgerAccount(id, body) {
        return this.request('PUT', `/api/external/v2/ledger_accounts/${id}`, undefined, body);
    }
    // ==================== Ledger Entries ====================
    async listLedgerEntries(query) {
        return this.request('GET', '/api/external/v2/ledger_entries', query);
    }
    async getLedgerEntry(id) {
        return this.request('GET', `/api/external/v2/ledger_entries/${id}`);
    }
    async createLedgerEntry(body) {
        return this.request('POST', '/api/external/v2/ledger_entries', undefined, body);
    }
    // ==================== Ledger Entry Lines ====================
    async listLedgerEntryLines(ledgerEntryId, query) {
        return this.request('GET', `/api/external/v2/ledger_entries/${ledgerEntryId}/ledger_entry_lines`, query);
    }
    async getLedgerEntryLine(id) {
        return this.request('GET', `/api/external/v2/ledger_entry_lines/${id}`);
    }
    async createLedgerEntryLine(body) {
        return this.request('POST', '/api/external/v2/ledger_entry_lines', undefined, body);
    }
    async getLedgerEntryLineLettering(ledgerEntryLineId, query) {
        return this.request('GET', `/api/external/v2/ledger_entry_lines/${ledgerEntryLineId}/lettered_ledger_entry_lines`, query);
    }
    async letterLedgerEntryLines(body) {
        return this.request('POST', '/api/external/v2/ledger_entry_lines/lettering', undefined, body);
    }
    async getLedgerEntryLineCategories(ledgerEntryLineId, query) {
        return this.request('GET', `/api/external/v2/ledger_entry_lines/${ledgerEntryLineId}/categories`, query);
    }
    async updateLedgerEntryLineCategories(ledgerEntryLineId, body) {
        return this.request('PUT', `/api/external/v2/ledger_entry_lines/${ledgerEntryLineId}/categories`, undefined, body);
    }
    // ==================== Ledger Attachments ====================
    async uploadLedgerAttachment(body) {
        return this.request('POST', '/api/external/v2/ledger_attachments', undefined, body);
    }
    // ==================== Customer Invoices ====================
    async listCustomerInvoices(query) {
        return this.request('GET', '/api/external/v2/customer_invoices', query);
    }
    async getCustomerInvoice(id) {
        return this.request('GET', `/api/external/v2/customer_invoices/${id}`);
    }
    async createCustomerInvoice(body) {
        return this.request('POST', '/api/external/v2/customer_invoices', undefined, body);
    }
    async updateCustomerInvoice(id, body) {
        return this.request('PUT', `/api/external/v2/customer_invoices/${id}`, undefined, body);
    }
    async deleteCustomerInvoice(id) {
        await this.request('DELETE', `/api/external/v2/customer_invoices/${id}`);
    }
    async finalizeCustomerInvoice(id) {
        return this.request('PUT', `/api/external/v2/customer_invoices/${id}/finalize`);
    }
    async markAsPaid(id) {
        return this.request('PUT', `/api/external/v2/customer_invoices/${id}/mark_as_paid`);
    }
    async sendByEmail(id, body) {
        await this.request('POST', `/api/external/v2/customer_invoices/${id}/send_by_email`, undefined, body);
    }
    async sendToPa(id) {
        await this.request('POST', `/api/external/v2/customer_invoices/${id}/send_to_pa`);
    }
    async importCustomerInvoice(body) {
        return this.request('POST', '/api/external/v2/customer_invoices/import', undefined, body);
    }
    async importEInvoice(body) {
        const formData = new FormData();
        formData.append('file', new Blob([body.file]), 'invoice.xml');
        if (body.invoice_options) {
            formData.append('invoice_options', JSON.stringify(body.invoice_options));
        }
        return this.requestMultipart('POST', '/api/external/v2/customer_invoices/e_invoices/imports', undefined, formData);
    }
    async createFromQuote(quoteId) {
        return this.request('POST', '/api/external/v2/customer_invoices/create_from_quote', { quote_id: quoteId });
    }
    async linkCreditNote(id, body) {
        return this.request('POST', `/api/external/v2/customer_invoices/${id}/link_credit_note`, undefined, body);
    }
    async updateImported(id, body) {
        return this.request('PUT', `/api/external/v2/customer_invoices/${id}/update_imported`, undefined, body);
    }
    async listCustomerInvoiceLines(customerInvoiceId, query) {
        return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/invoice_lines`, query);
    }
    async listCustomerInvoiceLineSections(customerInvoiceId, query) {
        return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/invoice_line_sections`, query);
    }
    async listCustomerInvoiceAppendices(customerInvoiceId, query) {
        return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/appendices`, query);
    }
    async uploadCustomerInvoiceAppendix(customerInvoiceId, file) {
        const formData = new FormData();
        formData.append('file', new Blob([file]), 'attachment.pdf');
        return this.requestMultipart('POST', `/api/external/v2/customer_invoices/${customerInvoiceId}/appendices`, undefined, formData);
    }
    async listCustomerInvoiceCategories(customerInvoiceId, query) {
        return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/categories`, query);
    }
    async updateCustomerInvoiceCategories(customerInvoiceId, body) {
        return this.request('PUT', `/api/external/v2/customer_invoices/${customerInvoiceId}/categories`, undefined, body);
    }
    async listCustomerInvoiceMatchedTransactions(customerInvoiceId, query) {
        return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/matched_transactions`, query);
    }
    async matchCustomerInvoiceTransaction(customerInvoiceId, body) {
        return this.request('POST', `/api/external/v2/customer_invoices/${customerInvoiceId}/matched_transactions`, undefined, body);
    }
    async unmatchCustomerInvoiceTransaction(customerInvoiceId, transactionId) {
        await this.request('DELETE', `/api/external/v2/customer_invoices/${customerInvoiceId}/matched_transactions/${transactionId}`);
    }
    async listCustomerInvoicePayments(customerInvoiceId, query) {
        return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/payments`, query);
    }
    async listCustomerInvoiceCustomHeaderFields(customerInvoiceId, query) {
        return this.request('GET', `/api/external/v2/customer_invoices/${customerInvoiceId}/custom_header_fields`, query);
    }
    // ==================== Supplier Invoices ====================
    async listSupplierInvoices(query) {
        return this.request('GET', '/api/external/v2/supplier_invoices', query);
    }
    async getSupplierInvoice(id) {
        return this.request('GET', `/api/external/v2/supplier_invoices/${id}`);
    }
    async updateSupplierInvoice(id, body) {
        return this.request('PUT', `/api/external/v2/supplier_invoices/${id}`, undefined, body);
    }
    async listSupplierInvoiceLines(supplierInvoiceId, query) {
        return this.request('GET', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/invoice_lines`, query);
    }
    async listSupplierInvoiceCategories(supplierInvoiceId, query) {
        return this.request('GET', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/categories`, query);
    }
    async updateSupplierInvoiceCategories(supplierInvoiceId, body) {
        return this.request('PUT', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/categories`, undefined, body);
    }
    async listSupplierInvoicePayments(supplierInvoiceId, query) {
        return this.request('GET', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/payments`, query);
    }
    async updateSupplierInvoicePaymentStatus(supplierInvoiceId, body) {
        await this.request('PUT', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/payment_status`, undefined, body);
    }
    async listSupplierInvoiceMatchedTransactions(supplierInvoiceId, query) {
        return this.request('GET', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/matched_transactions`, query);
    }
    async matchSupplierInvoiceTransaction(supplierInvoiceId, body) {
        return this.request('POST', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/matched_transactions`, undefined, body);
    }
    async unmatchSupplierInvoiceTransaction(supplierInvoiceId, transactionId) {
        await this.request('DELETE', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/matched_transactions/${transactionId}`);
    }
    async linkSupplierInvoicePurchaseRequest(supplierInvoiceId, body) {
        return this.request('POST', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/linked_purchase_requests`, undefined, body);
    }
    async updateSupplierInvoiceEInvoiceStatus(supplierInvoiceId, body) {
        await this.request('PUT', `/api/external/v2/supplier_invoices/${supplierInvoiceId}/e_invoice_status`, undefined, body);
    }
    async validateSupplierInvoiceAccounting(id) {
        return this.request('PUT', `/api/external/v2/supplier_invoices/${id}/validate_accounting`);
    }
    async importSupplierInvoice(body) {
        return this.request('POST', '/api/external/v2/supplier_invoices/import', undefined, body);
    }
    async importSupplierEInvoice(body) {
        const formData = new FormData();
        formData.append('file', new Blob([body.file]), 'invoice.xml');
        if (body.invoice_options) {
            formData.append('invoice_options', JSON.stringify(body.invoice_options));
        }
        return this.requestMultipart('POST', '/api/external/v2/supplier_invoices/e_invoices/imports', undefined, formData);
    }
    // ==================== Quotes ====================
    async listQuotes(query) {
        return this.request('GET', '/api/external/v2/quotes', query);
    }
    async getQuote(id) {
        return this.request('GET', `/api/external/v2/quotes/${id}`);
    }
    async sendQuoteByEmail(id, body) {
        await this.request('POST', `/api/external/v2/quotes/${id}/send_by_email`, undefined, body);
    }
    async updateQuoteStatus(id, body) {
        return this.request('PUT', `/api/external/v2/quotes/${id}/update_status`, undefined, body);
    }
    async listQuoteAppendices(quoteId, query) {
        return this.request('GET', `/api/external/v2/quotes/${quoteId}/appendices`, query);
    }
    async uploadQuoteAppendix(quoteId, file) {
        const formData = new FormData();
        formData.append('file', new Blob([file]), 'attachment.pdf');
        return this.requestMultipart('POST', `/api/external/v2/quotes/${quoteId}/appendices`, undefined, formData);
    }
    async listQuoteInvoiceLines(quoteId, query) {
        return this.request('GET', `/api/external/v2/quotes/${quoteId}/invoice_lines`, query);
    }
    async listQuoteInvoiceLineSections(quoteId, query) {
        return this.request('GET', `/api/external/v2/quotes/${quoteId}/invoice_line_sections`, query);
    }
    // ==================== Commercial Documents ====================
    async listCommercialDocuments(query) {
        return this.request('GET', '/api/external/v2/commercial_documents', query);
    }
    async getCommercialDocument(id) {
        return this.request('GET', `/api/external/v2/commercial_documents/${id}`);
    }
    async listCommercialDocumentAppendices(commercialDocumentId, query) {
        return this.request('GET', `/api/external/v2/commercial_documents/${commercialDocumentId}/appendices`, query);
    }
    async uploadCommercialDocumentAppendix(commercialDocumentId, file) {
        const formData = new FormData();
        formData.append('file', new Blob([file]), 'attachment.pdf');
        return this.requestMultipart('POST', `/api/external/v2/commercial_documents/${commercialDocumentId}/appendices`, undefined, formData);
    }
    async listCommercialDocumentInvoiceLines(commercialDocumentId, query) {
        return this.request('GET', `/api/external/v2/commercial_documents/${commercialDocumentId}/invoice_lines`, query);
    }
    async listCommercialDocumentInvoiceLineSections(commercialDocumentId, query) {
        return this.request('GET', `/api/external/v2/commercial_documents/${commercialDocumentId}/invoice_line_sections`, query);
    }
    // ==================== Transactions ====================
    async listTransactions(query) {
        return this.request('GET', '/api/external/v2/transactions', query);
    }
    async getTransaction(id) {
        return this.request('GET', `/api/external/v2/transactions/${id}`);
    }
    async createTransaction(body) {
        return this.request('POST', '/api/external/v2/transactions', undefined, body);
    }
    async updateTransaction(id, body) {
        return this.request('PUT', `/api/external/v2/transactions/${id}`, undefined, body);
    }
    async listTransactionCategories(transactionId, query) {
        return this.request('GET', `/api/external/v2/transactions/${transactionId}/categories`, query);
    }
    async updateTransactionCategories(transactionId, body) {
        return this.request('PUT', `/api/external/v2/transactions/${transactionId}/categories`, undefined, body);
    }
    async listTransactionMatchedInvoices(transactionId, query) {
        return this.request('GET', `/api/external/v2/transactions/${transactionId}/matched_invoices`, query);
    }
    // ==================== Products ====================
    async listProducts(query) {
        return this.request('GET', '/api/external/v2/products', query);
    }
    async getProduct(id) {
        return this.request('GET', `/api/external/v2/products/${id}`);
    }
    async updateProduct(id, body) {
        return this.request('PUT', `/api/external/v2/products/${id}`, undefined, body);
    }
    // ==================== Fiscal Years ====================
    async listFiscalYears(query) {
        return this.request('GET', '/api/external/v2/fiscal_years', query);
    }
    // ==================== Trial Balance ====================
    async getTrialBalance(query) {
        return this.request('GET', '/api/external/v2/trial_balance', query);
    }
    // ==================== Webhook Subscriptions ====================
    async listWebhookSubscriptions(query) {
        return this.request('GET', '/api/external/v2/webhook_subscriptions', query);
    }
    async getWebhookSubscription(id) {
        return this.request('GET', `/api/external/v2/webhook_subscriptions/${id}`);
    }
    async createWebhookSubscription(body) {
        return this.request('POST', '/api/external/v2/webhook_subscriptions', undefined, body);
    }
    async updateWebhookSubscription(id, body) {
        return this.request('PUT', `/api/external/v2/webhook_subscriptions/${id}`, undefined, body);
    }
    async deleteWebhookSubscription(id) {
        await this.request('DELETE', `/api/external/v2/webhook_subscriptions/${id}`);
    }
    // ==================== SEPA Mandates ====================
    async listSepaMandates(query) {
        return this.request('GET', '/api/external/v2/sepa_mandates', query);
    }
    async getSepaMandate(id) {
        return this.request('GET', `/api/external/v2/sepa_mandates/${id}`);
    }
    async createSepaMandate(body) {
        return this.request('POST', '/api/external/v2/sepa_mandates', undefined, body);
    }
    async updateSepaMandate(id, body) {
        return this.request('PUT', `/api/external/v2/sepa_mandates/${id}`, undefined, body);
    }
    async deleteSepaMandate(id) {
        await this.request('DELETE', `/api/external/v2/sepa_mandates/${id}`);
    }
    // ==================== GoCardless Mandates ====================
    async listGocardlessMandates(query) {
        return this.request('GET', '/api/external/v2/gocardless_mandates', query);
    }
    async getGocardlessMandate(id) {
        return this.request('GET', `/api/external/v2/gocardless_mandates/${id}`);
    }
    async associateGocardlessMandate(mandateId, body) {
        return this.request('POST', `/api/external/v2/gocardless_mandates/${mandateId}/associations`, undefined, body);
    }
    async cancelGocardlessMandate(mandateId, body) {
        return this.request('POST', `/api/external/v2/gocardless_mandates/${mandateId}/cancellations`, undefined, body);
    }
    async sendGocardlessMailRequest(body) {
        return this.request('POST', '/api/external/v2/gocardless_mandates/mail_requests', undefined, body);
    }
    // ==================== File Attachments ====================
    async uploadFile(body) {
        const formData = new FormData();
        formData.append('file', new Blob([body.file]), body.name || 'file');
        return this.requestMultipart('POST', '/api/external/v2/file_attachments', undefined, formData);
    }
    // ==================== Exports ====================
    async createGeneralLedgerExport(body) {
        return this.request('POST', '/api/external/v2/exports/general_ledgers', undefined, body);
    }
    async getExport(id) {
        return this.request('GET', `/api/external/v2/exports/general_ledgers/${id}`);
    }
    async createFecExport(body) {
        return this.request('POST', '/api/external/v2/exports/fecs', undefined, body);
    }
    async createAnalyticalLedgerExport(body) {
        return this.request('POST', '/api/external/v2/exports/analytical_general_ledgers', undefined, body);
    }
    // ==================== Changelogs ====================
    async getCustomerInvoiceChangelogs(query) {
        return this.request('GET', '/api/external/v2/changelogs/customer_invoices', query);
    }
    async getSupplierInvoiceChangelogs(query) {
        return this.request('GET', '/api/external/v2/changelogs/supplier_invoices', query);
    }
    async getCustomerChangelogs(query) {
        return this.request('GET', '/api/external/v2/changelogs/customers', query);
    }
    async getSupplierChangelogs(query) {
        return this.request('GET', '/api/external/v2/changelogs/suppliers', query);
    }
    async getProductChangelogs(query) {
        return this.request('GET', '/api/external/v2/changelogs/products', query);
    }
    async getLedgerEntryLineChangelogs(query) {
        return this.request('GET', '/api/external/v2/changelogs/ledger_entry_lines', query);
    }
    async getTransactionChangelogs(query) {
        return this.request('GET', '/api/external/v2/changelogs/transactions', query);
    }
    async getQuoteChangelogs(query) {
        return this.request('GET', '/api/external/v2/changelogs/quotes', query);
    }
    // ==================== Purchase Requests ====================
    async listPurchaseRequests(query) {
        return this.request('GET', '/api/external/v2/purchase_requests', query);
    }
    async getPurchaseRequest(id) {
        return this.request('GET', `/api/external/v2/purchase_requests/${id}`);
    }
    async importPurchaseRequest(body) {
        const formData = new FormData();
        formData.append('file', new Blob([body.file]), 'purchase_request.xml');
        return this.requestMultipart('POST', '/api/external/v2/purchase_requests/imports', undefined, formData);
    }
    // ==================== E-Invoices ====================
    async importEInvoiceGeneral(body) {
        const formData = new FormData();
        formData.append('file', new Blob([body.file]), 'invoice.xml');
        return this.requestMultipart('POST', '/api/external/v2/e-invoices/imports', undefined, formData);
    }
    // ==================== Pro Account ====================
    async listProAccountMandateRequests(query) {
        return this.request('GET', '/api/external/v2/pro_account/mandate_requests', query);
    }
    async listProAccountMandateMigrations(query) {
        return this.request('GET', '/api/external/v2/pro_account/mandate_migrations', query);
    }
    async listProAccountMandates(query) {
        return this.request('GET', '/api/external/v2/pro_account/mandates', query);
    }
    // ==================== Me ====================
    async getMe() {
        return this.request('GET', '/api/external/v2/me');
    }
    // ==================== Customer Invoice Templates ====================
    async listCustomerInvoiceTemplates(query) {
        return this.request('GET', '/api/external/v2/customer_invoice_templates', query);
    }
}
