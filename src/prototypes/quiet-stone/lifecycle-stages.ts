// The six lifecycle stages, shared by the desktop stage band and the mobile variants.
// Panel values are illustrative sample data, not claims.
export const stages = [
  {
    name: 'Apply',
    body: 'One client or a whole group of connected clients, with several products on one application. Captured once, and the client follows its progress in real time.',
    who: 'Relationship officer',
    panel: [
      ['Applicant', 'Group, 3 clients'],
      ['Products', '2 on one application'],
      ['Guarantor', 'Added, 1'],
      ['Progress alerts', 'Real time'],
    ],
  },
  {
    name: 'Score',
    body: 'Your own credit score, fully configurable: you set the rating ranks and the criteria that score each client, from statements and registry exposure to knock-out and adjustment rules. The internal client rating takes five minutes.',
    who: 'Credit analyst, risk',
    panel: [
      ['Internal rating', 'B2, in 5 min'],
      ['Registry exposure', 'Imported 9 Sep'],
      ['Knock-out rules', '0 triggered'],
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
    body: 'Contracts from your own templates; collateral and mortgages on the same record. A property valued within your set period is not valued again.',
    who: 'Credit administration',
    panel: [
      ['Contract', 'Template SME-WC v3'],
      ['Mortgage valuation', 'Reused, Apr 2026'],
      ['Movable pledge', 'Registered'],
      ['Disbursement', 'Tranche 1 of 1'],
    ],
  },
  {
    name: 'Monitor',
    body: 'Reviews, early warnings and automatic notifications for revaluation, product expiry and special conditions. Credit terms and limits change on the live loan, without a new file.',
    who: 'Monitoring team',
    panel: [
      ['Collateral revaluation', 'Due 2 Sep 2027'],
      ['Credit limit', 'EUR 250,000, 46% used'],
      ['Change of terms', 'Applied same day'],
      ['Notifications', 'Sent automatically'],
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
