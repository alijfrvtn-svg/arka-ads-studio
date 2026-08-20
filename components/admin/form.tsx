import { cn } from "@/lib/utils";

/**
 * The panel's form primitives, in soft-UI glass.
 *
 * One rule decides everything here: **a field is pressed into the surface, a
 * button stands out of it.** Raised means you can act on it; recessed means it
 * receives what you type. That is the whole grammar of the style, and it is
 * also, conveniently, correct affordance — the shape tells you which things
 * take input without a border having to say so.
 *
 * Every page under /admin imports `inputCls`, so this string is what actually
 * restyles the thirty-odd forms in the panel.
 */

/**
 * The recessed well every input sits in.
 *
 * `bg-transparent` on the element itself with the well painted by the
 * box-shadow: a background colour *and* an inset shadow fight each other, and
 * the colour wins at the edges, which flattens exactly the part that carries
 * the effect.
 */
export const inputCls =
  "h-11 w-full rounded-[10px] bg-white/35 px-3.5 text-[1.0625rem] text-[var(--ios-label)] outline-none " +
  "shadow-[var(--neo-inset)] transition-shadow placeholder:text-[var(--ios-label-3)] " +
  "focus:shadow-[var(--neo-pressed),0_0_0_3px_color-mix(in_srgb,var(--ios-blue)_22%,transparent)]";

export function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="ios-subhead block font-medium text-[var(--ios-label)]">
          {label}
          {required && <span className="text-[var(--ios-red)]"> *</span>}
        </label>
      )}
      {children}
      {hint && <p className="ios-caption text-[var(--ios-label-3)]">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputCls, "h-auto min-h-24 py-3 leading-relaxed", props.className)} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(inputCls, "cursor-pointer", props.className)}>
      {children}
    </select>
  );
}

/**
 * The switch, sharing the shell's markup so there is one of these on the panel
 * rather than two that drift apart.
 *
 * `value` is kept because several forms post a named `on` — dropping it would
 * have been a silent behaviour change in code that is not being touched.
 */
export function Toggle({
  name,
  defaultChecked,
  checked,
  onChange,
  label,
  value = "on",
}: {
  name?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  value?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          checked={checked}
          onChange={onChange}
          className="ios-switch-input peer sr-only"
        />
        <span
          aria-hidden
          className="ios-switch peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ios-blue)]"
        />
      </span>
      {label && <span className="ios-body">{label}</span>}
    </label>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ios-group p-5">
      <div className="mb-4">
        <h3 className="ios-headline">{title}</h3>
        {description && <p className="ios-caption mt-0.5 text-[var(--ios-label-2)]">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
