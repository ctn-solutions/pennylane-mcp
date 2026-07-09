import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { PennyLaneClient } from "./client.js";
const API_KEY = process.env.PENNYLANE_API_KEY;
if (!API_KEY) {
    console.error("PENNYLANE_API_KEY environment variable is required");
    process.exit(1);
}
const client = new PennyLaneClient({ apiKey: API_KEY, baseUrl: process.env.PENNYLANE_BASE_URL });
const server = new McpServer({
    name: "pennylane-mcp",
    version: "1.0.0",
});
function tool(name, description, schema, handler) {
    server.tool(name, description, schema.shape || schema, async (args) => {
        try {
            const result = await handler(args);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: "text", text: `Error: ${message}` }],
                isError: true,
            };
        }
    });
}
const paginationSchema = z.object({
    cursor: z.string().optional().describe("Pagination cursor"),
    limit: z.number().optional().describe("Items per page (max 100)"),
});
const filterSortSchema = z.object({
    cursor: z.string().optional().describe("Pagination cursor"),
    limit: z.number().optional().describe("Items per page (max 100)"),
    filter: z.string().optional().describe("Filter query"),
    sort: z.string().optional().describe("Sort field"),
});
// Bank Accounts
tool("pennylane_list_bank_accounts", "List all bank accounts", paginationSchema, (a) => client.listBankAccounts({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_bank_account", "Retrieve a bank account by ID", z.object({ id: z.number() }), (a) => client.getBankAccount(a.id));
tool("pennylane_create_bank_account", "Create a new bank account", z.object({
    name: z.string(), last_four: z.string().optional(), bank_name: z.string().optional(),
    iban: z.string().optional(), bic: z.string().optional(), currency: z.string().optional(),
}), (a) => client.createBankAccount(a));
// Bank Establishments
tool("pennylane_list_bank_establishments", "List bank establishments", paginationSchema, (a) => client.listBankEstablishments({ cursor: a.cursor, limit: a.limit }));
// Billing Subscriptions
tool("pennylane_list_billing_subscriptions", "List billing subscriptions", filterSortSchema, (a) => client.listBillingSubscriptions({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_billing_subscription", "Get a billing subscription by ID", z.object({ id: z.number() }), (a) => client.getBillingSubscription(a.id));
tool("pennylane_create_billing_subscription", "Create a billing subscription", z.object({
    name: z.string(), customer_id: z.number(),
}), (a) => client.createBillingSubscription(a));
tool("pennylane_update_billing_subscription", "Update a billing subscription", z.object({
    id: z.number(), name: z.string().optional(), customer_id: z.number().optional(),
    next_invoice_date: z.string().optional(),
}), (a) => client.updateBillingSubscription(a.id, a));
tool("pennylane_list_billing_subscription_invoice_line_sections", "List invoice line sections for a billing subscription", z.object({
    billing_subscription_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listBillingSubscriptionInvoiceLineSections(a.billing_subscription_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_list_billing_subscription_invoice_lines", "List invoice lines for a billing subscription", z.object({
    billing_subscription_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listBillingSubscriptionInvoiceLines(a.billing_subscription_id, { cursor: a.cursor, limit: a.limit }));
// Categories
tool("pennylane_list_categories", "List all categories", filterSortSchema, (a) => client.listCategories({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_category", "Get a category by ID", z.object({ id: z.number() }), (a) => client.getCategory(a.id));
tool("pennylane_create_category", "Create a category", z.object({
    name: z.string(), color: z.string().optional(), category_group_id: z.number().optional(),
}), (a) => client.createCategory(a));
tool("pennylane_update_category", "Update a category", z.object({
    id: z.number(), name: z.string().optional(), color: z.string().optional(), category_group_id: z.number().optional(),
}), (a) => client.updateCategory(a.id, a));
// Category Groups
tool("pennylane_list_category_groups", "List all category groups", paginationSchema, (a) => client.listCategoryGroups({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_category_group", "Get a category group by ID", z.object({ id: z.number() }), (a) => client.getCategoryGroup(a.id));
tool("pennylane_list_category_group_categories", "List categories of a category group", z.object({
    category_group_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listCategoryGroupCategories(a.category_group_id, { cursor: a.cursor, limit: a.limit }));
// Customers
tool("pennylane_list_customers", "List all customers (company and individual)", filterSortSchema, (a) => client.listCustomers({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_customer", "Get a customer by ID", z.object({ id: z.number() }), (a) => client.getCustomer(a.id));
tool("pennylane_list_customer_categories", "List categories of a customer", z.object({
    customer_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listCustomerCategories(a.customer_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_update_customer_categories", "Categorize a customer", z.object({
    customer_id: z.number(), categories: z.array(z.object({ id: z.number(), weight: z.string() })),
}), (a) => client.updateCustomerCategories(a.customer_id, a.categories));
tool("pennylane_list_customer_contacts", "List contacts of a customer", z.object({
    customer_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listCustomerContacts(a.customer_id, { cursor: a.cursor, limit: a.limit }));
// Company Customers
tool("pennylane_get_company_customer", "Get a company customer by ID", z.object({ id: z.number() }), (a) => client.getCompanyCustomer(a.id));
tool("pennylane_create_company_customer", "Create a company customer", z.object({
    name: z.string(), email: z.string().optional(), phone: z.string().optional(),
    vat_number: z.string().optional(), external_reference: z.string().optional(),
    postal_address: z.any().optional(),
}), (a) => client.createCompanyCustomer(a));
tool("pennylane_update_company_customer", "Update a company customer", z.object({
    id: z.number(), name: z.string().optional(), email: z.string().optional(),
    phone: z.string().optional(), vat_number: z.string().optional(), external_reference: z.string().optional(),
    postal_address: z.any().optional(),
}), (a) => client.updateCompanyCustomer(a.id, a));
// Individual Customers
tool("pennylane_get_individual_customer", "Get an individual customer by ID", z.object({ id: z.number() }), (a) => client.getIndividualCustomer(a.id));
tool("pennylane_create_individual_customer", "Create an individual customer", z.object({
    first_name: z.string(), last_name: z.string(), email: z.string().optional(),
    phone: z.string().optional(), external_reference: z.string().optional(),
}), (a) => client.createIndividualCustomer(a));
tool("pennylane_update_individual_customer", "Update an individual customer", z.object({
    id: z.number(), first_name: z.string().optional(), last_name: z.string().optional(),
    email: z.string().optional(), phone: z.string().optional(), external_reference: z.string().optional(),
}), (a) => client.updateIndividualCustomer(a.id, a));
// Suppliers
tool("pennylane_list_suppliers", "List all suppliers", filterSortSchema, (a) => client.listSuppliers({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_supplier", "Get a supplier by ID", z.object({ id: z.number() }), (a) => client.getSupplier(a.id));
tool("pennylane_create_supplier", "Create a supplier", z.object({
    name: z.string(), establishment_no: z.string().optional(), reg_no: z.string().optional(),
    vat_number: z.string().optional(), emails: z.array(z.string()).optional(), iban: z.string().optional(),
    postal_address: z.any().optional(), supplier_payment_method: z.string().optional(),
    supplier_due_date_delay: z.number().optional(), supplier_due_date_rule: z.string().optional(),
    external_reference: z.string().optional(),
}), (a) => client.createSupplier(a));
tool("pennylane_update_supplier", "Update a supplier", z.object({
    id: z.number(), name: z.string().optional(), establishment_no: z.string().optional(),
    reg_no: z.string().optional(), vat_number: z.string().optional(), emails: z.array(z.string()).optional(),
    iban: z.string().optional(), postal_address: z.any().optional(), supplier_payment_method: z.string().optional(),
    supplier_due_date_delay: z.number().optional(), supplier_due_date_rule: z.string().optional(),
    external_reference: z.string().optional(),
}), (a) => client.updateSupplier(a.id, a));
tool("pennylane_list_supplier_categories", "List categories of a supplier", z.object({
    supplier_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listSupplierCategories(a.supplier_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_update_supplier_categories", "Categorize a supplier", z.object({
    supplier_id: z.number(), categories: z.array(z.object({ id: z.number(), weight: z.string() })),
}), (a) => client.updateSupplierCategories(a.supplier_id, a.categories));
// Journals
tool("pennylane_list_journals", "List all journals", filterSortSchema, (a) => client.listJournals({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_journal", "Get a journal by ID", z.object({ id: z.number() }), (a) => client.getJournal(a.id));
tool("pennylane_create_journal", "Create a journal", z.object({
    name: z.string(), code: z.string(), type: z.string(),
}), (a) => client.createJournal(a));
// Ledger Accounts
tool("pennylane_list_ledger_accounts", "List all ledger accounts", filterSortSchema, (a) => client.listLedgerAccounts({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_ledger_account", "Get a ledger account by ID", z.object({ id: z.number() }), (a) => client.getLedgerAccount(a.id));
tool("pennylane_create_ledger_account", "Create a ledger account", z.object({
    number: z.string(), name: z.string(), code: z.string().optional(),
}), (a) => client.createLedgerAccount(a));
tool("pennylane_update_ledger_account", "Update a ledger account", z.object({
    id: z.number(), number: z.string().optional(), name: z.string().optional(), code: z.string().optional(),
}), (a) => client.updateLedgerAccount(a.id, a));
// Ledger Entries
tool("pennylane_list_ledger_entries", "List all ledger entries", filterSortSchema, (a) => client.listLedgerEntries({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_ledger_entry", "Get a ledger entry by ID", z.object({ id: z.number() }), (a) => client.getLedgerEntry(a.id));
tool("pennylane_create_ledger_entry", "Create a ledger entry", z.object({
    journal_id: z.number(), date: z.string(), reference: z.string(), label: z.string().optional(),
}), (a) => client.createLedgerEntry(a));
// Ledger Entry Lines
tool("pennylane_list_ledger_entry_lines", "List lines for a ledger entry", z.object({
    ledger_entry_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listLedgerEntryLines(a.ledger_entry_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_ledger_entry_line", "Get a ledger entry line by ID", z.object({ id: z.number() }), (a) => client.getLedgerEntryLine(a.id));
tool("pennylane_create_ledger_entry_line", "Create a ledger entry line", z.object({
    ledger_entry_id: z.number(), label: z.string().optional(), amount: z.string(),
    currency: z.string(), currency_amount: z.string(), ledger_account_id: z.number(),
}), (a) => client.createLedgerEntryLine(a));
tool("pennylane_get_ledger_entry_line_lettering", "Get lettered lines for a ledger entry line", z.object({
    ledger_entry_line_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.getLedgerEntryLineLettering(a.ledger_entry_line_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_letter_ledger_entry_lines", "Letter (reconcile) ledger entry lines", z.object({
    ledger_entry_line_ids: z.array(z.number()),
}), (a) => client.letterLedgerEntryLines(a));
tool("pennylane_list_ledger_entry_line_categories", "List categories of a ledger entry line", z.object({
    ledger_entry_line_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.getLedgerEntryLineCategories(a.ledger_entry_line_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_update_ledger_entry_line_categories", "Categorize a ledger entry line", z.object({
    ledger_entry_line_id: z.number(), categories: z.array(z.object({ id: z.number(), weight: z.string() })),
}), (a) => client.updateLedgerEntryLineCategories(a.ledger_entry_line_id, a.categories));
tool("pennylane_upload_ledger_attachment", "Upload a file attachment to a ledger entry", z.object({
    file_attachment_id: z.number(), ledger_entry_id: z.number(),
}), (a) => client.uploadLedgerAttachment(a));
// Customer Invoices
tool("pennylane_list_customer_invoices", "List all customer invoices", filterSortSchema, (a) => client.listCustomerInvoices({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_customer_invoice", "Get a customer invoice by ID", z.object({ id: z.number() }), (a) => client.getCustomerInvoice(a.id));
tool("pennylane_create_customer_invoice", "Create a customer invoice", z.object({
    customer_id: z.number(), date: z.string(), deadline: z.string().optional(),
    currency: z.string().optional(), external_reference: z.string().optional(),
    label: z.string().optional(), invoice_lines: z.any(),
}), (a) => client.createCustomerInvoice(a));
tool("pennylane_update_customer_invoice", "Update a customer invoice", z.object({
    id: z.number(), customer_id: z.number().optional(), date: z.string().optional(),
    deadline: z.string().optional(), currency: z.string().optional(), external_reference: z.string().optional(),
    label: z.string().optional(), invoice_lines: z.any().optional(),
}), (a) => client.updateCustomerInvoice(a.id, a));
tool("pennylane_delete_customer_invoice", "Delete a draft customer invoice", z.object({ id: z.number() }), async (a) => { await client.deleteCustomerInvoice(a.id); return { success: true }; });
tool("pennylane_finalize_customer_invoice", "Finalize a draft customer invoice", z.object({ id: z.number() }), (a) => client.finalizeCustomerInvoice(a.id));
tool("pennylane_mark_customer_invoice_paid", "Mark a customer invoice as paid", z.object({ id: z.number() }), (a) => client.markAsPaid(a.id));
tool("pennylane_send_customer_invoice_by_email", "Send a customer invoice by email", z.object({
    id: z.number(), recipients: z.array(z.string()).optional(),
}), (a) => client.sendByEmail(a.id, { recipients: a.recipients }));
tool("pennylane_send_customer_invoice_to_pa", "Send a customer e-invoice to PA", z.object({ id: z.number() }), (a) => client.sendToPa(a.id));
tool("pennylane_import_customer_invoice", "Import a customer invoice with file attachment", z.object({
    file_attachment_id: z.number(), supplier_id: z.number().optional(),
    import_as_incomplete: z.boolean().optional(), date: z.string().optional(),
    deadline: z.string().optional(), invoice_number: z.string().optional(),
    currency: z.string().optional(), currency_amount_before_tax: z.string().optional(),
    currency_amount: z.string().optional(), currency_tax: z.string().optional(),
    label: z.string().optional(), transaction_reference: z.any().optional(),
    invoice_lines: z.any().optional(), external_reference: z.string().optional(),
}), (a) => client.importCustomerInvoice(a));
tool("pennylane_import_customer_einvoice", "Import a customer e-invoice from file (XML/CII)", z.object({
    file: z.string().describe("Base64 encoded file content"),
    invoice_options: z.any().optional(),
}), (a) => {
    const buf = Buffer.from(a.file, 'base64');
    return client.importEInvoice({ file: buf, invoice_options: a.invoice_options });
});
tool("pennylane_create_customer_invoice_from_quote", "Create a customer invoice from a quote", z.object({
    quote_id: z.number(),
}), (a) => client.createFromQuote(a.quote_id));
tool("pennylane_link_credit_note", "Link a credit note to a customer invoice", z.object({
    id: z.number(), credit_note_id: z.number(),
}), (a) => client.linkCreditNote(a.id, { credit_note_id: a.credit_note_id }));
tool("pennylane_update_customer_invoice_imported", "Update the imported status of a customer invoice", z.object({
    id: z.number(), status: z.string(),
}), (a) => client.updateImported(a.id, { status: a.status }));
// Customer Invoice sub-resources
tool("pennylane_list_customer_invoice_lines", "List invoice lines for a customer invoice", z.object({
    customer_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listCustomerInvoiceLines(a.customer_invoice_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
tool("pennylane_list_customer_invoice_line_sections", "List invoice line sections for a customer invoice", z.object({
    customer_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listCustomerInvoiceLineSections(a.customer_invoice_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
tool("pennylane_list_customer_invoice_appendices", "List appendices of a customer invoice", z.object({
    customer_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listCustomerInvoiceAppendices(a.customer_invoice_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_upload_customer_invoice_appendix", "Upload an appendix for a customer invoice", z.object({
    customer_invoice_id: z.number(), file: z.string().describe("Base64 encoded file"),
}), (a) => {
    const buf = Buffer.from(a.file, 'base64');
    return client.uploadCustomerInvoiceAppendix(a.customer_invoice_id, buf);
});
tool("pennylane_list_customer_invoice_categories", "List categories of a customer invoice", z.object({
    customer_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listCustomerInvoiceCategories(a.customer_invoice_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_update_customer_invoice_categories", "Categorize a customer invoice", z.object({
    customer_invoice_id: z.number(), categories: z.array(z.object({ id: z.number(), weight: z.string() })),
}), (a) => client.updateCustomerInvoiceCategories(a.customer_invoice_id, a.categories));
tool("pennylane_list_customer_invoice_matched_transactions", "List matched transactions for a customer invoice", z.object({
    customer_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listCustomerInvoiceMatchedTransactions(a.customer_invoice_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
tool("pennylane_match_customer_invoice_transaction", "Match a transaction to a customer invoice", z.object({
    customer_invoice_id: z.number(), transaction_id: z.number(),
}), (a) => client.matchCustomerInvoiceTransaction(a.customer_invoice_id, { transaction_id: a.transaction_id }));
tool("pennylane_unmatch_customer_invoice_transaction", "Unmatch a transaction from a customer invoice", z.object({
    customer_invoice_id: z.number(), transaction_id: z.number(),
}), async (a) => { await client.unmatchCustomerInvoiceTransaction(a.customer_invoice_id, a.transaction_id); return { success: true }; });
tool("pennylane_list_customer_invoice_payments", "List payments for a customer invoice", z.object({
    customer_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listCustomerInvoicePayments(a.customer_invoice_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
tool("pennylane_list_customer_invoice_custom_header_fields", "List custom header fields for a customer invoice", z.object({
    customer_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listCustomerInvoiceCustomHeaderFields(a.customer_invoice_id, { cursor: a.cursor, limit: a.limit }));
// Supplier Invoices
tool("pennylane_list_supplier_invoices", "List all supplier invoices", filterSortSchema, (a) => client.listSupplierInvoices({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_supplier_invoice", "Get a supplier invoice by ID", z.object({ id: z.number() }), (a) => client.getSupplierInvoice(a.id));
tool("pennylane_update_supplier_invoice", "Update a supplier invoice", z.object({
    id: z.number(), supplier_id: z.number().optional(), date: z.string().optional(),
    deadline: z.string().optional(), invoice_number: z.string().optional(), label: z.string().optional(),
    currency: z.string().optional(), currency_amount_before_tax: z.string().optional(),
    currency_amount: z.string().optional(), currency_tax: z.string().optional(),
    amount: z.string().optional(), tax: z.string().optional(), transaction_reference: z.any().optional(),
    invoice_lines: z.any().optional(), external_reference: z.string().optional(),
}), (a) => client.updateSupplierInvoice(a.id, a));
tool("pennylane_list_supplier_invoice_lines", "List invoice lines for a supplier invoice", z.object({
    supplier_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listSupplierInvoiceLines(a.supplier_invoice_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
tool("pennylane_list_supplier_invoice_categories", "List categories of a supplier invoice", z.object({
    supplier_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listSupplierInvoiceCategories(a.supplier_invoice_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_update_supplier_invoice_categories", "Categorize a supplier invoice", z.object({
    supplier_invoice_id: z.number(), categories: z.array(z.object({ id: z.number(), weight: z.string() })),
}), (a) => client.updateSupplierInvoiceCategories(a.supplier_invoice_id, a.categories));
tool("pennylane_list_supplier_invoice_payments", "List payments for a supplier invoice", z.object({
    supplier_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listSupplierInvoicePayments(a.supplier_invoice_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
tool("pennylane_update_supplier_invoice_payment_status", "Update payment status of a supplier invoice", z.object({
    supplier_invoice_id: z.number(), payment_status: z.enum(["paid", "to_be_paid"]),
}), (a) => client.updateSupplierInvoicePaymentStatus(a.supplier_invoice_id, { payment_status: a.payment_status }));
tool("pennylane_list_supplier_invoice_matched_transactions", "List matched transactions for a supplier invoice", z.object({
    supplier_invoice_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listSupplierInvoiceMatchedTransactions(a.supplier_invoice_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
tool("pennylane_match_supplier_invoice_transaction", "Match a transaction to a supplier invoice", z.object({
    supplier_invoice_id: z.number(), transaction_id: z.number(),
}), (a) => client.matchSupplierInvoiceTransaction(a.supplier_invoice_id, { transaction_id: a.transaction_id }));
tool("pennylane_unmatch_supplier_invoice_transaction", "Unmatch a transaction from a supplier invoice", z.object({
    supplier_invoice_id: z.number(), transaction_id: z.number(),
}), async (a) => { await client.unmatchSupplierInvoiceTransaction(a.supplier_invoice_id, a.transaction_id); return { success: true }; });
tool("pennylane_link_supplier_invoice_purchase_request", "Link a purchase request to a supplier invoice", z.object({
    supplier_invoice_id: z.number(), purchase_request_id: z.number(),
}), (a) => client.linkSupplierInvoicePurchaseRequest(a.supplier_invoice_id, { purchase_request_id: a.purchase_request_id }));
tool("pennylane_update_supplier_invoice_einvoice_status", "Update e-invoice status for a supplier invoice", z.object({
    supplier_invoice_id: z.number(), status: z.enum(["disputed", "refused", "approved"]),
    reason: z.string().optional(),
}), (a) => client.updateSupplierInvoiceEInvoiceStatus(a.supplier_invoice_id, { status: a.status, reason: a.reason }));
tool("pennylane_validate_supplier_invoice_accounting", "Validate the accounting of a supplier invoice", z.object({ id: z.number() }), (a) => client.validateSupplierInvoiceAccounting(a.id));
tool("pennylane_import_supplier_invoice", "Import a supplier invoice with file attachment", z.object({
    file_attachment_id: z.number(), supplier_id: z.number(), date: z.string(), deadline: z.string(),
    currency_amount_before_tax: z.string(), currency_amount: z.string(), currency_tax: z.string(),
    invoice_lines: z.any(), import_as_incomplete: z.boolean().optional(),
    invoice_number: z.string().optional(), currency: z.string().optional(), external_reference: z.string().optional(),
}), (a) => client.importSupplierInvoice(a));
tool("pennylane_import_supplier_einvoice", "Import a supplier e-invoice from file", z.object({
    file: z.string().describe("Base64 encoded file"),
    invoice_options: z.any().optional(),
}), (a) => {
    const buf = Buffer.from(a.file, 'base64');
    return client.importSupplierEInvoice({ file: buf, invoice_options: a.invoice_options });
});
// Quotes
tool("pennylane_list_quotes", "List all quotes", filterSortSchema, (a) => client.listQuotes({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_quote", "Get a quote by ID", z.object({ id: z.number() }), (a) => client.getQuote(a.id));
tool("pennylane_send_quote_by_email", "Send a quote by email", z.object({
    id: z.number(), recipients: z.array(z.string()).optional(),
}), (a) => client.sendQuoteByEmail(a.id, { recipients: a.recipients }));
tool("pennylane_update_quote_status", "Update the status of a quote", z.object({
    id: z.number(), status: z.enum(["pending", "accepted", "denied", "invoiced", "expired"]),
}), (a) => client.updateQuoteStatus(a.id, { status: a.status }));
tool("pennylane_list_quote_appendices", "List appendices of a quote", z.object({
    quote_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listQuoteAppendices(a.quote_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_upload_quote_appendix", "Upload an appendix for a quote", z.object({
    quote_id: z.number(), file: z.string().describe("Base64 encoded file"),
}), (a) => {
    const buf = Buffer.from(a.file, 'base64');
    return client.uploadQuoteAppendix(a.quote_id, buf);
});
tool("pennylane_list_quote_invoice_lines", "List invoice lines for a quote", z.object({
    quote_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listQuoteInvoiceLines(a.quote_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
tool("pennylane_list_quote_invoice_line_sections", "List invoice line sections for a quote", z.object({
    quote_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listQuoteInvoiceLineSections(a.quote_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
// Commercial Documents
tool("pennylane_list_commercial_documents", "List all commercial documents", filterSortSchema, (a) => client.listCommercialDocuments({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_commercial_document", "Get a commercial document by ID", z.object({ id: z.number() }), (a) => client.getCommercialDocument(a.id));
tool("pennylane_list_commercial_document_appendices", "List appendices of a commercial document", z.object({
    commercial_document_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listCommercialDocumentAppendices(a.commercial_document_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_upload_commercial_document_appendix", "Upload an appendix for a commercial document", z.object({
    commercial_document_id: z.number(), file: z.string().describe("Base64 encoded file"),
}), (a) => {
    const buf = Buffer.from(a.file, 'base64');
    return client.uploadCommercialDocumentAppendix(a.commercial_document_id, buf);
});
tool("pennylane_list_commercial_document_invoice_lines", "List invoice lines for a commercial document", z.object({
    commercial_document_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listCommercialDocumentInvoiceLines(a.commercial_document_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
tool("pennylane_list_commercial_document_invoice_line_sections", "List invoice line sections for a commercial document", z.object({
    commercial_document_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(), sort: z.string().optional(),
}), (a) => client.listCommercialDocumentInvoiceLineSections(a.commercial_document_id, { cursor: a.cursor, limit: a.limit, sort: a.sort }));
// Transactions
tool("pennylane_list_transactions", "List all transactions", filterSortSchema, (a) => client.listTransactions({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_transaction", "Get a transaction by ID", z.object({ id: z.number() }), (a) => client.getTransaction(a.id));
tool("pennylane_create_transaction", "Create a transaction", z.object({
    bank_account_id: z.number(), label: z.string(), date: z.string(), amount: z.string(),
    fee: z.string().optional(),
}), (a) => client.createTransaction(a));
tool("pennylane_update_transaction", "Update a transaction", z.object({
    id: z.number(), customer_id: z.number().optional(), supplier_id: z.number().optional(),
}), (a) => client.updateTransaction(a.id, a));
tool("pennylane_list_transaction_categories", "List categories of a bank transaction", z.object({
    transaction_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listTransactionCategories(a.transaction_id, { cursor: a.cursor, limit: a.limit }));
tool("pennylane_update_transaction_categories", "Categorize a bank transaction", z.object({
    transaction_id: z.number(), categories: z.array(z.object({ id: z.number(), weight: z.string() })),
}), (a) => client.updateTransactionCategories(a.transaction_id, a.categories));
tool("pennylane_list_transaction_matched_invoices", "List invoices matched to a bank transaction", z.object({
    transaction_id: z.number(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.listTransactionMatchedInvoices(a.transaction_id, { cursor: a.cursor, limit: a.limit }));
// Products
tool("pennylane_list_products", "List all products", filterSortSchema, (a) => client.listProducts({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_product", "Get a product by ID", z.object({ id: z.number() }), (a) => client.getProduct(a.id));
tool("pennylane_update_product", "Update a product", z.object({
    id: z.number(), name: z.string().optional(), description: z.string().optional(),
    sales_ledger_account_id: z.number().optional(), purchase_ledger_account_id: z.number().optional(),
    vat_rate: z.string().optional(), sales_amount: z.string().optional(), purchase_amount: z.string().optional(),
    sales_currency: z.string().optional(), purchase_currency: z.string().optional(), external_reference: z.string().optional(),
}), (a) => client.updateProduct(a.id, a));
// Fiscal Years
tool("pennylane_list_fiscal_years", "List all fiscal years", paginationSchema, (a) => client.listFiscalYears({ cursor: a.cursor, limit: a.limit }));
// Trial Balance
tool("pennylane_get_trial_balance", "Get the trial balance", z.object({
    period_start: z.string(), period_end: z.string(),
    is_auxiliary: z.boolean().optional(), cursor: z.string().optional(), limit: z.number().optional(),
}), (a) => client.getTrialBalance(a));
// Webhook Subscriptions
tool("pennylane_list_webhook_subscriptions", "List all webhook subscriptions", paginationSchema, (a) => client.listWebhookSubscriptions({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_webhook_subscription", "Get a webhook subscription by ID", z.object({ id: z.number() }), (a) => client.getWebhookSubscription(a.id));
tool("pennylane_create_webhook_subscription", "Create a webhook subscription", z.object({
    callback_url: z.string(), events: z.array(z.string()), enabled: z.boolean().optional(),
}), (a) => client.createWebhookSubscription(a));
tool("pennylane_update_webhook_subscription", "Update a webhook subscription", z.object({
    id: z.number(), callback_url: z.string().optional(), events: z.array(z.string()).optional(),
    enabled: z.boolean().optional(),
}), (a) => client.updateWebhookSubscription(a.id, a));
tool("pennylane_delete_webhook_subscription", "Delete a webhook subscription", z.object({ id: z.number() }), async (a) => { await client.deleteWebhookSubscription(a.id); return { success: true }; });
// SEPA Mandates
tool("pennylane_list_sepa_mandates", "List all SEPA mandates", filterSortSchema, (a) => client.listSepaMandates({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_sepa_mandate", "Get a SEPA mandate by ID", z.object({ id: z.number() }), (a) => client.getSepaMandate(a.id));
tool("pennylane_create_sepa_mandate", "Create a SEPA mandate", z.object({
    bank: z.string(), bic: z.string(), iban: z.string(), signed_at: z.string(),
    identifier: z.string(), customer_id: z.number(),
    sequence_type: z.enum(["FRST", "OOFF", "RCUR", "FNAL"]).optional(),
}), (a) => client.createSepaMandate(a));
tool("pennylane_update_sepa_mandate", "Update a SEPA mandate", z.object({
    id: z.number(), bank: z.string().optional(), bic: z.string().optional(), iban: z.string().optional(),
    signed_at: z.string().optional(), identifier: z.string().optional(), customer_id: z.number().optional(),
    sequence_type: z.enum(["FRST", "OOFF", "RCUR", "FNAL"]).optional(),
}), (a) => client.updateSepaMandate(a.id, a));
tool("pennylane_delete_sepa_mandate", "Delete a SEPA mandate", z.object({ id: z.number() }), async (a) => { await client.deleteSepaMandate(a.id); return { success: true }; });
// GoCardless Mandates
tool("pennylane_list_gocardless_mandates", "List all GoCardless mandates", paginationSchema, (a) => client.listGocardlessMandates({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_gocardless_mandate", "Get a GoCardless mandate by ID", z.object({ id: z.number() }), (a) => client.getGocardlessMandate(a.id));
tool("pennylane_associate_gocardless_mandate", "Associate a GoCardless mandate to a customer", z.object({
    mandate_id: z.number(), customer_id: z.number(),
}), (a) => client.associateGocardlessMandate(a.mandate_id, { customer_id: a.customer_id }));
tool("pennylane_cancel_gocardless_mandate", "Cancel a GoCardless mandate", z.object({
    mandate_id: z.number(), reason: z.string(),
}), (a) => client.cancelGocardlessMandate(a.mandate_id, { reason: a.reason }));
tool("pennylane_send_gocardless_mail_request", "Send a GoCardless mandate email request", z.object({
    gocardless_mandate_ids: z.array(z.number()),
}), (a) => client.sendGocardlessMailRequest({ gocardless_mandate_ids: a.gocardless_mandate_ids }));
// File Attachments
tool("pennylane_upload_file", "Upload a file attachment", z.object({
    file: z.string().describe("Base64 encoded file"),
    name: z.string().optional(),
}), (a) => {
    const buf = Buffer.from(a.file, 'base64');
    return client.uploadFile({ file: buf, name: a.name });
});
// Exports
tool("pennylane_create_general_ledger_export", "Create a General Ledger export", z.object({
    fiscal_year_id: z.number(), period_start: z.string().optional(),
    period_end: z.string().optional(), is_auxiliary: z.boolean().optional(),
}), (a) => client.createGeneralLedgerExport(a));
tool("pennylane_get_export", "Get an export by ID", z.object({ id: z.number() }), (a) => client.getExport(a.id));
tool("pennylane_create_fec_export", "Create a FEC export", z.object({
    fiscal_year_id: z.number(), period_start: z.string().optional(), period_end: z.string().optional(),
}), (a) => client.createFecExport(a));
tool("pennylane_create_analytical_ledger_export", "Create an Analytical General Ledger export", z.object({
    fiscal_year_id: z.number(), period_start: z.string().optional(), period_end: z.string().optional(),
}), (a) => client.createAnalyticalLedgerExport(a));
// Changelogs
tool("pennylane_get_customer_invoice_changelogs", "Get customer invoice change events", paginationSchema, (a) => client.getCustomerInvoiceChangelogs({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_supplier_invoice_changelogs", "Get supplier invoice change events", paginationSchema, (a) => client.getSupplierInvoiceChangelogs({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_customer_changelogs", "Get customer change events", paginationSchema, (a) => client.getCustomerChangelogs({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_supplier_changelogs", "Get supplier change events", paginationSchema, (a) => client.getSupplierChangelogs({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_product_changelogs", "Get product change events", paginationSchema, (a) => client.getProductChangelogs({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_ledger_entry_line_changelogs", "Get ledger entry line change events", paginationSchema, (a) => client.getLedgerEntryLineChangelogs({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_transaction_changelogs", "Get transaction change events", paginationSchema, (a) => client.getTransactionChangelogs({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_get_quote_changelogs", "Get quote change events", paginationSchema, (a) => client.getQuoteChangelogs({ cursor: a.cursor, limit: a.limit }));
// Purchase Requests
tool("pennylane_list_purchase_requests", "List all purchase requests", filterSortSchema, (a) => client.listPurchaseRequests({ cursor: a.cursor, limit: a.limit, filter: a.filter, sort: a.sort }));
tool("pennylane_get_purchase_request", "Get a purchase request by ID", z.object({ id: z.number() }), (a) => client.getPurchaseRequest(a.id));
tool("pennylane_import_purchase_request", "Import a purchase request from file", z.object({
    file: z.string().describe("Base64 encoded file"),
}), (a) => {
    const buf = Buffer.from(a.file, 'base64');
    return client.importPurchaseRequest({ file: buf });
});
// E-Invoices
tool("pennylane_import_einvoice", "Import e-invoices (generic)", z.object({
    file: z.string().describe("Base64 encoded file"),
}), (a) => {
    const buf = Buffer.from(a.file, 'base64');
    return client.importEInvoiceGeneral({ file: buf });
});
// Pro Account
tool("pennylane_list_pro_account_mandate_requests", "List pro account mandate requests", paginationSchema, (a) => client.listProAccountMandateRequests({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_list_pro_account_mandate_migrations", "List pro account mandate migrations", paginationSchema, (a) => client.listProAccountMandateMigrations({ cursor: a.cursor, limit: a.limit }));
tool("pennylane_list_pro_account_mandates", "List pro account mandates", paginationSchema, (a) => client.listProAccountMandates({ cursor: a.cursor, limit: a.limit }));
// Me
tool("pennylane_get_me", "Get the authenticated user info", z.object({}), () => client.getMe());
// Customer Invoice Templates
tool("pennylane_list_customer_invoice_templates", "List customer invoice templates", paginationSchema, (a) => client.listCustomerInvoiceTemplates({ cursor: a.cursor, limit: a.limit }));
// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("PennyLane MCP server started");
