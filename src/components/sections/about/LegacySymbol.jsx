/** Symbols explain each chapter. Paths are traced by that scene's scroll timeline. */
export function LegacySymbol({ chapter }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" className="legacy-object" aria-hidden="true">
      <circle
        data-object-orbit
        cx="120"
        cy="120"
        r="106"
        stroke="currentColor"
        strokeOpacity=".18"
        strokeDasharray="1 12"
      />
      <g data-object-core stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        {chapter === 0 && (
          <>
            <path d="M58 183V101C58 20 182 20 182 101V183M42 183H198M69 196H171" />
            <path d="M80 142H160M87 142V175M153 142V175M109 141L129 106M109 105L143 119M117 101L108 116" />
            <path d="M120 62V90M107 76H133" />
          </>
        )}
        {chapter === 1 && (
          <>
            <ellipse cx="120" cy="130" rx="64" ry="73" />
            <ellipse cx="120" cy="130" rx="49" ry="58" />
            <path d="M94 62L103 40H137L146 62L120 82Z M103 40L120 62L137 40M94 62H146M120 62V82" />
          </>
        )}
        {chapter === 2 && (
          <>
            <path d="M120 37C94 75 65 104 65 140A55 55 0 00175 140C175 104 146 75 120 37Z" />
            <path d="M120 65C106 96 85 119 85 140A35 35 0 00155 140" />
            <path d="M172 45V75M157 60H187M48 103V123M38 113H58" />
          </>
        )}
        {chapter === 3 && (
          <>
            <path d="M120 31L190 59V125C190 173 151 197 120 210C89 197 50 173 50 125V59Z" />
            <path d="M120 49L174 71V124C174 159 148 183 120 195C92 183 66 159 66 124V71Z" />
            <path d="M87 117L110 140L157 94" />
          </>
        )}
        {chapter === 4 && (
          <>
            <path d="M49 203V110C49 16 191 16 191 110V203M67 203V112C67 43 173 43 173 112V203M49 203H191M89 203V116H151V203M120 116V203" />
            <path d="M100 99H140M106 86H134M120 61V77" />
          </>
        )}
        {chapter === 5 && (
          <>
            <path d="M120 121L83 179L120 209L157 179Z M120 121V209M83 179H157" />
            <path d="M54 55L32 89L54 108L76 89Z M120 31L92 74L120 97L148 74Z M186 55L164 89L186 108L208 89Z" />
            <path d="M54 108L96 148M120 97V121M186 108L144 148" />
          </>
        )}
      </g>
      <g data-object-spark stroke="currentColor" strokeWidth="1.1">
        <path d="M207 145V165M197 155H217M31 57V73M23 65H39" />
      </g>
    </svg>
  );
}
