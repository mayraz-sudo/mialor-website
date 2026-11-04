/** תגית קטנה שמסמנת תמונה או נתון זמני. תוסר כשיתקבלו החומרים המקוריים. */
export default function PlaceholderTag({ show = true, label = "תמונה זמנית" }: { show?: boolean; label?: string }) {
  if (!show) return null;
  return (
    <span className="absolute top-2 left-2 z-10 rounded bg-ink/70 px-2 py-0.5 text-[11px] font-medium text-white">
      {label}
    </span>
  );
}
