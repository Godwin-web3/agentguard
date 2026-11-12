// AG Grid Community, themed from the AgentGuard design tokens (CSS variables, so light/dark follow the console theme).
import {
  ModuleRegistry, createGrid, themeQuartz, ClientSideRowModelModule, QuickFilterModule, CsvExportModule, TextFilterModule, NumberFilterModule,
  DateFilterModule, RowSelectionModule, CellStyleModule, TooltipModule, PaginationModule, ColumnAutoSizeModule, RowStyleModule,
  type GridApi, type GridOptions, type ColDef,
} from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule, QuickFilterModule, CsvExportModule, TextFilterModule, NumberFilterModule, DateFilterModule,
  RowSelectionModule, CellStyleModule, TooltipModule, PaginationModule, ColumnAutoSizeModule, RowStyleModule]);

export const brandTheme = themeQuartz.withParams({
  fontFamily: "var(--font-sans)", fontSize: 13, headerFontSize: 12, headerFontWeight: 520, dataFontSize: 13,
  backgroundColor: "var(--surface)", foregroundColor: "var(--text)", textColor: "var(--text)", subtleTextColor: "var(--text-3)",
  borderColor: "var(--border)", chromeBackgroundColor: "var(--bg-subtle)", headerBackgroundColor: "var(--bg-subtle)", headerTextColor: "var(--text-3)",
  accentColor: "var(--accent)", rowHoverColor: "color-mix(in srgb, var(--surface-2) 70%, transparent)",
  selectedRowBackgroundColor: "var(--accent-subtle)", oddRowBackgroundColor: "var(--surface)",
  inputBackgroundColor: "var(--surface)", inputBorder: { color: "var(--border-strong)" }, inputFocusBorder: { color: "var(--focus)" },
  menuBackgroundColor: "var(--surface)", menuBorder: { color: "var(--border)" }, menuShadow: "var(--shadow-lg)", popupShadow: "var(--shadow-lg)",
  tooltipBackgroundColor: "var(--surface-inverse)", tooltipTextColor: "var(--text-inverse)",
  spacing: 6, rowHeight: 42, headerHeight: 36, cellHorizontalPadding: 12, borderRadius: 6, wrapperBorder: false, wrapperBorderRadius: 0,
  rowBorder: { color: "var(--border)" }, columnBorder: false, headerColumnBorder: false, headerRowBorder: { color: "var(--border)" },
  iconSize: 14, browserColorScheme: "inherit",
});

export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const TONE: Record<string, string> = { active: "success", captured: "success", approve: "success", verified: "success", valid: "success",
  draft: "warning", unsigned: "warning", needs_human: "warning", pending_approval: "warning", authorized: "warning", reserved: "warning", unlinked: "warning", checking: "",
  revoked: "danger", rejected: "danger", reject: "danger", voided: "danger", failed: "danger", expired: "danger", broken: "danger", invalid: "danger" };
export const badgeHtml = (v: unknown, label?: string) => v == null || v === "" ? "" :
  `<span class="badge ${TONE[String(v)] ? "badge-" + TONE[String(v)] : ""}"><span class="dot" aria-hidden="true"></span>${esc(label ?? String(v).replace(/_/g, " "))}</span>`;

/** Column helpers. Every cell renderer returns escaped HTML. */
export const col = {
  text: (field: string, headerName: string, extra: ColDef = {}): ColDef => ({ field, headerName, filter: "agTextColumnFilter", ...extra }),
  mono: (field: string, headerName: string, extra: ColDef = {}): ColDef => ({ field, headerName, filter: "agTextColumnFilter", cellClass: "ag-mono",
    tooltipField: field, ...extra }),
  badge: (field: string, headerName: string, extra: ColDef = {}): ColDef => ({ field, headerName, filter: "agTextColumnFilter",
    cellRenderer: (p: any) => badgeHtml(p.value), ...extra }),
  time: (field: string, headerName: string, extra: ColDef = {}): ColDef => ({ colId: field, headerName, filter: "agDateColumnFilter",
    valueGetter: (p: any) => p.data?.[field] ? new Date(p.data[field]) : null,
    valueFormatter: (p: any) => p.value ? p.value.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "",
    tooltipValueGetter: (p: any) => p.data?.[field] ?? "", cellClass: "ag-muted", width: 150, ...extra }),
  money: (minorField: string, currencyField: string, headerName: string, extra: ColDef = {}): ColDef => ({ colId: minorField, headerName, filter: "agNumberColumnFilter",
    type: "rightAligned", valueGetter: (p: any) => p.data ? (Number(p.data[minorField]) || 0) / 100 : null,
    valueFormatter: (p: any) => p.value == null ? "" : `${Number(p.value).toFixed(2)} ${p.data?.[currencyField] ?? ""}`, cellClass: "ag-num", width: 130, ...extra }),
};

export interface Grid<T> { api: GridApi<T>; set: (rows: T[]) => void; quick: (s: string) => void; csv: (fileName: string) => void }

/** Creates a grid with stable row ids so 4-second polling keeps sort, filters, scroll and selection. */
export function makeGrid<T>(el: HTMLElement, opts: GridOptions<T> & { rowId: (r: T) => string; empty: string }): Grid<T> {
  const { rowId, empty, ...rest } = opts;
  el.innerHTML = ""; el.classList.add("grid-host");
  const api = createGrid<T>(el, {
    theme: brandTheme, rowData: [], getRowId: p => rowId(p.data), animateRows: false, suppressCellFocus: false, enableCellTextSelection: true,
    defaultColDef: { sortable: true, resizable: true, filter: true, minWidth: 90, suppressHeaderMenuButton: false },
    overlayNoRowsTemplate: `<span class="small subtle">${esc(empty)}</span>`, overlayLoadingTemplate: `<span class="small subtle">Loading…</span>`,
    tooltipShowDelay: 400, domLayout: "normal", pagination: true, paginationPageSize: 50, paginationPageSizeSelector: [25, 50, 100, 200],
    ...rest,
  });
  return {
    api,
    set: rows => api.setGridOption("rowData", rows),
    quick: s => api.setGridOption("quickFilterText", s),
    csv: fileName => api.exportDataAsCsv({ fileName, allColumns: true, skipColumnGroupHeaders: true,
      processCellCallback: p => p.value instanceof Date ? p.value.toISOString() : typeof p.value === "object" && p.value ? JSON.stringify(p.value) : p.value }),
  };
}
