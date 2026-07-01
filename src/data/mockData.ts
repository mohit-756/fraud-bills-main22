import dummyInvoice from "@/assets/dummy-invoice.jpg";

export interface Bill {
  id: string;
  billNumber: string;
  vendor: string;
  amount: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  fraudScore: "low" | "medium" | "high";
  uploadedBy: string;
  role: "sales" | "vendor";
  description: string;
  comments?: string;
  extractedText?: string;
  documentUrl?: string;
  documentType?: "pdf" | "image";
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  isAIGenerated: boolean;
  appliesTo: "sales" | "vendor" | "both";
  status: "active" | "pending" | "rejected";
}

export interface AttendanceRecord {
  date: string;
  status: "on-duty" | "leave" | "half-day";
}

export interface Notification {
  id: string;
  message: string;
  type: "success" | "warning" | "info";
  time: string;
  date: string;
  read: boolean;
}

export interface APEntry {
  id: string;
  billId: string;
  vendor: string;
  invoiceNumber: string;
  amount: number;
  invoiceDate: string;
  dueDate: string;
  status: "scheduled" | "paid" | "overdue";
  paymentMethod?: string;
}

export interface AREntry {
  id: string;
  invoiceNumber: string;
  party: string;
  partyType: "client" | "vendor";
  reason: string;
  amount: number;
  issuedDate: string;
  dueDate: string;
  status: "invoiced" | "approved" | "received" | "overdue";
  linkedBillId?: string;
}

export interface PayrollEntry {
  id: string;
  billId: string;
  employee: string;
  category: string;
  amount: number;
  submittedDate: string;
  payrollCycle: string;
  status: "scheduled" | "processed" | "on-hold";
}

