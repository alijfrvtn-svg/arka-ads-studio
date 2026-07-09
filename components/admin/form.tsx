import { cn } from "@/lib/utils";

export const inputCls =
  "h-11 w-full rounded-xl border border-card-border bg-background/50 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-foreground-faint focus:border-primary";

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
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-primary"> *</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-foreground-faint">{hint}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(inputCls, "h-auto min-h-24 py-3 leading-relaxed", props.className)}
    />
  );
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(inputCls, "cursor-pointer", props.className)}>
      {children}
    </select>
  );
}

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
      <span className="relative inline-block">
        <input
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="block h-6 w-11 rounded-full bg-card-border transition-colors peer-checked:bg-primary" />
        <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:-translate-x-5" />
      </span>
      {label && <span className="text-sm text-foreground">{label}</span>}
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
    <div className="rounded-2xl border border-card-border bg-surface p-5">
      <div className="mb-4">
        <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
