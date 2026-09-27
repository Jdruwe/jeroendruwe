/** Shared types for the WoW item components */

export type Quality =
  | 'poor'
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'artifact';

/** A line of text, or a [left, right] pair like "Two-Hand ... Mace" */
export type TooltipLine = string | [string, string];

/** In-game money; 1 gold = 100 silver = 10,000 copper */
export interface Price {
  gold?: number;
  silver?: number;
  copper?: number;
}

/** What an item tooltip can show, from top to bottom */
export interface ItemDetails {
  name: string;
  /** Colour of the name. Colours are defined in wow.css */
  quality?: Quality;
  /** White lines under the name, e.g. "Binds when picked up" */
  lines?: TooltipLine[];
  /** Green lines, e.g. "Use: ..." or "Equip: ..." */
  effects?: string[];
  /** Yellow, quoted flavour text */
  flavor?: string;
  /** Shown at the bottom in coins, e.g. "Sell Price: 1 silver 20 copper" */
  price?: Price;
  /** Label in front of the price, "Sell Price" by default */
  priceLabel?: string;
  /** Count the price up from 0 when it scrolls into view */
  countUpPrice?: boolean;
}
