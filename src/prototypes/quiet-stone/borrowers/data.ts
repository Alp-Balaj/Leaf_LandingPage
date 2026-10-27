// Four sample borrowers, one per segment, shared by Borrowers.astro and the Borrowers prototypes.
// Every name, figure and date is illustrative sample data, not a client or a claim.

export const analyses = [
  'Income and expenses',
  'Co-borrowers and guarantors',
  'Payroll-linked loans',
  'Simplified P&L',
  'Cash flow',
  'Balance sheet, three periods',
  'Declared against assumed',
  'Credit limits',
  'Full financial statements',
  'Legal opinion',
  'Mortgages and movable collateral',
] as const;

type Analysis = (typeof analyses)[number];

export interface Borrower {
  n: string;
  label: string;
  segment: string;
  ticket: string;
  /** Position of the ticket range on a log scale from EUR 1k (0) to EUR 10M (1). */
  range: [number, number];
  file: string;
  name: string;
  monogram: string;
  about: string;
  purpose: string;
  amount: string;
  term: string;
  uses: Analysis[];
  panel: string;
  rows?: [string, string][];
  table?: { head: string[]; rows: string[][] };
  /** Documents on file, newest first. */
  docs: string[];
  /** Small bar figure for the panel, values 0 to 1. */
  bars: { caption: string; values: number[]; labels?: string[] };
}

export const borrowers: Borrower[] = [
  {
    n: '01',
    label: 'Retail',
    segment: 'Individuals',
    ticket: 'EUR 2k to 40k',
    range: [0.08, 0.4],
    file: 'LF-2026-0907',
    name: 'Arta Krasniqi',
    monogram: 'AK',
    about: 'Nurse, Prishtina. Applying with her husband as co-borrower.',
    purpose: 'A new kitchen, finally.',
    amount: 'EUR 9,500',
    term: '48 months',
    uses: ['Income and expenses', 'Co-borrowers and guarantors', 'Payroll-linked loans'],
    panel: 'Income and expenses',
    rows: [
      ['Net salary', 'EUR 1,240'],
      ['Household expenses', 'EUR 610'],
      ['Existing instalments', 'EUR 180'],
      ['Disposable income', 'EUR 450'],
      ['Co-borrower', 'Added, Driton K.'],
      ['Payroll-linked', 'Yes, created automatically'],
    ],
    docs: ['Payslips, three months', 'Co-borrower consent', 'Credit registry check'],
    bars: {
      caption: 'Monthly budget',
      values: [1, 0.49, 0.15, 0.36],
      labels: ['Salary', 'Household', 'Instalments', 'Disposable'],
    },
  },
  {
    n: '02',
    label: 'Business',
    segment: 'Micro',
    ticket: 'EUR 10k to 80k',
    range: [0.33, 0.63],
    file: 'LF-2026-0851',
    name: 'Example Dental Studio',
    monogram: 'ED',
    about: 'Dental practice, Prizren. Two dentists and an assistant, owner as guarantor.',
    purpose: 'A digital X-ray unit for the second chair.',
    amount: 'EUR 24,000',
    term: '48 months',
    uses: ['Co-borrowers and guarantors', 'Simplified P&L', 'Cash flow', 'Declared against assumed'],
    panel: 'Simplified P&L, monthly',
    rows: [
      ['Revenue', 'EUR 11,800'],
      ['Materials and lab', 'EUR 3,600'],
      ['Wages and rent', 'EUR 4,900'],
      ['Free cash flow', 'EUR 3,300'],
      ['Guarantor', 'Owner, added'],
      ['Declared vs assumed', '−5%'],
    ],
    docs: ['Bank statements, twelve months', 'Business registration', 'Guarantor statement', 'Equipment quote'],
    bars: {
      caption: 'Revenue, last twelve months',
      values: [0.7, 0.66, 0.72, 0.75, 0.71, 0.6, 0.64, 0.78, 0.83, 0.86, 0.92, 1],
    },
  },
  {
    n: '03',
    label: 'Business',
    segment: 'SME',
    ticket: 'EUR 50k to 1M',
    range: [0.56, 0.86],
    file: 'LF-2026-0418',
    name: 'Example Trading Sh.p.k.',
    monogram: 'ET',
    about: 'Wholesale food distribution, Prishtina. 38 employees, client since 2021.',
    purpose: 'Working capital for the winter stock.',
    amount: 'EUR 120,000',
    term: '36 months',
    uses: [
      'Co-borrowers and guarantors',
      'Cash flow',
      'Balance sheet, three periods',
      'Declared against assumed',
      'Credit limits',
      'Mortgages and movable collateral',
    ],
    panel: 'Balance sheet, three periods',
    table: {
      head: ['', '2023', '2024', '2025'],
      rows: [
        ['Revenue', '410k', '468k', '522k'],
        ['EBITDA', '61k', '72k', '80k'],
        ['Total debt', '140k', '128k', '115k'],
        ['Declared vs assumed', '', '', '−4%'],
        ['Credit limit', '', '', '250k open'],
      ],
    },
    docs: [
      'Statements 2023 to 2025',
      'Credit limit agreement',
      'Movable pledge, vehicle',
      'Mortgage, premises',
      'Registry exposure',
    ],
    bars: { caption: 'Revenue, three periods', values: [0.78, 0.9, 1], labels: ['2023', '2024', '2025'] },
  },
  {
    n: '04',
    label: 'Business',
    segment: 'Corporate',
    ticket: 'EUR 500k and above',
    range: [0.8, 1],
    file: 'LF-2026-0233',
    name: 'Example Logistics J.S.C.',
    monogram: 'EL',
    about: 'Freight and cold storage, Ferizaj. 260 employees, audited.',
    purpose: 'Twelve refrigerated trucks and a warehouse extension.',
    amount: 'EUR 2,400,000',
    term: '84 months',
    uses: [
      'Co-borrowers and guarantors',
      'Cash flow',
      'Balance sheet, three periods',
      'Declared against assumed',
      'Credit limits',
      'Full financial statements',
      'Legal opinion',
      'Mortgages and movable collateral',
    ],
    panel: 'Collateral history',
    rows: [
      ['Mortgage, warehouse', 'Valued 2 Sep 2026'],
      ['Previous valuation', '4 Sep 2025'],
      ['Movable pledge, fleet', 'Registered, 12 units'],
      ['Legal opinion', 'On file, 18 Aug'],
      ['Statements', 'Audited, three periods'],
      ['Committee', 'Approved, 6 of 7'],
    ],
    docs: [
      'Audited statements',
      'Legal opinion',
      'Mortgage, warehouse',
      'Valuation report',
      'Fleet pledge register',
      'Group structure',
      'Committee minutes',
    ],
    bars: { caption: 'Collateral cover', values: [0.55, 0.3, 0.15], labels: ['Mortgage', 'Fleet', 'Guarantee'] },
  },
];

/** The stages every borrower goes through once captured. */
export const shared = ['Score', 'Approve', 'Contract', 'Disburse', 'Monitor', 'Collect'];
