import clsx from "clsx";

type SummaryCardProps = {
  title: string;
  value: string;
  valueClassName?: string;
};

export function SummaryCard({
  title,
  value,
  valueClassName,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-foreground-secondary">{title}</p>

      <strong
        className={clsx(
          "mt-2 block text-2xl font-bold text-black",
          valueClassName,
        )}
      >
        {value}
      </strong>
    </div>
  );
}
