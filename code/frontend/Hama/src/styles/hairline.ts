export const hairline = {
  page:
    'bg-[linear-gradient(#f8f9fb_0_0),linear-gradient(90deg,rgba(17,24,39,0.035)_1px,transparent_1px),linear-gradient(rgba(17,24,39,0.035)_1px,transparent_1px)] bg-[size:auto,56px_56px,56px_56px]',
  header:
    'sticky top-0 z-[65] w-full border-b border-[#C9CFDA] bg-white/96 shadow-[0_1px_0_rgba(255,255,255,0.9)]',
  panel:
    'border border-[#C6CDD8] bg-white/84 shadow-[0_12px_34px_rgba(29,29,31,0.035),inset_0_1px_0_rgba(255,255,255,0.92)]',
  panelSoft:
    'border border-[#C6CDD8] bg-white/72 shadow-[0_12px_34px_rgba(29,29,31,0.03),inset_0_1px_0_rgba(255,255,255,0.92)]',
  card:
    'border border-[#C9CFDA] bg-white/86 shadow-[0_12px_32px_rgba(29,29,31,0.04)]',
  cardHover:
    'hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(29,29,31,0.055)]',
  image: 'bg-[#F3F4F6]',
  control:
    'border border-[#C9CFDA] bg-white/58 text-[#5F6368] shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]',
  controlHover: 'hover:border-[#AEB6C2] hover:bg-white/82 hover:text-[#1D1D1F]',
  controlActive:
    'border border-[#111827] bg-white text-[#111827] shadow-[inset_0_0_0_1px_rgba(17,24,39,0.68)]',
  primaryButton:
    'border border-black/10 bg-[#1D1D1F] text-white shadow-[0_8px_18px_rgba(29,29,31,0.1),inset_0_1px_0_rgba(255,255,255,0.16)] hover:bg-black active:border-black active:shadow-[0_8px_18px_rgba(29,29,31,0.1),inset_0_0_0_1px_rgba(0,0,0,0.65)]',
  secondaryButton:
    'border border-[#C9CFDA] bg-white/70 text-[#1D1D1F] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_18px_rgba(29,29,31,0.035)] hover:border-[#AEB6C2] hover:bg-white active:border-black active:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.65),0_8px_18px_rgba(29,29,31,0.035)]',
  focus: 'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
  focusWide: 'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4',
  mutedText: 'text-[#626873]',
  quietText: 'text-[#86868B]',
  status:
    'rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3 py-1 text-xs font-black text-emerald-700/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]',
} as const;