export const mockBills: Bill[] = [
  { id: "b1", billNumber: "INV-2024-001", vendor: "Acme Corp", amount: 24500, date: "2024-01-15", status: "approved", fraudScore: "low", uploadedBy: "Arjun Mehta", role: "sales", description: "Office supplies Q1", documentUrl: dummyInvoice, documentType: "image", extractedText: "Invoice Number: INV-2024-001\nDate: 15 Mar 2024\nBill To: BillGuard Pvt Ltd\nFrom: Acme Corp\n\nItems:\n1. Paper Reams x50 - ₹5,000\n2. Printer Cartridges x10 - ₹8,500\n3. Stationery Kit x20 - ₹6,000\n4. Filing Supplies - ₹5,000\n\nSubtotal: ₹24,500\nTax (0%): ₹0\nTotal: ₹24,500\n\nPayment Terms: Net 30\nBank: HDFC Bank\nAccount: XXXX-1234" },
  { id: "b2", billNumber: "INV-2024-002", vendor: "TechParts Ltd", amount: 187000, date: "2024-02-10", status: "pending", fraudScore: "high", uploadedBy: "Arjun Mehta", role: "sales", description: "Server equipment", documentUrl: dummyInvoice, documentType: "image", extractedText: "Invoice Number: INV-2024-002\nDate: 18 Mar 2024\nBill To: BillGuard Pvt Ltd\nFrom: TechParts Ltd\n\nItems:\n1. Dell PowerEdge Server x1 - ₹145,000\n2. RAM 64GB Kit x2 - ₹22,000\n3. SSD 1TB NVMe x2 - ₹20,000\n\nSubtotal: ₹187,000\nTax (0%): ₹0\nTotal: ₹187,000\n\nPayment Terms: Net 15\nBank: ICICI Bank\nAccount: XXXX-5678" },
  { id: "b3", billNumber: "INV-2024-003", vendor: "CleanCo Services", amount: 8200, date: "2024-03-20", status: "rejected", fraudScore: "medium", uploadedBy: "Vendor Co.", role: "vendor", description: "Monthly cleaning", documentUrl: dummyInvoice, documentType: "image", comments: "Duplicate submission detected", extractedText: "Invoice Number: INV-2024-003\nDate: 20 Mar 2024\nBill To: BillGuard Pvt Ltd\nFrom: CleanCo Services\n\nServices:\n1. Office Cleaning (March) - ₹5,200\n2. Washroom Supplies - ₹1,500\n3. Floor Polishing - ₹1,500\n\nSubtotal: ₹8,200\nTotal: ₹8,200" },
  { id: "b4", billNumber: "INV-2024-004", vendor: "DataFlow Inc", amount: 45000, date: "2024-04-12", status: "pending", fraudScore: "low", uploadedBy: "Vendor Co.", role: "vendor", description: "API integration services", documentUrl: dummyInvoice, documentType: "image", extractedText: "Invoice Number: INV-2024-004\nDate: 22 Mar 2024\nBill To: BillGuard Pvt Ltd\nFrom: DataFlow Inc\n\nServices:\n1. API Development (40 hrs) - ₹32,000\n2. Integration Testing (10 hrs) - ₹8,000\n3. Documentation - ₹5,000\n\nSubtotal: ₹45,000\nTotal: ₹45,000\n\nPayment Terms: Net 30" },
  { id: "b5", billNumber: "INV-2024-005", vendor: "Acme Corp", amount: 24500, date: "2024-05-05", status: "pending", fraudScore: "high", uploadedBy: "Arjun Mehta", role: "sales", description: "Office supplies Q1 (duplicate?)", documentUrl: dummyInvoice, documentType: "image", extractedText: "Invoice Number: INV-2024-005\nDate: 25 Mar 2024\nBill To: BillGuard Pvt Ltd\nFrom: Acme Corp\n\nItems:\n1. Paper Reams x50 - ₹5,000\n2. Printer Cartridges x10 - ₹8,500\n3. Stationery Kit x20 - ₹6,000\n4. Filing Supplies - ₹5,000\n\nSubtotal: ₹24,500\nTotal: ₹24,500\n\nNote: This appears to be a duplicate of INV-2024-001" },
  { id: "b6", billNumber: "INV-2024-006", vendor: "LogiTrans", amount: 62000, date: "2024-04-20", status: "approved", fraudScore: "low", uploadedBy: "Vendor Co.", role: "vendor", description: "Freight charges March", documentUrl: dummyInvoice, documentType: "image", extractedText: "Invoice Number: INV-2024-006\nDate: 27 Mar 2024\nBill To: BillGuard Pvt Ltd\nFrom: LogiTrans\n\nServices:\n1. Freight Mumbai-Delhi x5 - ₹35,000\n2. Warehousing (March) - ₹15,000\n3. Handling Charges - ₹12,000\n\nSubtotal: ₹62,000\nTotal: ₹62,000" },
  { id: "b7", billNumber: "INV-2024-007", vendor: "QuickFix Repairs", amount: 340000, date: "2024-05-18", status: "pending", fraudScore: "high", uploadedBy: "Arjun Mehta", role: "sales", description: "Emergency maintenance", documentUrl: dummyInvoice, documentType: "image", extractedText: "Invoice Number: INV-2024-007\nDate: 28 Mar 2024\nBill To: BillGuard Pvt Ltd\nFrom: QuickFix Repairs\n\nServices:\n1. Emergency HVAC Repair - ₹180,000\n2. Electrical Panel Replacement - ₹95,000\n3. Plumbing Emergency - ₹45,000\n4. Labour Overtime (24hrs) - ₹20,000\n\nSubtotal: ₹340,000\nTotal: ₹340,000\n\nPriority: Emergency / Urgent" },
  { id: "b8", billNumber: "INV-2024-008", vendor: "GreenLeaf Catering", amount: 15600, date: "2024-06-05", status: "approved", fraudScore: "low", uploadedBy: "Vendor Co.", role: "vendor", description: "Event catering", documentUrl: dummyInvoice, documentType: "image", extractedText: "Invoice Number: INV-2024-008\nDate: 29 Mar 2024\nBill To: BillGuard Pvt Ltd\nFrom: GreenLeaf Catering\n\nServices:\n1. Lunch Buffet (50 pax) - ₹10,000\n2. Snacks & Beverages - ₹3,600\n3. Setup & Service - ₹2,000\n\nSubtotal: ₹15,600\nTotal: ₹15,600" },
];

