// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { AuthProvider } from "@/contexts/AuthContext";
// import { AttendanceProvider } from "@/contexts/AttendanceContext";
// import LandingPage from "@/pages/LandingPage";
// import LoginPage from "@/pages/LoginPage";
// import SignupPage from "@/pages/SignupPage";
// import DashboardLayout from "@/components/DashboardLayout";
// import DashboardRedirector from "@/pages/DashboardRedirector";
// import UploadBillPage from "@/pages/UploadBillPage";
// import BillsPage from "@/pages/BillsPage";
// import AllBillsPage from "@/pages/AllBillsPage";
// import FraudDetectionPage from "@/pages/FraudDetectionPage";
// // import AnalyticsPage from "@/pages/AnalyticsPage";
// import AttendancePage from "@/pages/AttendancePage";
// import NotificationsPage from "@/pages/NotificationsPage";
// import PoliciesPage from "@/pages/PoliciesPage";
// import NotFound from "@/pages/NotFound";
// import EscalatedBillsPage from "@/pages/EscalatedBillsPage"
// import ChatbotPage from "@/pages/ChatbotPage";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <BrowserRouter>
//       <AuthProvider>
//         <AttendanceProvider>
//         <TooltipProvider>
//           <Toaster />
//           <Sonner />
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/signup" element={<SignupPage />} />
//             <Route element={<DashboardLayout />}>
//               <Route path="/dashboard" element={<DashboardRedirector />} />
//               <Route path="/upload" element={<UploadBillPage />} />
//               <Route path="/bills" element={<BillsPage />} />
//               <Route path="/all-bills" element={<AllBillsPage />} />
//               <Route path="/fraud" element={<FraudDetectionPage />} />
//               <Route path="/escalated-bills" element={<EscalatedBillsPage />} />
//               <Route path="/chatbot" element={<ChatbotPage />} />
//               {/* <Route path="/analytics" element={<AnalyticsPage />} /> */}
//               <Route path="/attendance" element={<AttendancePage />} />
//               <Route path="/notifications" element={<NotificationsPage />} />
//               <Route path="/policies" element={<PoliciesPage />} />
//             </Route>
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </TooltipProvider>
//         </AttendanceProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   </QueryClientProvider>
// );

// export default App;



import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardRedirector from "@/pages/DashboardRedirector";
import UploadBillPage from "@/pages/UploadBillPage";
import BillsPage from "@/pages/BillsPage";
import AllBillsPage from "@/pages/AllBillsPage";
import FraudDetectionPage from "@/pages/FraudDetectionPage";
// import AnalyticsPage from "@/pages/AnalyticsPage";
import AttendancePage from "@/pages/AttendancePage";
import NotificationsPage from "@/pages/NotificationsPage";
import PoliciesPage from "@/pages/PoliciesPage";
import NotFound from "@/pages/NotFound";
import EscalatedBillsPage from "@/pages/EscalatedBillsPage"
import ChatbotPage from "@/pages/ChatbotPage";
import ClaimReviewPage from "@/pages/ClaimReviewPage";
import AccountsPayable from "@/pages/AccountsPayable";
import AccountsReceivable from "@/pages/AccountsReceivable";
import PayrollReimbursement from "@/pages/PayrollReimbursement"
import VendorPurchaseOrders from "@/pages/VendorPurchaseOrders";
import FinancePurchaseOrders from "@/pages/FinancePurchaseOrders";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HashRouter>
      <AuthProvider>
        <AttendanceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardRedirector />} />
              <Route path="/upload" element={<UploadBillPage />} />
              <Route path="/bills" element={<BillsPage />} />
              <Route path="/all-bills" element={<AllBillsPage />} />
              <Route path="/fraud" element={<FraudDetectionPage />} />
              <Route path="/escalated-bills" element={<EscalatedBillsPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              {/* <Route path="/analytics" element={<AnalyticsPage />} /> */}
              <Route path="/fraud/:uploadId/review" element={<ClaimReviewPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/policies" element={<PoliciesPage />} />
              <Route path="/accounts-payable" element={<AccountsPayable />} />
              <Route path="/accounts-receivable" element={<AccountsReceivable />} />
              <Route path="/payroll-reimbursement" element={<PayrollReimbursement />} />
              <Route path="/purchase-orders-for-vendor" element={<VendorPurchaseOrders />} />
              <Route path="/purchase-orders-for-finance" element={<FinancePurchaseOrders />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
        </AttendanceProvider>
      </AuthProvider>
    </HashRouter>
  </QueryClientProvider>
);

export default App;
