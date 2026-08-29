type ArrowMarkProps = {
  className?: string;
};

export function ArrowMark({ className = "" }: ArrowMarkProps) {
  return (
    <span aria-hidden="true" className={`arrow-mark ${className}`}>
      ↗
    </span>
  );
}
