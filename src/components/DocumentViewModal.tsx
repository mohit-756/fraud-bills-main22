import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Image } from "lucide-react";
import type { Bill } from "@/data/mockData";

interface DocumentViewModalProps {
  bill: Bill | undefined;
  open: boolean;
  onClose: () => void;
}

export default function DocumentViewModal({ bill, open, onClose }: DocumentViewModalProps) {
  if (!bill) return null;

  const hasDocument = !!bill.documentUrl;
  const isImage = bill.documentType === "image";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-5 gap-3">
        <DialogHeader className="shrink-0 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-base">Document — {bill.billNumber}</DialogTitle>
              <DialogDescription className="text-xs">
                {bill.vendor} · ₹{bill.amount.toLocaleString()} · {bill.date}
              </DialogDescription>
            </div>
            <Badge variant="outline" className="text-xs gap-1">
              {isImage ? <Image className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
              {isImage ? "Image" : "PDF"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden rounded-lg border bg-muted/20">
          {hasDocument ? (
            isImage ? (
              <div className="h-full overflow-y-auto flex items-start justify-center p-4">
                <img
                  src={bill.documentUrl}
                  alt={`Document ${bill.billNumber}`}
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            ) : (
              <iframe
                src={bill.documentUrl}
                className="w-full h-full min-h-[500px]"
                title={`Document ${bill.billNumber}`}
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground gap-3">
              <FileText className="h-12 w-12 opacity-30" />
              <div className="text-center">
                <p className="text-sm font-medium">No document uploaded</p>
                <p className="text-xs mt-1">The original file for this bill is not available.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