export const mockAttendance: AttendanceRecord[] = [
  { date: "2024-03-01", status: "on-duty" },
  { date: "2024-03-04", status: "on-duty" },
  { date: "2024-03-05", status: "on-duty" },
  { date: "2024-03-06", status: "leave" },
  { date: "2024-03-07", status: "on-duty" },
  { date: "2024-03-08", status: "on-duty" },
  { date: "2024-03-11", status: "on-duty" },
  { date: "2024-03-12", status: "half-day" },
  { date: "2024-03-13", status: "on-duty" },
  { date: "2024-03-14", status: "on-duty" },
  { date: "2024-03-15", status: "on-duty" },
];

export const mockNotifications: Notification[] = [
  { id: "n1", message: "Bill INV-2024-001 has been approved", type: "success", time: "2h ago", date: "2024-03-15", read: false },
  { id: "n2", message: "Bill INV-2024-003 was rejected: Duplicate detected", type: "warning", time: "5h ago", date: "2024-03-15", read: false },
  { id: "n3", message: "New bill uploaded by Vendor Co.", type: "info", time: "1d ago", date: "2024-03-14", read: true },
  { id: "n4", message: "Bill INV-2024-005 approved by finance team", type: "success", time: "3d ago", date: "2024-03-12", read: true },
  { id: "n5", message: "Monthly report generated for February", type: "info", time: "2w ago", date: "2024-03-01", read: true },
  { id: "n6", message: "Bill INV-2024-002 flagged for review", type: "warning", time: "1m ago", date: "2024-02-18", read: true },
  { id: "n7", message: "Q4 2023 audit completed successfully", type: "success", time: "2m ago", date: "2024-01-15", read: true },
  { id: "n8", message: "System maintenance scheduled", type: "info", time: "3m ago", date: "2023-12-20", read: true },
];

export const mockPolicies: Policy[] = [
  { id: "p1", title: "Duplicate Invoice Detection", description: "All invoices are automatically cross-referenced against existing records. Bills with matching amounts, vendors, and dates within a 30-day window are flagged as potential duplicates and require manual review before approval.", category: "Fraud Prevention", createdAt: "2024-03-01", isAIGenerated: true, appliesTo: "both", status: "active" },
  { id: "p2", title: "High-Value Transaction Threshold", description: "Any single invoice exceeding ₹100,000 requires dual approval from both the department head and the finance controller. Emergency exceptions must be documented with a written justification within 24 hours.", category: "Approval Workflow", createdAt: "2024-03-05", isAIGenerated: true, appliesTo: "both", status: "active" },
  { id: "p3", title: "Vendor Verification Protocol", description: "New vendors must undergo a KYC verification process including PAN validation, GST registration check, and bank account verification before their first invoice can be processed. Re-verification is required annually.", category: "Vendor Management", createdAt: "2024-03-10", isAIGenerated: true, appliesTo: "vendor", status: "active" },
  { id: "p4", title: "Invoice Aging Policy", description: "Invoices pending approval for more than 7 business days are escalated to the finance manager. Invoices older than 30 days without action are automatically flagged as overdue and reported in the weekly compliance digest.", category: "Compliance", createdAt: "2024-03-12", isAIGenerated: true, appliesTo: "both", status: "pending" },
  { id: "p5", title: "Anomalous Amount Detection", description: "AI monitors historical spending patterns per vendor. Invoices that deviate more than 2 standard deviations from the vendor's average billing amount are flagged for review with a detailed anomaly report.", category: "Fraud Prevention", createdAt: "2024-03-15", isAIGenerated: true, appliesTo: "sales", status: "active" },
];

