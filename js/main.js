/**
 * Armina Stone - Main Entrypoint
 */

import { initHeader } from './header.js';
import { initHero } from './hero.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHero();
});
