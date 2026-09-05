// One pen for every hand-drawn mark on the site — underlines, boxes, circles,
// the hero connector, the timeline wave — so nothing reads as a different
// weight of line. The timeline dots' border matches it in CSS (border-[2.5px]).
export const SKETCH_STROKE = 2.5;

// The faint dotted route a scroll-drawn stroke traces over: slightly finer, so
// the drawn line always sits on top of it rather than level with it.
export const GHOST_STROKE = 2;
export const GHOST_DASH = "0.5 12";
export const GHOST_OPACITY = 0.45;
