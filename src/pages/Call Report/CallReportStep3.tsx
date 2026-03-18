import React, { useMemo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { IonContent } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './call-report-step3.css';

type ActivityLevel = '' | 'lt40' | 'b40_70' | 'gt70';
type YesNo = '' | 'yes' | 'no';
type VerifiedThrough = '' | 'gst' | 'ca' | 'customer' | 'other';

export default function CallReportStep3() {
  const history = useHistory();
  const { ctpt } = useParams<{ ctpt: string }>();

  const auto = useMemo(
    () => ({
      activity1: 'Data',
      industry: 'Data',
      subIndustry: 'Data',
      activity2: 'Data',
      camRefs: ['APP- 1234', 'APP- 1235'],
      projectedSalesPlaceholder: 'Auto-fetched from CAM / GST',
    }),
    []
  );

  const [installedCap, setInstalledCap] = useState('');
  const [elecNote, setElecNote] = useState('');
  const [elecFiles, setElecFiles] = useState<File[]>([]);
  const [capex, setCapex] = useState('');
  const [approxEmp, setApproxEmp] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('');
  const [endUseInline, setEndUseInline] = useState<YesNo>('');
  const [nonCompliance, setNonCompliance] = useState('');
  const [actualSales, setActualSales] = useState('');
  const [verifiedThrough, setVerifiedThrough] = useState<VerifiedThrough>('');
  const [variance, setVariance] = useState('');
  const [billsPaid, setBillsPaid] = useState<YesNo>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const reasonDisabled = endUseInline !== 'no';
  const formValid = true;

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files || []);
    setElecFiles(f);
  };
  const openCamNote = (id: string) => alert(`Open CAM Note for ${id}`);

  const onSave = () => {
    console.log('Step3 Save', {
      ctpt,
      installedCap,
      elecNote,
      elecFiles: elecFiles.map(f => f.name),
      capex,
      approxEmp,
      activityLevel,
      endUseInline,
      nonCompliance,
      actualSales,
      verifiedThrough,
      variance,
      billsPaid,
    });
    alert('Saved.');
  };

  const goBack = () => history.push(`/call-report/step-2/${encodeURIComponent(ctpt)}`);
  const goNext = () => history.push(`/call-report/step-4/${encodeURIComponent(ctpt)}`);

  return (
    <>
      <AppHeader title="Call Report" onBack={() => history.goBack()} />

      <IonContent className="cr3-content">
        <div className="page-shell">
          <div className="topbar bounded">
            <h2 className="cr3-h">Business Model</h2>
            <div className="topbar-rt">
              <span className="page-count">Page <strong>3</strong> of <strong>8</strong></span>
              <span className="ctpt-badge">CTPT- <strong>{ctpt}</strong></span>
            </div>
          </div>
          <div className="cr3-subnote bounded">All <span className="req">*</span> fields are mandatory</div>

          {/* Industry (auto) */}
          <div className="bounded">
            <div className="field">
              <label>Industry:</label>
            </div>
            <div className="auto-grid">
              <div className="auto-item">
                <div className="small-label">Activity:</div>
                <input className="pill readonly" readOnly value={auto.activity1} />
              </div>
              <div className="auto-item">
                <div className="small-label">Industry:</div>
                <input className="pill readonly" readOnly value={auto.industry} />
              </div>
              <div className="auto-item">
                <div className="small-label">Sub-Industry:</div>
                <input className="pill readonly" readOnly value={auto.subIndustry} />
              </div>
              <div className="auto-item">
                <div className="small-label">Activity:</div>
                <input className="pill readonly" readOnly value={auto.activity2} />
              </div>
            </div>
          </div>

          {/* Installed capacity */}
          <section className="card bounded">
            <div className="card-h">
              Installed Production Capacity and Utilized Capacity (in case of manufacturing):
            </div>
            <div className="pad">
              <textarea
                className="ta"
                placeholder="Add Comments"
                value={installedCap}
                onChange={e => setInstalledCap(e.target.value)}
              />
            </div>
          </section>

          {/* Electricity + upload */}
          <section className="card bounded">
            <div className="card-h">
              Electricity consumption in last two months &amp; whether paid (in case of manufacturer). (Attach bill if available):
            </div>
            <div className="pad">
              <div className="row-2">
                <textarea
                  className="ta"
                  placeholder="Add Comments"
                  value={elecNote}
                  onChange={e => setElecNote(e.target.value)}
                />
                <div className="upload-col">
                  <button
                    className="btn ghost full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📎 Upload Bill
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={onUpload}
                    style={{ display: 'none' }}
                  />
                  {!!elecFiles.length && (
                    <ul className="filelist">
                      {elecFiles.map(f => <li key={f.name}>{f.name}</li>)}
                    </ul>
                  )}
                </div>
              </div>

              <div className="field tight">
                <label>Are electricity bills paid as of the current month?</label>
                <div className="yn">
                  <label className={`yn-pill ${billsPaid === 'yes' ? 'on' : ''}`}>
                    <input
                      type="radio"
                      name="bpaid"
                      value="yes"
                      checked={billsPaid === 'yes'}
                      onChange={(e) => setBillsPaid(e.target.value as YesNo)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className={`yn-pill ${billsPaid === 'no' ? 'on' : ''}`}>
                    <input
                      type="radio"
                      name="bpaid"
                      value="no"
                      checked={billsPaid === 'no'}
                      onChange={(e) => setBillsPaid(e.target.value as YesNo)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Capex */}
          <section className="card bounded">
            <div className="card-h">
              In case of capex funding, Comments on asset verification (including plant &amp; machinery):
            </div>
            <div className="pad">
              <textarea
                className="ta"
                placeholder="Add Comments"
                value={capex}
                onChange={e => setCapex(e.target.value)}
              />
            </div>
          </section>

          {/* Employees */}
          <div className="field bounded">
            <label>No of Employees / workers present on duty on the day of visit:</label>
            <input
              className="pill"
              inputMode="numeric"
              placeholder="Enter Approximate Number"
              value={approxEmp}
              onChange={(e) => setApproxEmp(e.target.value.replace(/[^\d]/g, ''))}
            />
          </div>

          {/* Activity level */}
          <div className="field bounded">
            <label>Activity Level:</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            >
              <option value="">-select-</option>
              <option value="lt40">Less than 40%</option>
              <option value="b40_70">Between 40% to 70%</option>
              <option value="gt70">More than 70%</option>
            </select>
          </div>

          {/* End use at sanction – CAM notes */}
          <div className="field bounded">
            <label>End use of facilities at the time of Sanction:</label>
            <div className="cam-list">
              {auto.camRefs.map(id => (
                <div className="cam-row" key={id}>
                  <span className="chip">{id}</span>
                  <button className="link-btn" onClick={() => openCamNote(id)}>View CAM Note →</button>
                </div>
              ))}
            </div>
          </div>

          {/* Whether end use is in line */}
          <div className="field bounded">
            <label>Whether end use is in line with sanction?</label>
            <div className="yn">
              <label className={`yn-pill ${endUseInline === 'yes' ? 'on' : ''}`}>
                <input
                  type="radio"
                  name="inline"
                  value="yes"
                  checked={endUseInline === 'yes'}
                  onChange={(e) => setEndUseInline(e.target.value as YesNo)}
                />
                <span>Yes</span>
              </label>
              <label className={`yn-pill ${endUseInline === 'no' ? 'on' : ''}`}>
                <input
                  type="radio"
                  name="inline"
                  value="no"
                  checked={endUseInline === 'no'}
                  onChange={(e) => setEndUseInline(e.target.value as YesNo)}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Reason */}
          <div className="field bounded">
            <label>Reason of Non-compliance with end use:</label>
            <input
              className="pill"
              placeholder="Enter Reason"
              value={nonCompliance}
              onChange={(e) => setNonCompliance(e.target.value)}
              disabled={reasonDisabled}
            />
          </div>

          {/* Projected sales (auto) */}
          <div className="field bounded">
            <label>Projected Sales of Current Financial Year (INR Lakhs):</label>
            <input
              className="pill readonly"
              readOnly
              placeholder={auto.projectedSalesPlaceholder}
              value=""
            />
          </div>

          {/* Actual sales */}
          <div className="field bounded">
            <label>Actual Sales as on date of visit (INR Lakhs):</label>
            <input
              className="pill"
              inputMode="decimal"
              placeholder="Enter Sales figure"
              value={actualSales}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9.]/g, '');
                const fixed = v.split('.').length > 2 ? v.replace(/\.(?=.*\.)/g, '') : v;
                setActualSales(fixed);
              }}
            />
          </div>

          {/* Verified through */}
          <div className="field bounded">
            <label>Actual sales verified through:</label>
            <select
              value={verifiedThrough}
              onChange={(e) => setVerifiedThrough(e.target.value as VerifiedThrough)}
            >
              <option value="">-select-</option>
              <option value="gst">GST Returns</option>
              <option value="ca">CA Certified Financials</option>
              <option value="customer">Confirm from Customer</option>
              <option value="other">Others</option>
            </select>
            {verifiedThrough && (
              <div className="verify-pills">
                <div className="vpill active">
                  {verifiedThrough === 'gst' && 'Verified via GST portal summary'}
                  {verifiedThrough === 'ca' && 'Verified via CA-certified statements'}
                  {verifiedThrough === 'customer' && 'Verified via customer confirmation'}
                  {verifiedThrough === 'other' && 'Verified via other documentary evidence'}
                </div>
              </div>
            )}
          </div>

          {/* Variance */}
          <section className="card bounded">
            <div className="card-h">
              Comment on sales Variance between actual and projected:
            </div>
            <div className="pad">
              <textarea
                className="ta"
                placeholder="Add Comments"
                value={variance}
                onChange={(e) => setVariance(e.target.value)}
              />
            </div>
          </section>

          {/* ===== Sticky actions (always visible above AppFooter) ===== */}
          <div className="cr3-sticky-actions">
            <div className="bounded cr3-actions-inner">
              <button className="btn ghost big" onClick={goBack}>Back</button>
              <div className="spacer" />
              <button className="btn grad big" onClick={onSave}>Save</button>
              <button className="btn grad big" disabled={!formValid} onClick={goNext}>Next</button>
            </div>
          </div>

          {/* Bottom spacer so last card never hides behind sticky bar */}
          <div className="after-actions-spacer" />
        </div>
      </IonContent>
    </>
  );
}
