export function SectionTitle({
  children,
  centered,
}: {
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : undefined}>
      <h2
        className={`font-display uppercase tracking-widest ${
          centered ? "text-3xl" : "text-xl"
        }`}
      >
        {children}
      </h2>
      <div
        className={`mt-2 h-[3px] rounded-full bg-tomato ${
          centered ? "mx-auto mt-3 w-14" : "w-10"
        }`}
      />
    </div>
  );
}
