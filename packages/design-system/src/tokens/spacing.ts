/**
 * 8px grid system.
 * ALL spacing in the UI must snap to these values.
 */
export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const;

/**
 * Semantic spacing — use these names in code.
 *
 * card-padding:     12px  (inside cards)
 * card-gap:         12px  (between cards in grid)
 * section-gap:      24px  (between page sections)
 * page-padding:     16px mobile, 24px desktop
 * input-padding-x:  12px  (horizontal inside inputs)
 * input-padding-y:  8px   (vertical inside inputs)
 */
export const semanticSpacing = {
  'card-padding': '12px',
  'card-gap': '12px',
  'section-gap': '24px',
  'page-padding-mobile': '16px',
  'page-padding-desktop': '24px',
  'input-padding-x': '12px',
  'input-padding-y': '8px',
} as const;
