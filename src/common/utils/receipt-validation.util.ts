import { ReceiptDataDto } from '../../dto/receipt-data.dto';

export interface ReceiptTotals {
  itemsTotal: number;
  calculatedTotal: number;
  providedTotal: number;
}

/**
 * Calculates receipt totals for validation purposes
 * @param receiptData - The receipt data containing items, tax, and total
 * @returns Object containing itemsTotal, calculatedTotal, and providedTotal
 */
export function calculateReceiptTotals(
  receiptData: ReceiptDataDto,
): ReceiptTotals {
  const itemsTotal = receiptData.receipt_items.reduce(
    (sum, item) => sum + Number(item.item_cost),
    0,
  );
  const calculatedTotal = Number(itemsTotal) + Number(receiptData.tax);
  const providedTotal = Number(receiptData.total);

  return {
    itemsTotal,
    calculatedTotal,
    providedTotal,
  };
}

/**
 * Validates if the receipt totals match within acceptable tolerance
 * @param totals - The calculated totals object
 * @param tolerance - The acceptable difference (default: 0.01)
 * @returns true if totals match within tolerance, false otherwise
 */
export function validateReceiptTotals(
  totals: ReceiptTotals,
  tolerance: number = 0.01,
): boolean {
  return Math.abs(totals.calculatedTotal - totals.providedTotal) <= tolerance;
}
