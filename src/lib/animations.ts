import type { Variants } from 'framer-motion';

// 1. Standard Fade & Slide Up (Best for general page content)
export const animFadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

// 2. Stagger Container (Best for grids, lists, or multiple cards)
export const animStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

// 3. Soft Scale In (Best for modals, images, or featured cards)
export const animScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  }
};

// 4. Blur Fade In (Best for overlays, dropdowns, or background elements)
export const animBlurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    filter: 'blur(0px)', 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

// 5. Slide In Right (Best for sidebars, drawers, or sequential reveals)
export const animSlideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  }
};

// 6. Pop In (Best for small UI elements like badges, icons, or tooltips)
export const animPopIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: 'spring', stiffness: 400, damping: 25 } 
  }
};

// 7. Expand Height (Best for accordions or expanding text sections)
export const animExpandHeight: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto', 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  }
};

// 8. Draw Line (Best for underlines, dividers, or progress indicators)
export const animDrawLine: Variants = {
  hidden: { width: 0 },
  visible: { 
    width: '100%', 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

// 9. Fast Fade (Best for quick state changes, like tab switching)
export const animFastFade: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.2, ease: 'easeOut' } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.2, ease: 'easeIn' } 
  }
};

// 10. Subtle Hover Lift (Best for interactive cards or buttons)
export const animHoverLift: Variants = {
  rest: { y: 0, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
  hover: { 
    y: -4, 
    boxShadow: '0px 12px 24px -8px rgba(42, 35, 32, 0.15)',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } 
  }
};