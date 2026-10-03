/** Positive graphite midtones; a white illustration matte maps to black. */
export const industryGraphiteTones = "0 .12 .28 .48 .65 .72 .78 .70 .52 .30 0";

export function IndustryGraphiteTone({ id }: { id: string }) {
  return (
    <filter id={id} colorInterpolationFilters="sRGB">
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncR type="table" tableValues={industryGraphiteTones} />
        <feFuncG type="table" tableValues={industryGraphiteTones} />
        <feFuncB type="table" tableValues={industryGraphiteTones} />
      </feComponentTransfer>
    </filter>
  );
}
