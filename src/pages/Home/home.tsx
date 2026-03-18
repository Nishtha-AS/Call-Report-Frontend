import React from 'react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './home.css';

import customersIco from '../../assets/customers icon.svg';
import reportsIco from '../../assets/reports.svg';
import tasksIco from '../../assets/tasks.svg';

export default function Home() {
  const history = useHistory();

  const future = { root: 5400, items: 6600 };
  const overdue = { root: 130, items: 370 };
  const total = 12300;

  const pie = { overdue: 5, next15: 15 };
  const sum = pie.overdue + pie.next15;
  const overdueSweep = (pie.overdue / sum) * 360;
  const next15Sweep = 360 - overdueSweep;

  const overdueMid = overdueSweep / 2;
  const next15Mid = overdueSweep + next15Sweep / 2;

  return (
    <>
      <AppHeader
        welcome={{ initials: 'JD', name: 'Welcome John!', sub: 'Relation Manager • AU SFB' }}
      />

      <main className="home">
        {/* ===== KPI (NEW UNIFIED DESIGN) ===== */}
        <section className="kpi kpi-unified-card" aria-label="Key metrics">
          <div className="kpi-total-ring">
            <div className="kpi-total-ring-inner">
              <div className="kpi-total-ring-label">Total</div>
              <div className="kpi-total-ring-value">{total.toLocaleString()}</div>
            </div>
          </div>

          <div className="kpi-details">
            <div
              className="kpi-details-section"
              onClick={() => history.replace('/future')}
              aria-label="Open Future"
            >
              <div className="kpi-details-title future">Future</div>
              <div className="kpi-details-row">
                <span className="kpi-details-label">Root:</span>{' '}
                <span className="kpi-details-value future">{future.root.toLocaleString()}</span>
              </div>
              <div className="kpi-details-row">
                <span className="kpi-details-label">Items:</span>{' '}
                <span className="kpi-details-value future">{future.items.toLocaleString()}</span>
              </div>
            </div>
            <div
              className="kpi-details-section"
              onClick={() => history.replace('/overdue')}
              aria-label="Open Overdue"
            >
              <div className="kpi-details-title overdue">Overdue</div>
              <div className="kpi-details-row">
                <span className="kpi-details-label">Root:</span>{' '}
                <span className="kpi-details-value overdue">{overdue.root.toLocaleString()}</span>
              </div>
              <div className="kpi-details-row">
                <span className="kpi-details-label">Items:</span>{' '}
                <span className="kpi-details-value overdue">{overdue.items.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Actions ===== */}
        <section className="actions" aria-label="Actions">
          <button className="action action-duo" onClick={() => history.replace('/my-customers')}>
            <img src={customersIco} alt="" /><span>My Customers</span>
          </button>
          <button className="action action-duo" onClick={() => history.replace('/call-reports')}>
            <img src={tasksIco} alt="" /><span>Call Reports</span>
          </button>
          <button className="action action-wide" onClick={() => history.replace('/reports')}>
            <img src={reportsIco} alt="" /><span>Reports</span>
          </button>
        </section>

        {/* ===== Call Report Condition ===== */}
        <section className="crc">
          <h3 className="crcTitle"><span className="bar" />Call Report Condition</h3>

          <div className="crcGrid">
            <svg className="pie" viewBox="0 0 180 180" aria-label="Pie chart">
              <circle cx="90" cy="90" r="78" fill="#5876ff" />
              <path d={describeArc(90, 90, 78, 0, overdueSweep)} fill="#ff3ba8" />

              <defs>
                <radialGradient id="pieShade2">
                  <stop offset="0%" stopColor="#000" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="90" cy="90" r="76" fill="url(#pieShade2)" opacity="0.06" />

              <text {...labelProps(pointOnCircle(90, 90, 40, overdueMid))} className="pieLabel">
                {pie.overdue}
              </text>
              <text {...labelProps(pointOnCircle(90, 90, 40, next15Mid))} className="pieLabel">
                {pie.next15}
              </text>
            </svg>

            <ul className="legend">
              <li><span className="dot pink" /><span className="lText">overdue</span></li>
              <li><span className="dot blue" /><span className="lText">overdue in next 15 days</span></li>
            </ul>
          </div>
        </section>

        <div className="footerSpacer" />
      </main>

      <AppFooter active="home" />
    </>
  );
}

/* helpers */
function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function describeArc(cx: number, cy: number, r: number, start: number, sweep: number) {
  const s = polarToCartesian(cx, cy, r, start + sweep);
  const e = polarToCartesian(cx, cy, r, start);
  const large = sweep <= 180 ? '0' : '1';
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} L ${cx} ${cy} Z`;
}
function pointOnCircle(cx: number, cy: number, r: number, deg: number) {
  const p = polarToCartesian(cx, cy, r, deg);
  return { x: p.x, y: p.y };
}
function labelProps({ x, y }: { x: number; y: number }) {
  return {
    x,
    y,
    textAnchor: 'middle' as const,
    dominantBaseline: 'middle' as const,
  };
}