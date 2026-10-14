export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeInOutQuart = [0.76, 0, 0.24, 1] as const;

// There were four more exports here — softTransition, revealVariants,
// staggerParent and lineVariants — and nothing imported any of them. The
// components that would have used them write their variants inline instead,
// where the numbers sit next to the markup they animate. Two easing curves are
// what is actually shared.