export const mockAPEntries: APEntry[] = [
  { id: "ap1", billId: "b1", vendor: "Acme Corp", invoiceNumber: "INV-2024-001", amount: 24500, invoiceDate: "2024-01-15", dueDate: "2026-06-25", status: "scheduled", paymentMethod: "NEFT" },
  { id: "ap2", billId: "b6", vendor: "LogiTrans", invoiceNumber: "INV-2024-006", amount: 62000, invoiceDate: "2024-04-20", dueDate: "2026-06-12", status: "scheduled", paymentMethod: "RTGS" },
  { id: "ap3", billId: "b8", vendor: "GreenLeaf Catering", invoiceNumber: "INV-2024-008", amount: 15600, invoiceDate: "2024-06-05", dueDate: "2026-06-08", status: "overdue", paymentMethod: "NEFT" },
  { id: "ap4", billId: "x1", vendor: "AWS Cloud Services", invoiceNumber: "AWS-9921", amount: 89000, invoiceDate: "2026-05-28", dueDate: "2026-06-28", status: "scheduled", paymentMethod: "Card" },
  { id: "ap5", billId: "x2", vendor: "Mumbai Water Supply", invoiceNumber: "MWS-4421", amount: 4200, invoiceDate: "2026-05-15", dueDate: "2026-06-05", status: "paid", paymentMethod: "UPI" },
  { id: "ap6", billId: "x3", vendor: "Ola Cabs Corporate", invoiceNumber: "OLA-77821", amount: 18500, invoiceDate: "2026-06-01", dueDate: "2026-06-30", status: "scheduled", paymentMethod: "NEFT" },
];

export const mockAREntries: AREntry[] = [
  { id: "ar1", invoiceNumber: "AR-2026-001", party: "Tata Consultancy", partyType: "client", reason: "Onsite travel reimbursement — Arjun Mehta", amount: 32000, issuedDate: "2026-05-20", dueDate: "2026-06-19", status: "invoiced", linkedBillId: "b2" },
  { id: "ar2", invoiceNumber: "AR-2026-002", party: "Infosys Ltd", partyType: "client", reason: "Client visit hotel + airfare", amount: 47800, issuedDate: "2026-05-10", dueDate: "2026-06-09", status: "approved" },
  { id: "ar3", invoiceNumber: "AR-2026-003", party: "QuickFix Repairs", partyType: "vendor", reason: "Refund — incomplete HVAC repair", amount: 45000, issuedDate: "2026-04-25", dueDate: "2026-05-25", status: "overdue", linkedBillId: "b7" },
  { id: "ar4", invoiceNumber: "AR-2026-004", party: "Wipro Technologies", partyType: "client", reason: "Project travel May 2026", amount: 21500, issuedDate: "2026-05-30", dueDate: "2026-06-29", status: "received" },
  { id: "ar5", invoiceNumber: "AR-2026-005", party: "CleanCo Services", partyType: "vendor", reason: "Damaged equipment replacement", amount: 8200, issuedDate: "2026-06-01", dueDate: "2026-07-01", status: "invoiced", linkedBillId: "b3" },
];

export const mockPayrollEntries: PayrollEntry[] = [
  { id: "pr1", billId: "b1", employee: "Arjun Mehta", category: "Office Supplies", amount: 24500, submittedDate: "2026-05-22", payrollCycle: "2026-06-15", status: "scheduled" },
  { id: "pr2", billId: "b5", employee: "Arjun Mehta", category: "Travel — Hotel", amount: 18200, submittedDate: "2026-05-18", payrollCycle: "2026-06-15", status: "scheduled" },
  { id: "pr3", billId: "px1", employee: "Priya Sharma", category: "Client Lunch", amount: 4800, submittedDate: "2026-05-12", payrollCycle: "2026-05-31", status: "processed" },
  { id: "pr4", billId: "px2", employee: "Rahul Verma", category: "Cab — Client Visit", amount: 2100, submittedDate: "2026-06-03", payrollCycle: "2026-06-15", status: "scheduled" },
  { id: "pr5", billId: "px3", employee: "Sneha Iyer", category: "Conference Registration", amount: 12500, submittedDate: "2026-05-28", payrollCycle: "2026-06-15", status: "on-hold" },
  { id: "pr6", billId: "px4", employee: "Vikram Singh", category: "Team Dinner", amount: 9600, submittedDate: "2026-05-08", payrollCycle: "2026-05-31", status: "processed" },
];
