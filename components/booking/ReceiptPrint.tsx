"use client";

interface LineItem {
  label: string;
  amount: number;
}

interface Props {
  bookingCode: string;
  size: string;
  sukkahType: string;
  speedTier: string;
  address: string;
  lineItems: LineItem[];
  total: number;
}

export default function ReceiptPrint({ bookingCode, size, sukkahType, speedTier, address, lineItems, total }: Props) {
  return (
    <div>
      <div className="receipt">
        <p className="eyebrow mb-2">Holiday Brothers — Guest Receipt</p>
        <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          <div className="flex justify-between">
            <span>Confirmation</span>
            <span style={{ color: "var(--text-cream)" }}>{bookingCode}</span>
          </div>
          <div className="flex justify-between">
            <span>Sukkah</span>
            <span style={{ color: "var(--text-cream)" }}>
              {size} {sukkahType}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Speed</span>
            <span style={{ color: "var(--text-cream)" }}>{speedTier}</span>
          </div>
          <div className="flex justify-between">
            <span>Address</span>
            <span className="text-right" style={{ color: "var(--text-cream)" }}>
              {address}
            </span>
          </div>

          <div className="mt-3 border-t pt-2" style={{ borderColor: "var(--panel-border)" }}>
            {lineItems.map((li) => (
              <div className="flex justify-between" key={li.label}>
                <span>{li.label}</span>
                <span style={{ color: li.amount < 0 ? "var(--amber-bright)" : "var(--text-cream)" }}>
                  {li.amount < 0 ? "-" : ""}${Math.abs(li.amount).toFixed(0)}
                </span>
              </div>
            ))}
            <div className="mt-1 flex justify-between font-medium">
              <span style={{ color: "var(--text-cream)" }}>Total</span>
              <span style={{ color: "var(--text-cream)" }}>${total.toFixed(0)}</span>
            </div>
          </div>

          <div className="mt-3 border-t pt-2" style={{ borderColor: "var(--panel-border)" }}>
            <p style={{ color: "var(--text-faint)" }}>Temporary guest login code</p>
            <p className="text-[15px] tracking-widest" style={{ color: "var(--gold-rim)" }}>
              {bookingCode}
            </p>
          </div>
        </div>
      </div>

      <button type="button" className="btn no-print mt-3" onClick={() => window.print()}>
        Print receipt
      </button>
    </div>
  );
}
