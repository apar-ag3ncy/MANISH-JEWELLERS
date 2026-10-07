import { useId } from "react";

/** An educational section diagram, not a grading or ray-tracing simulator. */
export function DiamondAnatomy({ stage = "whole" }) {
  const uid = useId().replaceAll(":", "");
  return (
    <svg
      viewBox="0 0 700 510"
      className={`diamond-anatomy diamond-anatomy--${stage}`}
      role="img"
      aria-label={`Diamond anatomy: ${stage === "anatomy" ? "separated table, crown, girdle and pavilion" : stage === "light" ? "an illustrative path of light" : "a complete diamond in section"}`}
    >
      <defs>
        <linearGradient id={`${uid}-crown`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#faf4eb" />
          <stop offset=".4" stopColor="#b38a92" />
          <stop offset="1" stopColor="#fbebd0" />
        </linearGradient>
        <linearGradient id={`${uid}-pavilion`} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#eee0e2" />
          <stop offset=".45" stopColor="#793f48" />
          <stop offset="1" stopColor="#e9d7d0" />
        </linearGradient>
      </defs>
      <ellipse cx="350" cy="462" rx="155" ry="13" fill="#261419" opacity=".4" />
      <g data-diamond-assembly stroke="#fff5ee" strokeWidth="1.2" strokeLinejoin="round">
        <g data-diamond-table style={stage === "anatomy" ? { transform: "translateY(-60px)" } : undefined}>
          <polygon points="242,150 458,150 423,128 277,128" fill="#f5fbf2" />
          <path d="M277 128L290 150M423 128L410 150" fill="none" />
        </g>
        <g data-diamond-crown style={stage === "anatomy" ? { transform: "translateY(-28px)" } : undefined}>
          <polygon points="180,226 520,226 458,150 242,150" fill={`url(#${uid}-crown)`} />
          <path
            d="M242 150L270 226L300 150M300 150L350 226L400 150M400 150L430 226L458 150M180 226L242 150L210 190M520 226L458 150L490 190"
            fill="none"
          />
          <polygon points="300,150 350,226 400,150" fill="#fafff5" opacity=".5" />
        </g>
        <g data-diamond-girdle>
          <polygon points="180,226 520,226 515,235 185,235" fill="#eff9ed" />
        </g>
        <g data-diamond-pavilion style={stage === "anatomy" ? { transform: "translateY(42px)" } : undefined}>
          <polygon points="185,235 515,235 350,416" fill={`url(#${uid}-pavilion)`} />
          <path
            d="M185 235L350 416L270 235M270 235L350 416L350 235M350 235L350 416L430 235M430 235L350 416L515 235"
            fill="none"
          />
          <polygon points="270,235 350,416 350,235" fill="#fffce7" opacity=".45" />
          <polygon points="430,235 350,416 515,235" fill="#ecf4e6" opacity=".24" />
        </g>
      </g>
      <g
        data-anatomy-labels
        className="diamond-anatomy-labels"
        opacity={stage === "anatomy" ? 1 : 0}
        fill="none"
        stroke="#d7c5ac"
        strokeWidth=".8"
      >
        <path d="M277 79H159M241 160H105M181 230H105M407 336H588" />
        <g fill="#f2e5d4" stroke="none" fontSize="13" fontFamily="sans-serif">
          <text x="90" y="84">
            Table
          </text>
          <text x="38" y="165">
            Crown
          </text>
          <text x="38" y="235">
            Girdle
          </text>
          <text x="594" y="341">
            Pavilion
          </text>
        </g>
      </g>
      <g data-light-path opacity={stage === "light" ? 1 : 0} fill="none" strokeWidth="2" strokeLinecap="round">
        <path data-light-ray pathLength="100" d="M304 49L304 153L404 348L269 281L391 153L435 49" stroke="#f7d59d" />
        <path
          data-light-ray
          pathLength="100"
          d="M341 50L341 150L268 323L432 291L360 150L372 50"
          stroke="#fff6e8"
          opacity=".65"
        />
        <path d="M435 49L424 62M435 49L438 67M372 50L364 65M372 50L379 65" stroke="#f7d59d" />
      </g>
    </svg>
  );
}
