import { PaginationConf } from "#/contants/config";
import { Link } from "@tanstack/react-router";
import type { Metadata } from "../../../backend/src/share/schema";
import type { EntriesSearch } from "#/api/api.types";
import { range } from "#/shared/range";
import {
  FirstPageIcon,
  LastPageIcon,
  NextPageIcon,
  PrevPageIcon,
} from "#/componets/icons/PaginationIcons.tsx";

type PaginationProp = { metadata: Metadata; search: EntriesSearch };

export function Pagination({ metadata, search }: PaginationProp) {
  const { totalPages } = metadata;
  const { page, sizePage } = search;
  
  return (
    <div className="pagination flex gap-5">
      <Link
        to="/entries"
        search={{ page: 1, sizePage }}
        disabled={page === 1}
        aria-label="First page"
        className="pagination-button"
      >
        <FirstPageIcon />
      </Link>
      <Link
        to="/entries"
        search={{ page: page - 1, sizePage }}
        disabled={page <= 1}
        aria-label="Previous page"
        className="pagination-button"
      >
        <PrevPageIcon />
      </Link>
      {range(
        Math.max(1, page - PaginationConf.delataRange),
        Math.min(totalPages, page + PaginationConf.delataRange),
      ).map((p) => {
        return (
          <Link key={p} className={`pagination-button ${p === page ? 'bg-pagination-active' : 'bg-none'}`} to="/entries" search={{ page: p, sizePage }}>
            {p}
          </Link>
        );
      })}

      <Link
        to="/entries"
        search={{ page: page + 1, sizePage }}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="pagination-button"
      >
        <NextPageIcon />
      </Link>
      <Link
        to="/entries"
        search={{ page: totalPages, sizePage }}
        disabled={page >= totalPages}
        aria-label="Last page"
        className="pagination-button"
      >
        <LastPageIcon />
      </Link>
    </div>
  );
}
