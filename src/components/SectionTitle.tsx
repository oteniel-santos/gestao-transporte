type SectionTitleProps = { number: number; title: string };

export default function SectionTitle({ number, title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
        {number}
      </div>
      <h2 className="text-xl font-semibold uppercase text-gray-900">{title}</h2>
    </div>
  );
}
