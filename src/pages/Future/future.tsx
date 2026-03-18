import React, { useMemo, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { IonContent } from '@ionic/react';

import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';

import './future.css';

import searchIco from '../../assets/icon-search.svg';
import downIco from '../../assets/down-circle.svg';
import closeSm from '../../assets/close-small.svg';

type TabKey = 'root' | 'items';

type Condition = {
  title: string;
  category: string;
  code: string;
  dueDate: string;
  note: string;
};

type Row = {
  id: string;
  initials: string;
  name: string;
  ctpt: string;
  bulletColor: string;
  branch: string;
  conditions: Condition[];
};

/* ---- Sample data (same as before) ---- */
const ROOT_ROWS: Row[] = [
  {
    id: 'f1',
    initials: 'AG',
    name: 'Apex Global',
    ctpt: 'CTPT-1101',
    branch: '—',
    bulletColor: '#2f6bcb',
    conditions: [
      { title: 'Condition text', category: 'Property Insurance', code: 'CNDT-81101', dueDate: '15-10-2025', note: 'If borrower entity is submitted on monthly rent. The cut-off date for submission of statement is 15th of every month' },
      { title: 'Condition text', category: 'Mode of Payment',      code: 'CNDT-81102', dueDate: '20-10-2025', note: 'If borrower entity is submitted on monthly rent. The cut-off date for submission of statement is 15th of every month' },
      { title: 'Condition text', category: 'End Use Certificate',  code: 'CNDT-81103', dueDate: '24-10-2025', note: 'If borrower entity is submitted on monthly rent. The cut-off date for submission of statement is 15th of every month' }
    ]
  },
  {
    id: 'f2',
    initials: 'RE',
    name: 'RK Enterprises',
    ctpt: 'CTPT-0423',
    branch: '—',
    bulletColor: '#2f6bcb',
    conditions: [
      { title: 'Condition text', category: 'Condition Category D', code: 'CNDT-82354', dueDate: '12-11-2025', note: 'If borrower entity is submitted on monthly rent. The cut-off date for submission of statement is 15th of every month' },
      { title: 'Condition text', category: 'Condition Category F', code: 'CNDT-82356', dueDate: '18-11-2025', note: 'If borrower entity is submitted on monthly rent. The cut-off date for submission of statement is 15th of every month' }
    ]
  }
];

const ITEM_ROWS: Row[] = [
  {
    id: 'fi1',
    initials: 'MS',
    name: 'Mohan Suresh',
    ctpt: 'CTPT-7284',
    branch: '—',
    bulletColor: '#2f6bcb',
    conditions: [
      { title: 'Condition text', category: 'Condition Category G', code: 'CNDT-92104', dueDate: '03-12-2025', note: 'If borrower entity is submitted on monthly rent. The cut-off date for submission of statement is 15th of every month' }
    ]
  }
];

/* Category list */
const ALL_CATEGORIES = [
  'Property Insurance','Mode of Payment','End Use Certificate',
  'Condition Category D','Condition Category E','Condition Category F','Condition Category G',
] as const;
type Category = typeof ALL_CATEGORIES[number];

type OverdueRange = 'lt7' | 'lt14' | '7to14' | 'all';

/* Utils */
function parseDMY(dmy: string): Date {
  const [dd, mm, yyyy] = dmy.split('-').map(Number);
  return new Date(yyyy, (mm ?? 1) - 1, dd ?? 1);
}
function daysFromToday(dateStr: string): number {
  const ms = parseDMY(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
function conditionMatchesOverdue(c: Condition, range: OverdueRange): boolean {
  if (range === 'all') return true;
  const d = daysFromToday(c.dueDate);
  if (range === 'lt7') return d <= 7;
  if (range === 'lt14') return d <= 14;
  if (range === '7to14') return d >= 7 && d <= 14;
  return true;
}

export default function Future() {
  const history = useHistory();

  const [tab, setTab] = useState<TabKey>('root');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['f1']));
  const rows = tab === 'root' ? ROOT_ROWS : ITEM_ROWS;

  // filters
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [overdueRange, setOverdueRange] = useState<OverdueRange>('all');
  const [pendingOnly, setPendingOnly] = useState<boolean>(false);

  const [showFilter, setShowFilter] = useState(false);
  const [filterTab, setFilterTab] = useState<'category' | 'overdue' | 'pending'>('category');

  // ensure no global overflow locks remain
  useEffect(() => { document.body.style.overflow = 'auto'; return () => { document.body.style.overflow='auto'; }; }, []);

  // chips
  const chips = useMemo(() => {
    const out: string[] = [];
    if (selectedCategories.length) out.push(`Condition Category: ${selectedCategories.join(', ')}`);
    if (overdueRange !== 'all') out.push(overdueRange === 'lt7' ? 'Less than 7 Days' : overdueRange === 'lt14' ? 'Less than 14 Days' : '7–14 Days');
    if (pendingOnly) out.push('Pending only');
    return out;
  }, [selectedCategories, overdueRange, pendingOnly]);

  const allSelected = selectedCategories.length === ALL_CATEGORIES.length;
  const indeterminate = selectedCategories.length > 0 && !allSelected;

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const keepCategory = (c: Condition) =>
      selectedCategories.length === 0 || selectedCategories.includes(c.category as Category);
    const keepOverdue  = (c: Condition) => conditionMatchesOverdue(c, overdueRange);
    const keepPending  = (r: Row) => (pendingOnly ? r.conditions.length > 0 : true);

    return rows
      .map((r) => {
        const passText = !q || r.name.toLowerCase().includes(q) || r.ctpt.toLowerCase().includes(q);
        if (!passText) return { ...r, conditions: [] as Condition[] };
        const conds = r.conditions.filter((c) => keepCategory(c) && keepOverdue(c));
        return { ...r, conditions: conds };
      })
      .filter((r) => r.conditions.length > 0 && keepPending(r));
  }, [rows, query, selectedCategories, overdueRange, pendingOnly]);

  const toggleRow = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setOverdueRange('all');
    setPendingOnly(false);
  };

  return (
    <>
      <AppHeader title="Future" onBack={() => history.replace('/dashboard')} />

      {/* IonContent = native Ionic scroller (fixes scrolling) */}
      <IonContent className="ov-content" fullscreen>
        <div className="ov-wrap">
          <div className="ov-top">
            <div className="seg" role="tablist" aria-label="Root or Items">
              <button className={`seg-btn ${tab === 'root' ? 'active' : ''}`}  onClick={() => setTab('root')}  role="tab" aria-selected={tab === 'root'}>Root</button>
              <button className={`seg-btn ${tab === 'items' ? 'active' : ''}`} onClick={() => setTab('items')} role="tab" aria-selected={tab === 'items'}>Items</button>
            </div>

            <div className="ov-controls">
              <div className="search" role="search">
                <img src={searchIco} alt="" aria-hidden="true" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" aria-label="Search by customer or CTPT" />
              </div>

              <button className="filter-pill" onClick={() => { setShowFilter(true); setFilterTab('category'); }} aria-haspopup="dialog" aria-controls="filter-panel">
                <span className="pill-icon" aria-hidden="true">▦</span>
                Filters
              </button>
            </div>

            <div className="chips-row">
              {chips.map((c, i) => (<span className="chip" key={i}>{c}</span>))}
              {(chips.length > 0) && (<button className="chip clear" onClick={clearAllFilters}>CLEAR ALL</button>)}
            </div>
          </div>

          <div className="ov-list">
            {filteredRows.map((row) => {
              const open = expanded.has(row.id);
              return (
                <article className={`ov-card ${open ? 'open' : ''}`} key={row.id}>
                  <header className="card-head">
                    <span className="left-bullet" style={{ background: row.bulletColor }} />
                    <div className="head-main">
                      <div className="avatar" aria-hidden="true">{row.initials}</div>
                      <div className="title-block">
                        <div className="cust-line">
                          <span className="cust-name">{row.name}</span>
                          <span className="ctpt" title="CTPT ID">{row.ctpt}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`select-btn ${open ? 'on' : ''}`}
                      onClick={() => toggleRow(row.id)}
                      aria-label={open ? 'Collapse' : 'Expand'}
                    >
                      <img src={downIco} alt="" aria-hidden="true" />
                    </button>
                  </header>

                  {open && (
                    <div className="card-body">
                      {row.conditions.map((c, idx) => (
                        <div className="cond" key={idx}>
                          <div className="cond-grid">
                            <div className="kv"><span className="k">Condition Category</span><span className="v">{c.category}</span></div>
                            <div className="kv"><span className="k">CNDT ID</span><span className="v v--mono">{c.code}</span></div>
                            <div className="kv"><span className="k">Due Date</span><span className="v v--due">{c.dueDate}</span></div>
                          </div>
                          <p className="cond-note">{c.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}

            {filteredRows.length === 0 && (<div className="empty-card">No results. Adjust filters or search.</div>)}
          </div>

          {/* safe padding so the footer doesn't overlap the last card */}
          <div style={{ height: 120 }} />
        </div>
      </IonContent>

      {showFilter && (
        <div className="f-overlay" role="dialog" aria-modal id="filter-panel">
          <div className="f-panel" role="document">
            <div className="f-head">
              <div className="f-title">Filters</div>
              <button className="f-close" onClick={() => setShowFilter(false)} aria-label="Close">
                <img src={closeSm} alt="" />
              </button>
            </div>

            <div className="f-body">
              <div className="f-rail" role="tablist" aria-label="Filter sections">
                <button className={`f-rail-item ${filterTab === 'category' ? 'active' : ''}`} onClick={() => setFilterTab('category')} role="tab" aria-selected={filterTab === 'category'}>Condition<br/>Category</button>
                <button className={`f-rail-item ${filterTab === 'overdue' ? 'active' : ''}`}   onClick={() => setFilterTab('overdue')}  role="tab" aria-selected={filterTab === 'overdue'}>Overdue</button>
                <button className={`f-rail-item ${filterTab === 'pending' ? 'active' : ''}`}   onClick={() => setFilterTab('pending')}  role="tab" aria-selected={filterTab === 'pending'}>Pending</button>
              </div>

              <div className="f-content">
                {filterTab === 'category' && (
                  <div className="f-block">
                    <div className="f-row between">
                      <label className="f-check">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => { if (el) el.indeterminate = indeterminate; }}
                          onChange={(e) => { if (e.target.checked) setSelectedCategories([...ALL_CATEGORIES]); else setSelectedCategories([]); }}
                        />
                        <span>Select All</span>
                      </label>
                    </div>

                    <ul className="f-checklist">
                      {ALL_CATEGORIES.map((cat) => {
                        const on = selectedCategories.includes(cat);
                        return (
                          <li key={cat}>
                            <label className="f-check">
                              <input
                                type="checkbox"
                                checked={on}
                                onChange={(e) => {
                                  setSelectedCategories((prev) =>
                                    e.target.checked ? [...prev, cat] : prev.filter((c) => c !== cat)
                                  );
                                }}
                              />
                              <span>{cat}</span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

    
                {filterTab === 'pending' && (
                  <div className="f-block">
                  <div className="f-radio-col">
                    <label className="f-radio"><input type="radio" name="ov" checked={overdueRange === 'lt7'}  onChange={() => setOverdueRange('lt7')}  /><span>Less than 7 Days</span></label>
                    <label className="f-radio"><input type="radio" name="ov" checked={overdueRange === 'lt14'} onChange={() => setOverdueRange('lt14')} /><span>Less than 14 Days</span></label>
                    <label className="f-radio"><input type="radio" name="ov" checked={overdueRange === '7to14'} onChange={() => setOverdueRange('7to14')} /><span>7–14 Days</span></label>
                    <label className="f-radio"><input type="radio" name="ov" checked={overdueRange === 'all'}   onChange={() => setOverdueRange('all')}   /><span>All</span></label>
                  </div>
                </div>
              )}

                <div className="f-actions">
                  <button className="link" onClick={clearAllFilters}>Clear All</button>
                  <button className="btn-apply" onClick={() => setShowFilter(false)}>Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AppFooter active="home" />
    </>
  );
}
