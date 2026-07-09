export interface PageInfo {
    next?: string | null;
    previous?: string | null;
}
export interface PaginatedResponse<T> {
    items: T[];
    page_info: PageInfo;
}
export interface BankAccount {
    id: number;
    name: string;
    last_four: string | null;
    bank_name: string | null;
    iban: string | null;
    bic: string | null;
    currency: string;
    created_at: string;
    updated_at: string;
}
export interface BankEstablishment {
    id: number;
    name: string;
    bic: string;
    country: string;
}
export interface BillingSubscription {
    id: number;
    name: string;
    customer_id: number;
    status: string;
    next_invoice_date: string | null;
    created_at: string;
    updated_at: string;
}
export interface BillingSubscriptionInvoiceLineSection {
    id: number;
    name: string;
    billing_subscription_id: number;
    created_at: string;
    updated_at: string;
}
export interface BillingSubscriptionInvoiceLine {
    id: number;
    billing_subscription_id: number;
    invoice_line_section_id: number;
    quantity: number;
    unit_amount: string;
    currency: string;
    currency_amount: string;
    created_at: string;
    updated_at: string;
}
export interface CategoryGroup {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
export interface Category {
    id: number;
    name: string;
    color: string;
    category_group_id: number | null;
    created_at: string;
    updated_at: string;
}
export interface Customer {
    id: number;
    type: string;
    name: string;
    email: string | null;
    phone: string | null;
    vat_number: string | null;
    external_reference: string | null;
    created_at: string;
    updated_at: string;
}
export interface CompanyCustomer {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    vat_number: string | null;
    external_reference: string | null;
    postal_address: {
        address: string;
        postal_code: string;
        city: string;
        country_alpha2: string;
    } | null;
    created_at: string;
    updated_at: string;
}
export interface IndividualCustomer {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    external_reference: string | null;
    created_at: string;
    updated_at: string;
}
export interface CustomerContact {
    id: number;
    customer_id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
}
export interface Supplier {
    id: number;
    name: string;
    reg_no: string | null;
    establishment_no: string | null;
    vat_number: string | null;
    email: string | null;
    iban: string | null;
    postal_address: {
        address: string;
        postal_code: string;
        city: string;
        country_alpha2: string;
    } | null;
    external_reference: string | null;
    created_at: string;
    updated_at: string;
}
export interface Journal {
    id: number;
    name: string;
    code: string;
    type: string;
    created_at: string;
    updated_at: string;
}
export interface LedgerAccount {
    id: number;
    number: string;
    name: string;
    code: string | null;
    created_at: string;
    updated_at: string;
}
export interface LedgerEntry {
    id: number;
    journal_id: number;
    reference: string;
    date: string;
    status: string;
    label: string | null;
    created_at: string;
    updated_at: string;
}
export interface LedgerEntryLine {
    id: number;
    ledger_entry_id: number;
    label: string | null;
    amount: string;
    currency: string;
    currency_amount: string;
    ledger_account_id: number;
    created_at: string;
    updated_at: string;
}
export interface CustomerInvoice {
    id: number;
    number: string | null;
    customer_id: number;
    status: string;
    date: string;
    deadline: string | null;
    currency: string;
    currency_amount: string;
    currency_amount_before_tax: string;
    currency_tax: string;
    amount: string;
    tax: string;
    external_reference: string | null;
    created_at: string;
    updated_at: string;
}
export interface CustomerInvoiceLine {
    id: number;
    customer_invoice_id: number;
    label: string;
    description: string | null;
    quantity: number;
    unit_amount: string;
    currency: string;
    currency_amount: string;
    currency_tax: string;
    vat_rate: string;
    ledger_account_id: number;
    created_at: string;
    updated_at: string;
}
export interface CustomerInvoiceLineSection {
    id: number;
    customer_invoice_id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
export interface CustomerInvoiceAppendix {
    id: number;
    customer_invoice_id: number;
    name: string;
    file_url: string;
    created_at: string;
    updated_at: string;
}
export interface CustomerInvoicePayment {
    id: number;
    customer_invoice_id: number;
    amount: string;
    currency: string;
    date: string;
    created_at: string;
    updated_at: string;
}
export interface CustomerInvoiceMatchedTransaction {
    id: number;
    transaction_id: number;
    created_at: string;
    updated_at: string;
}
export interface CustomerInvoiceCustomHeaderField {
    id: number;
    customer_invoice_id: number;
    name: string;
    value: string;
    created_at: string;
    updated_at: string;
}
export interface SupplierInvoice {
    id: number;
    number: string | null;
    supplier_id: number;
    status: string;
    date: string;
    deadline: string | null;
    currency: string;
    currency_amount: string;
    currency_amount_before_tax: string;
    currency_tax: string;
    amount: string;
    tax: string;
    external_reference: string | null;
    created_at: string;
    updated_at: string;
}
export interface SupplierInvoiceLine {
    id: number;
    supplier_invoice_id: number;
    label: string;
    description: string | null;
    quantity: number;
    unit_amount: string;
    currency: string;
    currency_amount: string;
    currency_tax: string;
    vat_rate: string;
    ledger_account_id: number;
    created_at: string;
    updated_at: string;
}
export interface Quote {
    id: number;
    number: string | null;
    customer_id: number;
    status: string;
    date: string;
    deadline: string | null;
    currency: string;
    currency_amount: string;
    currency_amount_before_tax: string;
    currency_tax: string;
    amount: string;
    tax: string;
    external_reference: string | null;
    created_at: string;
    updated_at: string;
}
export interface QuoteAppendix {
    id: number;
    quote_id: number;
    name: string;
    file_url: string;
    created_at: string;
    updated_at: string;
}
export interface QuoteInvoiceLine {
    id: number;
    quote_id: number;
    label: string;
    description: string | null;
    quantity: number;
    unit_amount: string;
    currency: string;
    currency_amount: string;
    currency_tax: string;
    vat_rate: string;
    ledger_account_id: number;
    created_at: string;
    updated_at: string;
}
export interface QuoteInvoiceLineSection {
    id: number;
    quote_id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
export interface CommercialDocument {
    id: number;
    type: string;
    number: string | null;
    customer_id: number | null;
    supplier_id: number | null;
    status: string;
    date: string;
    currency: string;
    currency_amount: string;
    created_at: string;
    updated_at: string;
}
export interface CommercialDocumentAppendix {
    id: number;
    commercial_document_id: number;
    name: string;
    file_url: string;
    created_at: string;
    updated_at: string;
}
export interface CommercialDocumentInvoiceLine {
    id: number;
    commercial_document_id: number;
    label: string;
    description: string | null;
    quantity: number;
    unit_amount: string;
    currency: string;
    currency_amount: string;
    currency_tax: string;
    vat_rate: string;
    ledger_account_id: number;
    created_at: string;
    updated_at: string;
}
export interface CommercialDocumentInvoiceLineSection {
    id: number;
    commercial_document_id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
export interface Transaction {
    id: number;
    bank_account_id: number;
    label: string;
    date: string;
    amount: string;
    currency: string;
    status: string;
    customer_id: number | null;
    supplier_id: number | null;
    created_at: string;
    updated_at: string;
}
export interface Product {
    id: number;
    name: string;
    description: string | null;
    sales_ledger_account_id: number | null;
    purchase_ledger_account_id: number | null;
    vat_rate: string | null;
    sales_amount: string | null;
    purchase_amount: string | null;
    sales_currency: string | null;
    purchase_currency: string | null;
    external_reference: string | null;
    created_at: string;
    updated_at: string;
}
export interface FiscalYear {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface TrialBalance {
    id: number;
    account_number: string;
    account_name: string;
    debit: string;
    credit: string;
    balance: string;
    created_at: string;
    updated_at: string;
}
export interface WebhookSubscription {
    id: number;
    callback_url: string;
    events: string[];
    enabled: boolean;
    disabled_at: string | null;
    created_at: string;
    updated_at: string;
}
export interface SepaMandate {
    id: number;
    customer_id: number;
    bank: string;
    bic: string;
    iban: string;
    sequence_type: string;
    signed_at: string;
    identifier: string;
    created_at: string;
    updated_at: string;
}
export interface GocardlessMandate {
    id: number;
    mandate_id: string;
    customer_id: number;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface GocardlessMailRequest {
    id: number;
    gocardless_mandate_id: number;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface GocardlessCancellation {
    id: number;
    gocardless_mandate_id: number;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface GocardlessAssociation {
    id: number;
    gocardless_mandate_id: number;
    customer_id: number;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface FileAttachment {
    id: number;
    file_url: string;
    name: string;
    size: number;
    mime_type: string;
    created_at: string;
    updated_at: string;
}
export interface ExportTask {
    id: number;
    status: string;
    file_url: string | null;
    created_at: string;
    updated_at: string;
}
export interface ChangelogEvent {
    id: number;
    action: string;
    resource_type: string;
    resource_id: number;
    changes: Record<string, unknown>;
    created_at: string;
}
export interface EInvoiceImport {
    id: number;
    status: string;
    file_url: string | null;
    created_at: string;
    updated_at: string;
}
export interface PurchaseRequest {
    id: number;
    number: string | null;
    supplier_id: number;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface ProAccountMandateRequest {
    id: number;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface ProAccountMandateMigration {
    id: number;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface ProAccountMandate {
    id: number;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface MeUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
}
export interface CustomerInvoiceTemplate {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
export interface CategoryAssignment {
    id: number;
    weight: string;
}
