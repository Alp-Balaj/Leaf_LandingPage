// One Leaf screen per lifecycle stage, in the order of lifecycle-stages.ts. `place` is where
// the summary card sits over the screen, chosen per screen so it covers nothing that matters;
// `focal` is the object-position that survives the viewport crop. PNG sources are the truth;
// the build emits WebP at several widths. Screens show demo data in Albanian.
import type { ImageMetadata } from 'astro';
import apply from '../../../assets/lifecycle/apply.png';
import score from '../../../assets/lifecycle/score.png';
import approve from '../../../assets/lifecycle/approve.png';
import disburse from '../../../assets/lifecycle/disburse.png';
import monitor from '../../../assets/lifecycle/monitor.png';
import collect from '../../../assets/lifecycle/collect.png';

export type Place =
  | 'top-left'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-right';

export interface Screen {
  src: ImageMetadata;
  place: Place;
  focal: string;
  alt: string;
}

export const screens: Screen[] = [
  {
    src: apply,
    place: 'top-right',
    focal: '50% 0%',
    alt: 'Leaf application details: the applicant, the product list with its exposure total, and the document checklist.',
  },
  {
    src: score,
    place: 'middle-left',
    focal: '50% 35%',
    alt: 'Leaf internal rating window: scorecard, statistical and qualitative scores, final score and rating, and the rating ladder.',
  },
  {
    src: approve,
    place: 'bottom-left',
    focal: '50% 30%',
    alt: 'Leaf decision proposal with a confirmation prompt, the decision summary table and the seventeen-step progress rail.',
  },
  {
    src: disburse,
    place: 'bottom-right',
    focal: '50% 0%',
    alt: 'Leaf credit control before disbursement: the contract row with its control and disbursement actions, registry data and the progress rail.',
  },
  {
    src: monitor,
    place: 'middle-right',
    focal: '50% 0%',
    alt: 'Leaf monitoring for a micro-retail client: profile, products, financial analysis, collateral and credit-registry sections.',
  },
  {
    src: collect,
    place: 'top-right',
    focal: '50% 0%',
    alt: 'Leaf arrears management: nine loans listed with days of delay, classification, outstanding amounts and actions.',
  },
];

// Centre of the shade behind the card, as a fraction of the screen.
export const shadeAt = (place: Place): [string, string] => {
  const [v, h] = place.split('-') as ['top' | 'middle' | 'bottom', 'left' | 'right'];
  return [h === 'left' ? '24%' : '76%', v === 'top' ? '26%' : v === 'middle' ? '50%' : '74%'];
};
