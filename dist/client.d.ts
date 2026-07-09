import { BankAccount, BankEstablishment, BillingSubscription, BillingSubscriptionInvoiceLineSection, BillingSubscriptionInvoiceLine, CategoryGroup, Category, Customer, CompanyCustomer, IndividualCustomer, CustomerContact, Supplier, Journal, LedgerAccount, LedgerEntry, LedgerEntryLine, CustomerInvoice, CustomerInvoiceLine, CustomerInvoiceLineSection, CustomerInvoiceAppendix, CustomerInvoicePayment, CustomerInvoiceMatchedTransaction, CustomerInvoiceCustomHeaderField, SupplierInvoice, SupplierInvoiceLine, Quote, QuoteAppendix, QuoteInvoiceLine, QuoteInvoiceLineSection, CommercialDocument, CommercialDocumentAppendix, CommercialDocumentInvoiceLine, CommercialDocumentInvoiceLineSection, Transaction, Product, FiscalYear, TrialBalance, WebhookSubscription, SepaMandate, GocardlessMandate, GocardlessMailRequest, GocardlessCancellation, GocardlessAssociation, FileAttachment, ExportTask, ChangelogEvent, EInvoiceImport, PurchaseRequest, ProAccountMandateRequest, ProAccountMandateMigration, ProAccountMandate, MeUser, CustomerInvoiceTemplate, CategoryAssignment, PaginatedResponse } from './types.js';
export interface PennyLaneClientConfig {
    apiKey: string;
    baseUrl?: string;
}
export declare class PennyLaneClient {
    private apiKey;
    private baseUrl;
    constructor(config: PennyLaneClientConfig);
    private request;
    private requestMultipart;
    listBankAccounts(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<BankAccount>>;
    getBankAccount(id: number): Promise<BankAccount>;
    createBankAccount(body: {
        name: string;
        last_four?: string;
        bank_name?: string;
        iban?: string;
        bic?: string;
        currency?: string;
    }): Promise<BankAccount>;
    listBankEstablishments(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<BankEstablishment>>;
    listBillingSubscriptions(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<BillingSubscription>>;
    getBillingSubscription(id: number): Promise<BillingSubscription>;
    createBillingSubscription(body: {
        name: string;
        customer_id: number;
    }): Promise<BillingSubscription>;
    updateBillingSubscription(id: number, body: {
        name?: string;
        customer_id?: number;
        next_invoice_date?: string;
    }): Promise<BillingSubscription>;
    listBillingSubscriptionInvoiceLineSections(billingSubscriptionId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<BillingSubscriptionInvoiceLineSection>>;
    listBillingSubscriptionInvoiceLines(billingSubscriptionId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<BillingSubscriptionInvoiceLine>>;
    listCategories(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<Category>>;
    getCategory(id: number): Promise<Category>;
    createCategory(body: {
        name: string;
        color?: string;
        category_group_id?: number;
    }): Promise<Category>;
    updateCategory(id: number, body: {
        name?: string;
        color?: string;
        category_group_id?: number;
    }): Promise<Category>;
    listCategoryGroups(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<CategoryGroup>>;
    getCategoryGroup(id: number): Promise<CategoryGroup>;
    listCategoryGroupCategories(categoryGroupId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<Category>>;
    listCustomers(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<Customer>>;
    getCustomer(id: number): Promise<Customer>;
    listCustomerCategories(customerId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<Category>>;
    updateCustomerCategories(customerId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]>;
    listCustomerContacts(customerId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<CustomerContact>>;
    getCompanyCustomer(id: number): Promise<CompanyCustomer>;
    createCompanyCustomer(body: {
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
    }): Promise<CompanyCustomer>;
    updateCompanyCustomer(id: number, body: {
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
    }): Promise<CompanyCustomer>;
    getIndividualCustomer(id: number): Promise<IndividualCustomer>;
    createIndividualCustomer(body: {
        first_name: string;
        last_name: string;
        email?: string;
        phone?: string;
        external_reference?: string;
    }): Promise<IndividualCustomer>;
    updateIndividualCustomer(id: number, body: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        external_reference?: string;
    }): Promise<IndividualCustomer>;
    listSuppliers(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<Supplier>>;
    getSupplier(id: number): Promise<Supplier>;
    createSupplier(body: {
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
    }): Promise<Supplier>;
    updateSupplier(id: number, body: {
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
    }): Promise<Supplier>;
    listSupplierCategories(supplierId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<Category>>;
    updateSupplierCategories(supplierId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]>;
    listJournals(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<Journal>>;
    getJournal(id: number): Promise<Journal>;
    createJournal(body: {
        name: string;
        code: string;
        type: string;
    }): Promise<Journal>;
    listLedgerAccounts(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<LedgerAccount>>;
    getLedgerAccount(id: number): Promise<LedgerAccount>;
    createLedgerAccount(body: {
        number: string;
        name: string;
        code?: string;
    }): Promise<LedgerAccount>;
    updateLedgerAccount(id: number, body: {
        number?: string;
        name?: string;
        code?: string;
    }): Promise<LedgerAccount>;
    listLedgerEntries(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<LedgerEntry>>;
    getLedgerEntry(id: number): Promise<LedgerEntry>;
    createLedgerEntry(body: {
        journal_id: number;
        date: string;
        reference: string;
        label?: string;
    }): Promise<LedgerEntry>;
    listLedgerEntryLines(ledgerEntryId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<LedgerEntryLine>>;
    getLedgerEntryLine(id: number): Promise<LedgerEntryLine>;
    createLedgerEntryLine(body: {
        ledger_entry_id: number;
        label?: string;
        amount: string;
        currency: string;
        currency_amount: string;
        ledger_account_id: number;
    }): Promise<LedgerEntryLine>;
    getLedgerEntryLineLettering(ledgerEntryLineId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<LedgerEntryLine>>;
    letterLedgerEntryLines(body: {
        ledger_entry_line_ids: number[];
    }): Promise<LedgerEntryLine[]>;
    getLedgerEntryLineCategories(ledgerEntryLineId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<Category>>;
    updateLedgerEntryLineCategories(ledgerEntryLineId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]>;
    uploadLedgerAttachment(body: {
        file_attachment_id: number;
        ledger_entry_id: number;
    }): Promise<FileAttachment>;
    listCustomerInvoices(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<CustomerInvoice>>;
    getCustomerInvoice(id: number): Promise<CustomerInvoice>;
    createCustomerInvoice(body: {
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
    }): Promise<CustomerInvoice>;
    updateCustomerInvoice(id: number, body: {
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
            delete?: Array<{
                id: number;
            }>;
        };
    }): Promise<CustomerInvoice>;
    deleteCustomerInvoice(id: number): Promise<void>;
    finalizeCustomerInvoice(id: number): Promise<CustomerInvoice>;
    markAsPaid(id: number): Promise<CustomerInvoice>;
    sendByEmail(id: number, body?: {
        recipients?: string[];
    }): Promise<void>;
    sendToPa(id: number): Promise<void>;
    importCustomerInvoice(body: {
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
    }): Promise<CustomerInvoice>;
    importEInvoice(body: {
        file: Buffer;
        invoice_options?: {
            supplier_id?: number;
            invoice_lines?: Array<{
                e_invoice_line_id: string;
                ledger_account_id?: number;
            }>;
        };
    }): Promise<CustomerInvoice>;
    createFromQuote(quoteId: number): Promise<CustomerInvoice>;
    linkCreditNote(id: number, body: {
        credit_note_id: number;
    }): Promise<CustomerInvoice>;
    updateImported(id: number, body: {
        status: string;
    }): Promise<CustomerInvoice>;
    listCustomerInvoiceLines(customerInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<CustomerInvoiceLine>>;
    listCustomerInvoiceLineSections(customerInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<CustomerInvoiceLineSection>>;
    listCustomerInvoiceAppendices(customerInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<CustomerInvoiceAppendix>>;
    uploadCustomerInvoiceAppendix(customerInvoiceId: number, file: Buffer): Promise<CustomerInvoiceAppendix>;
    listCustomerInvoiceCategories(customerInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<Category>>;
    updateCustomerInvoiceCategories(customerInvoiceId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]>;
    listCustomerInvoiceMatchedTransactions(customerInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<CustomerInvoiceMatchedTransaction>>;
    matchCustomerInvoiceTransaction(customerInvoiceId: number, body: {
        transaction_id: number;
    }): Promise<CustomerInvoiceMatchedTransaction>;
    unmatchCustomerInvoiceTransaction(customerInvoiceId: number, transactionId: number): Promise<void>;
    listCustomerInvoicePayments(customerInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<CustomerInvoicePayment>>;
    listCustomerInvoiceCustomHeaderFields(customerInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<CustomerInvoiceCustomHeaderField>>;
    listSupplierInvoices(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<SupplierInvoice>>;
    getSupplierInvoice(id: number): Promise<SupplierInvoice>;
    updateSupplierInvoice(id: number, body: {
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
            delete?: Array<{
                id: number;
            }>;
        };
        external_reference?: string;
    }): Promise<SupplierInvoice>;
    listSupplierInvoiceLines(supplierInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<SupplierInvoiceLine>>;
    listSupplierInvoiceCategories(supplierInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<Category>>;
    updateSupplierInvoiceCategories(supplierInvoiceId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]>;
    listSupplierInvoicePayments(supplierInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<CustomerInvoicePayment>>;
    updateSupplierInvoicePaymentStatus(supplierInvoiceId: number, body: {
        payment_status: 'paid' | 'to_be_paid';
    }): Promise<void>;
    listSupplierInvoiceMatchedTransactions(supplierInvoiceId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<CustomerInvoiceMatchedTransaction>>;
    matchSupplierInvoiceTransaction(supplierInvoiceId: number, body: {
        transaction_id: number;
    }): Promise<CustomerInvoiceMatchedTransaction>;
    unmatchSupplierInvoiceTransaction(supplierInvoiceId: number, transactionId: number): Promise<void>;
    linkSupplierInvoicePurchaseRequest(supplierInvoiceId: number, body: {
        purchase_request_id: number;
    }): Promise<PurchaseRequest>;
    updateSupplierInvoiceEInvoiceStatus(supplierInvoiceId: number, body: {
        status: 'disputed' | 'refused' | 'approved';
        reason?: string;
    }): Promise<void>;
    validateSupplierInvoiceAccounting(id: number): Promise<SupplierInvoice>;
    importSupplierInvoice(body: {
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
    }): Promise<SupplierInvoice>;
    importSupplierEInvoice(body: {
        file: Buffer;
        invoice_options?: {
            supplier_id?: number;
            invoice_lines?: Array<{
                e_invoice_line_id: string;
                ledger_account_id?: number;
            }>;
        };
    }): Promise<SupplierInvoice>;
    listQuotes(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<Quote>>;
    getQuote(id: number): Promise<Quote>;
    sendQuoteByEmail(id: number, body?: {
        recipients?: string[];
    }): Promise<void>;
    updateQuoteStatus(id: number, body: {
        status: 'pending' | 'accepted' | 'denied' | 'invoiced' | 'expired';
    }): Promise<Quote>;
    listQuoteAppendices(quoteId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<QuoteAppendix>>;
    uploadQuoteAppendix(quoteId: number, file: Buffer): Promise<QuoteAppendix>;
    listQuoteInvoiceLines(quoteId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<QuoteInvoiceLine>>;
    listQuoteInvoiceLineSections(quoteId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<QuoteInvoiceLineSection>>;
    listCommercialDocuments(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<CommercialDocument>>;
    getCommercialDocument(id: number): Promise<CommercialDocument>;
    listCommercialDocumentAppendices(commercialDocumentId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<CommercialDocumentAppendix>>;
    uploadCommercialDocumentAppendix(commercialDocumentId: number, file: Buffer): Promise<CommercialDocumentAppendix>;
    listCommercialDocumentInvoiceLines(commercialDocumentId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<CommercialDocumentInvoiceLine>>;
    listCommercialDocumentInvoiceLineSections(commercialDocumentId: number, query?: {
        cursor?: string;
        limit?: number;
        sort?: string;
    }): Promise<PaginatedResponse<CommercialDocumentInvoiceLineSection>>;
    listTransactions(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<Transaction>>;
    getTransaction(id: number): Promise<Transaction>;
    createTransaction(body: {
        bank_account_id: number;
        label: string;
        date: string;
        amount: string;
        fee?: string;
    }): Promise<Transaction>;
    updateTransaction(id: number, body: {
        customer_id?: number;
        supplier_id?: number;
    }): Promise<Transaction>;
    listTransactionCategories(transactionId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<Category>>;
    updateTransactionCategories(transactionId: number, body: CategoryAssignment[]): Promise<CategoryAssignment[]>;
    listTransactionMatchedInvoices(transactionId: number, query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<CustomerInvoice>>;
    listProducts(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<Product>>;
    getProduct(id: number): Promise<Product>;
    updateProduct(id: number, body: {
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
    }): Promise<Product>;
    listFiscalYears(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<FiscalYear>>;
    getTrialBalance(query: {
        period_start: string;
        period_end: string;
        is_auxiliary?: boolean;
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<TrialBalance>>;
    listWebhookSubscriptions(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<WebhookSubscription>>;
    getWebhookSubscription(id: number): Promise<WebhookSubscription>;
    createWebhookSubscription(body: {
        callback_url: string;
        events: string[];
        enabled?: boolean;
    }): Promise<WebhookSubscription>;
    updateWebhookSubscription(id: number, body: {
        callback_url?: string;
        events?: string[];
        enabled?: boolean;
    }): Promise<WebhookSubscription>;
    deleteWebhookSubscription(id: number): Promise<void>;
    listSepaMandates(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<SepaMandate>>;
    getSepaMandate(id: number): Promise<SepaMandate>;
    createSepaMandate(body: {
        bank: string;
        bic: string;
        iban: string;
        signed_at: string;
        identifier: string;
        customer_id: number;
        sequence_type?: 'FRST' | 'OOFF' | 'RCUR' | 'FNAL';
    }): Promise<SepaMandate>;
    updateSepaMandate(id: number, body: {
        bank?: string;
        bic?: string;
        iban?: string;
        signed_at?: string;
        identifier?: string;
        customer_id?: number;
        sequence_type?: 'FRST' | 'OOFF' | 'RCUR' | 'FNAL';
    }): Promise<SepaMandate>;
    deleteSepaMandate(id: number): Promise<void>;
    listGocardlessMandates(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<GocardlessMandate>>;
    getGocardlessMandate(id: number): Promise<GocardlessMandate>;
    associateGocardlessMandate(mandateId: number, body: {
        customer_id: number;
    }): Promise<GocardlessAssociation>;
    cancelGocardlessMandate(mandateId: number, body: {
        reason: string;
    }): Promise<GocardlessCancellation>;
    sendGocardlessMailRequest(body: {
        gocardless_mandate_ids: number[];
    }): Promise<GocardlessMailRequest>;
    uploadFile(body: {
        file: Buffer;
        name?: string;
    }): Promise<FileAttachment>;
    createGeneralLedgerExport(body: {
        fiscal_year_id: number;
        period_start?: string;
        period_end?: string;
        is_auxiliary?: boolean;
    }): Promise<ExportTask>;
    getExport(id: number): Promise<ExportTask>;
    createFecExport(body: {
        fiscal_year_id: number;
        period_start?: string;
        period_end?: string;
    }): Promise<ExportTask>;
    createAnalyticalLedgerExport(body: {
        fiscal_year_id: number;
        period_start?: string;
        period_end?: string;
    }): Promise<ExportTask>;
    getCustomerInvoiceChangelogs(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ChangelogEvent>>;
    getSupplierInvoiceChangelogs(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ChangelogEvent>>;
    getCustomerChangelogs(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ChangelogEvent>>;
    getSupplierChangelogs(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ChangelogEvent>>;
    getProductChangelogs(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ChangelogEvent>>;
    getLedgerEntryLineChangelogs(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ChangelogEvent>>;
    getTransactionChangelogs(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ChangelogEvent>>;
    getQuoteChangelogs(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ChangelogEvent>>;
    listPurchaseRequests(query?: {
        cursor?: string;
        limit?: number;
        filter?: string;
        sort?: string;
    }): Promise<PaginatedResponse<PurchaseRequest>>;
    getPurchaseRequest(id: number): Promise<PurchaseRequest>;
    importPurchaseRequest(body: {
        file: Buffer;
    }): Promise<PurchaseRequest>;
    importEInvoiceGeneral(body: {
        file: Buffer;
    }): Promise<EInvoiceImport>;
    listProAccountMandateRequests(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ProAccountMandateRequest>>;
    listProAccountMandateMigrations(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ProAccountMandateMigration>>;
    listProAccountMandates(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<ProAccountMandate>>;
    getMe(): Promise<MeUser>;
    listCustomerInvoiceTemplates(query?: {
        cursor?: string;
        limit?: number;
    }): Promise<PaginatedResponse<CustomerInvoiceTemplate>>;
}
