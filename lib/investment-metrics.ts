const AMORTIZATION_YEARS = 25;

function annualDebtService(loanAmount: number, annualRatePercent: number): number {
  if (loanAmount <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const numPayments = AMORTIZATION_YEARS * 12;
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  return monthlyPayment * 12;
}

export interface InvestmentSummary {
  noi: number;
  price: number;
  capRatePercent: number;
  downPayment: number;
  loanAmount: number;
  interestRatePercent: number;
  annualDebtService: number;
  dscr: number;
  cocReturnPercent: number;
  roiPercent: number;
}

/**
 * Compute investment metrics from NOI, price, and user inputs (down payment, interest rate).
 * 25-year amortization assumed.
 */
export function computeInvestmentSummary(
  noi: number,
  price: number,
  capRate: number,
  downPayment: number,
  interestRatePercent: number
): InvestmentSummary {
  const down = Math.max(0, Math.min(price, downPayment));
  const loanAmount = price - down;
  const debtService = annualDebtService(loanAmount, interestRatePercent);
  const cashFlow = noi - debtService;
  const dscr = debtService > 0 ? noi / debtService : 0;
  const cocReturnPercent = down > 0 ? (cashFlow / down) * 100 : 0;
  const roiPercent = capRate * 100;

  return {
    noi,
    price,
    capRatePercent: capRate * 100,
    downPayment: down,
    loanAmount,
    interestRatePercent,
    annualDebtService: debtService,
    dscr,
    cocReturnPercent,
    roiPercent,
  };
}
