// The six lifecycle stages, shared by the desktop stage band and the mobile variants.
// Panel values are illustrative sample data, not claims.
export const stages = [
  {
    name: 'Apply',
    body: 'Clients, products, co-borrowers and guarantors captured once and reused at every later step.',
    who: 'Branch officer',
    panel: [
      ['Client type', 'SME'],
      ['Co-borrower', 'Added, 1'],
      ['Guarantor', 'Added, 1'],
      ['Product', 'Working-capital loan'],
    ],
  },
  {
    name: 'Score',
    body: 'Statements, registry exposure and your own scorecard, with knock-out and adjustment criteria applied.',
    who: 'Credit analyst, risk',
    panel: [
      ['Statements', '3 periods'],
      ['Registry exposure', 'Imported 9 Sep'],
      ['Knock-out criteria', '0 triggered'],
      ['Adjustments', '2 applied'],
    ],
  },
  {
    name: 'Approve',
    body: 'Routed from branch to risk to committee by the limits you set per branch and product.',
    who: 'Branch manager, risk, committee',
    panel: [
      ['Branch manager', 'Recommended'],
      ['Risk department', 'Approved'],
      ['Credit committee', 'Not required'],
      ['Limit applied', 'to EUR 150,000'],
    ],
  },
  {
    name: 'Disburse',
    body: 'Contracts from your own templates; collateral and mortgages on the same record.',
    who: 'Credit administration',
    panel: [
      ['Contract', 'Template SME-WC v3'],
      ['Mortgage', 'Registered'],
      ['Movable pledge', 'Registered'],
      ['Disbursement', 'Tranche 1 of 1'],
    ],
  },
  {
    name: 'Monitor',
    body: 'Reviews and early warnings raised for revaluation, product expiry and special conditions.',
    who: 'Monitoring team',
    panel: [
      ['Collateral revaluation', 'Due 2 Sep 2027'],
      ['Special condition', 'Review in 30 days'],
      ['Product expiry', 'Sep 2029'],
      ['Early warnings', 'None open'],
    ],
  },
  {
    name: 'Collect',
    body: 'Arrears sorted by days of delay and handed to collectors. Restructure without a new file.',
    who: 'Collections',
    panel: [
      ['Days of delay', '0'],
      ['Bucket', 'Current'],
      ['Assigned to', 'Not assigned'],
      ['Restructure', 'Available'],
    ],
  },
];

export const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];
