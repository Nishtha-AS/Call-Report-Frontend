import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './MyCustomers.css';

import searchIco from '../../assets/icon-search.svg';
import sortIco from '../../assets/sort-by-icon.svg';

type Customer = {
  id: string;
  initials: string;          // avatar circle
  name: string;              // Customer Legal Name
  ctpt: string;              // CTPT-XXXX
  branch: string;            // Originating Branch
  dateAdded: string;         // dd MMM yyyy (as in mock)
  callReportEnabled: boolean;
};

type SortKey = 'name' | 'date' | 'branch';

const CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    initials: 'RK',
    name: 'RK Enterprises',
    ctpt: 'CTPT-2344',
    branch: 'Mumbai',
    dateAdded: '19 Feb 2025',
    callReportEnabled: false,
  },
  {
    id: 'c2',
    initials: 'RE',
    name: 'Ram Enterprises',
    ctpt: 'CTPT-2345',
    branch: 'Mumbai',
    dateAdded: '20 Feb 2025',
    callReportEnabled: false,
  },
  {
    id: 'c3',
    initials: 'SE',
    name: 'Shyam Enterprises',
    ctpt: 'CTPT-2346',
    branch: 'Pune',
    dateAdded: '11 Feb 2025',
    callReportEnabled: true,
  },
];

function parsePrettyDate(s: string): number {
  // "19 Feb 2025" -> epoch for sorting
  const [d, m, y] = s.split(' ');
  const map: Record<string, number> = {
    Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5,
    Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11
  };
  return new Date(Number(y), map[m], Number(d)).getTime();
}

export default function MyCustomers() {
  const history = useHistory();

  const [query, setQuery] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // close sort popover on outside click
  const popRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    if (sortOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [sortOpen]);

  // derived list
  const rows = useMemo(() => {
    let out = [...CUSTOMERS];

    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter(c =>
        c.name.toLowerCase().includes(q) || c.ctpt.toLowerCase().includes(q)
      );
    }

    out.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortKey === 'branch') return a.branch.localeCompare(b.branch) * dir;
      // date
      return (parsePrettyDate(a.dateAdded) - parsePrettyDate(b.dateAdded)) * dir;
    });

    return out;
  }, [query, sortKey, sortDir]);

  const setSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setSortOpen(false);
  };

  const goCallReport = (ctpt: string) => {
    history.push(`/call-report/step-1/${encodeURIComponent(ctpt)}`);
  };

  return (
    <>
      <AppHeader title="My Customers" onBack={() => history.replace('/dashboard')} />

      <main className="mc-wrap">
        {/* Search + sort */}
        <div className="mc-top">
          <div className="mc-search">
            <img src={searchIco} alt="" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
            />
          </div>

          <div className="mc-sort" ref={popRef}>
            <button className="sort-trigger" onClick={() => setSortOpen(v => !v)} aria-haspopup="menu" aria-expanded={sortOpen}>
              <img src={sortIco} alt="" />
              <span>Sort By</span>
            </button>

            {sortOpen && (
              <div className="sort-pop" role="menu">
                <button className={`item ${sortKey==='name'?'on':''}`} onClick={() => setSort('name')}>Name {sortKey==='name' ? (sortDir==='asc'?'↑':'↓') : ''}</button>
                <button className={`item ${sortKey==='date'?'on':''}`} onClick={() => setSort('date')}>Date Added {sortKey==='date' ? (sortDir==='asc'?'↑':'↓') : ''}</button>
                <button className={`item ${sortKey==='branch'?'on':''}`} onClick={() => setSort('branch')}>Branch {sortKey==='branch' ? (sortDir==='asc'?'↑':'↓') : ''}</button>
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="mc-list">
          {rows.map(c => (
            <article className="mc-card" key={c.id}>
              <div className="mc-card__left">
                <div className="avatar">{c.initials}</div>

                <div className="meta">
                  <div className="line">
                    <span className="k">Customer Legal Name</span>
                    <span className="v v-name">{c.name}</span>
                  </div>

                  <div className="line">
                    <span className="k">CTPT-ID</span>
                    <span className="v">{c.ctpt}</span>
                  </div>

                  <div className="line">
                    <span className="k">Date added:</span>
                    <span className="v v-date">{c.dateAdded}</span>
                  </div>
                </div>
              </div>

              <div className="mc-card__right">
                <div className="kv">
                  <span className="k">Originating Branch</span>
                  <span className="v v-branch">{c.branch}</span>
                </div>

                <button
                  className={`cr-btn ${c.callReportEnabled ? 'active' : 'disabled'}`}
                  disabled={!c.callReportEnabled}
                  onClick={() => c.callReportEnabled && goCallReport(c.ctpt)}
                >
                  Call Report
                </button>
              </div>
            </article>
          ))}

          {rows.length === 0 && (
            <div className="mc-empty">No customers found.</div>
          )}
        </div>

        <div style={{ height: 96 }} />
      </main>

      <AppFooter active="home" />
    </>
  );
}
