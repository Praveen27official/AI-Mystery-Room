import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import * as api from './api.js';

const btnGold = 'inline-flex items-center justify-center rounded-[4px] bg-[#d9a85b] px-6 py-3 font-semibold text-[#0c0b09] hover:bg-[#c99648] transition-colors disabled:opacity-40 disabled:cursor-not-allowed tracking-wide text-sm cursor-pointer';
const btnGhost = 'inline-flex items-center justify-center rounded-[4px] border border-[#2a2620] px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#8c857a] hover:text-[#f2ede4] hover:border-[#8c857a] transition-colors disabled:opacity-40 cursor-pointer';
const panel = 'rounded-[4px] border border-[#2a2620] bg-[#12110e]';
const monoLabel = 'font-mono text-[11px] uppercase tracking-widest text-[#8c857a]';

const Err = ({ msg }) => msg ? (
  <div className="rounded-[4px] border border-red-900/50 bg-red-950/30 p-3.5 text-xs text-red-200 font-mono flex items-start gap-2.5">
    <span className="text-red-400 font-bold">⚠</span>
    <span className="leading-relaxed">{msg}</span>
  </div>
) : null;

const Spin = ({ text, subtext = 'Synthesizing evidence, suspect testimonies and forensic trails…' }) => (
  <div className={`${panel} p-12 text-center max-w-lg mx-auto space-y-4 my-12`}>
    <div className="flex justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border border-[#2a2620]"></div>
        <div className="absolute inset-0 rounded-full border-t-2 border-[#d9a85b] animate-spin"></div>
      </div>
    </div>
    <div className={monoLabel}>CASE ENGINE ACTIVE</div>
    <h3 className="text-xl font-serif text-[#f2ede4]">{text}</h3>
    <p className="text-xs text-[#8c857a] leading-relaxed max-w-sm mx-auto">{subtext}</p>
  </div>
);

function Home() {
  return (
    <div className="py-12 md:py-20 space-y-16">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#8c857a] px-3 py-1 rounded-[4px] border border-[#2a2620] bg-[#12110e]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d9a85b] animate-pulse"></span>
          ARCHIVE DOSSIER · NOIR ENGINE
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif leading-[1.1] text-[#f2ede4]">
          Every good case starts with a <span className="text-[#d9a85b] italic">what if.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#8c857a] max-w-xl mx-auto leading-relaxed">
          Provide a premise. The system weaves the scene, suspects, hidden motives, and a web of forensics. Investigate the evidence, interrogate your theories, and unmask the culprit.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/create" className={btnGold}>
            Start a Mystery →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-6">
        <div className={`${panel} p-5 space-y-2`}>
          <div className="font-mono text-[11px] tracking-widest text-[#d9a85b]">01 · LOGICAL INTEGRITY</div>
          <h4 className="font-serif text-base text-[#f2ede4]">Solvable by Deduction</h4>
          <p className="text-xs text-[#8c857a] leading-relaxed">
            Every case is guaranteed solvable: multiple clues interlock to convict the culprit while eliminating innocent suspects.
          </p>
        </div>
        <div className={`${panel} p-5 space-y-2`}>
          <div className="font-mono text-[11px] tracking-widest text-[#d9a85b]">02 · SEALED SECRECY</div>
          <h4 className="font-serif text-base text-[#f2ede4]">Zero Spoilers</h4>
          <p className="text-xs text-[#8c857a] leading-relaxed">
            The culprit identity and hidden solution stay strictly protected on the backend until you commit your formal accusation.
          </p>
        </div>
        <div className={`${panel} p-5 space-y-2`}>
          <div className="font-mono text-[11px] tracking-widest text-[#d9a85b]">03 · FORENSIC SCORING</div>
          <h4 className="font-serif text-base text-[#f2ede4]">Detective Rating</h4>
          <p className="text-xs text-[#8c857a] leading-relaxed">
            Earn points for every clue unraveled, balance penalties for requested hints, and aim for maximum score.
          </p>
        </div>
      </div>
    </div>
  );
}

function Create() {
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [premise, setPremise] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const samplePremise = "During an exclusive midnight auction at the snowbound Blackwood Estate, the host's prized 17th-century emerald signet ring vanishes from a locked glass display case just as a sudden power outage plunges the gallery into darkness.";
  const sampleTitle = "The Blackwood Masquerade";

  const useSample = () => {
    setTitle(sampleTitle);
    setPremise(samplePremise);
    setError('');
  };

  const submit = async () => {
    if (premise.trim().length < 10) return setError('The scenario must be at least 10 characters.');
    setLoading(true);
    setError('');
    try {
      const c = await api.createCase(premise.trim(), difficulty, title.trim() || undefined);
      nav(`/case/${c.id}`);
    } catch (e) {
      setError(api.errMsg(e));
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Spin
        text="The detectives are gathering evidence…"
        subtext="Correlating suspect profiles, scattering forensic clues, and sealing the solution. This can take ~20 seconds."
      />
    );
  }

  const difficulties = [
    { id: 'easy', name: 'Straightforward', subtitle: '3 suspects · 5 clues' },
    { id: 'medium', name: 'Considered', subtitle: '4 suspects · 7 clues' },
    { id: 'hard', name: 'Labyrinthine', subtitle: '5 suspects · 9 clues' },
  ];

  return (
    <div className="py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[#8c857a]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          CASE DESIGN
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f2ede4] leading-[1.15]">
          Every good case starts with a <span className="text-[#d9a85b] italic">what if.</span>
        </h1>

        <p className="text-sm text-[#8c857a] leading-relaxed">
          Supply the circumstances of an unexplained crime. The case generator will orchestrate the suspects, weave their motives, scatter forensic clues, and seal the true culprit until accusation.
        </p>

        {/* 3-item checklist with check icons */}
        <div className="space-y-3 pt-2">
          {[
            'One solvable case, built around your premise',
            'Every clue has a place in the story',
            'Your solution stays hidden until you decide',
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="w-4 h-4 rounded-full border border-[#d9a85b]/60 flex items-center justify-center text-[#d9a85b] text-[10px] shrink-0 mt-0.5">
                ✓
              </span>
              <span className="text-xs sm:text-sm text-[#f2ede4]">{item}</span>
            </div>
          ))}
        </div>

        {/* Bordered note box */}
        <div className="rounded-[4px] border border-[#2a2620] bg-[#12110e] p-4 text-xs text-[#8c857a] leading-relaxed">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#d9a85b] mb-1">A note on the stories</p>
          Your scenario becomes a fictional game case. Never use real people or active investigations.
        </div>
      </div>

      {/* Right Column: Bordered Panel */}
      <div className="lg:col-span-7">
        <div className="rounded-[4px] border border-[#2a2620] bg-[#12110e] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#2a2620] pb-4">
            <div>
              <div className="font-mono text-[11px] tracking-widest uppercase text-[#8c857a]">BUILD YOUR CASE</div>
              <h2 className="text-2xl font-serif text-[#f2ede4] mt-1">The brief</h2>
            </div>
            <span className="font-mono text-[11px] tracking-widest text-[#d9a85b]">01 — 03</span>
          </div>

          {/* Field: CASE TITLE (optional) */}
          <div className="space-y-2">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8c857a]">
              CASE TITLE (OPTIONAL)
            </label>
            <input
              type="text"
              maxLength={100}
              placeholder="e.g. The Midnight Masquerade"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-[4px] border border-[#2a2620] bg-[#0c0b09] px-3.5 py-2.5 text-sm text-[#f2ede4] placeholder-[#8c857a]/40 focus:border-[#d9a85b] focus:outline-none transition-colors"
            />
          </div>

          {/* Field: THE SCENARIO (required) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-wider text-[#8c857a]">
                THE SCENARIO (REQUIRED)
              </label>
              <span className="font-mono text-[11px] text-[#8c857a]">
                {premise.length} / 2,000
              </span>
            </div>
            <textarea
              rows={5}
              maxLength={2000}
              placeholder="e.g. A priceless sapphire vanished from the locked study of Lord Sterling during the storm..."
              value={premise}
              onChange={e => setPremise(e.target.value)}
              className="w-full rounded-[4px] border border-[#2a2620] bg-[#0c0b09] p-3.5 text-sm text-[#f2ede4] placeholder-[#8c857a]/40 focus:border-[#d9a85b] focus:outline-none transition-colors leading-relaxed"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[#8c857a] text-[11px]">Minimum 10 characters. Describe the setting and incident.</span>
              <button
                type="button"
                onClick={useSample}
                className="text-[11px] font-mono text-[#d9a85b] hover:text-[#c99648] underline underline-offset-2 transition-colors cursor-pointer"
              >
                Use a sample case
              </button>
            </div>
          </div>

          {/* Field: CASE DIFFICULTY */}
          <div className="space-y-2">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#8c857a]">
              CASE DIFFICULTY
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {difficulties.map(d => {
                const active = difficulty === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`rounded-[4px] border p-3.5 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      active
                        ? 'border-[#d9a85b] bg-[#d9a85b]/5'
                        : 'border-[#2a2620] bg-[#0c0b09] hover:border-[#8c857a]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-semibold text-[#f2ede4]">{d.name}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          active ? 'border-[#d9a85b]' : 'border-[#8c857a]/40'
                        }`}
                      >
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#d9a85b]"></span>}
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-[#8c857a]">{d.subtitle}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <Err msg={error} />

          <button className={`${btnGold} w-full`} onClick={submit}>
            Open the case
          </button>
        </div>
      </div>
    </div>
  );
}

function Investigation() {
  const { id } = useParams();
  const nav = useNavigate();
  const [c, setC] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getCase(id).then(setC).catch(e => setError(api.errMsg(e)));
  }, [id]);

  if (error && !c) return <div className="py-12 max-w-lg mx-auto"><Err msg={error} /></div>;
  if (!c) return <Spin text="Opening case dossier…" subtext="Accessing encrypted evidence log and witness reports." />;
  if (c.status === 'solved') return <Navigate to={`/case/${id}/result`} replace />;

  const found = c.clues.filter(x => x.discovered).length;
  const run = async fn => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(api.errMsg(e));
    }
    setBusy(false);
  };

  const discover = clueId => run(async () => setC(await api.discoverClue(id, clueId)));
  const hint = () => run(async () => {
    await api.requestHint(id);
    setC(await api.getCase(id));
  });

  return (
    <div className="space-y-8 py-6">
      {/* Top Header Banner */}
      <div className={`${panel} p-6 sm:p-8 space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2a2620] pb-3">
          <div className="font-mono text-[11px] tracking-widest uppercase text-[#8c857a]">
            CASE DOSSIER · REF: #{id.slice(-6).toUpperCase()}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#d9a85b] px-2 py-0.5 rounded-[2px] bg-[#d9a85b]/10 border border-[#d9a85b]/30">
              {c.difficulty}
            </span>
            <span className="font-mono text-[11px] tracking-wider text-[#8c857a]">
              {found} / {c.clues.length} CLUES DISCOVERED
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif text-[#f2ede4] leading-tight">
          {c.title}
        </h1>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-1">
          <div className="h-1.5 w-full rounded-[2px] bg-[#2a2620] overflow-hidden">
            <div
              className="h-full bg-[#d9a85b] transition-all duration-300"
              style={{ width: `${(found / c.clues.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Story Narrative Box */}
      <div className={`${panel} p-6 sm:p-8 space-y-3`}>
        <div className={monoLabel}>THE CIRCUMSTANCES</div>
        <p className="whitespace-pre-line text-[#f2ede4]/90 text-sm sm:text-base leading-relaxed">
          {c.story}
        </p>
      </div>

      <Err msg={error} />

      {/* Suspects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={monoLabel}>SUSPECT ROSTER ({c.suspects.length})</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {c.suspects.map((s, idx) => (
            <div key={s.id} className={`${panel} p-5 space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wider text-[#d9a85b]">
                  SUSPECT 0{idx + 1}
                </span>
                <span className="font-mono text-[11px] text-[#8c857a]">{s.role}</span>
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#f2ede4]">{s.name}</h4>
              <p className="text-xs sm:text-sm text-[#8c857a] leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clues Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={monoLabel}>PHYSICAL EVIDENCE & FORENSICS ({c.clues.length})</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {c.clues.map((x, idx) => (
            <div
              key={x.id}
              className={`rounded-[4px] border p-5 flex flex-col justify-between gap-3 transition-colors ${
                x.discovered
                  ? 'border-[#2a2620] bg-[#12110e]'
                  : 'border-[#2a2620]/60 bg-[#0c0b09] opacity-80'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-wider text-[#8c857a]">
                    CLUE 0{idx + 1}
                  </span>
                  {x.discovered ? (
                    <span className="font-mono text-[10px] text-[#d9a85b] tracking-wider uppercase">
                      ✓ EXAMINED (+5)
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-[#8c857a] tracking-wider uppercase">
                      🔒 UNEXAMINED
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-base font-semibold text-[#f2ede4]">{x.title}</h4>
                {x.discovered ? (
                  <p className="text-xs sm:text-sm text-[#f2ede4]/85 leading-relaxed pt-1">
                    {x.text}
                  </p>
                ) : (
                  <p className="text-xs text-[#8c857a] italic">
                    Evidence sealed in archive. Requires examination to reveal findings.
                  </p>
                )}
              </div>

              {!x.discovered && (
                <div className="pt-2">
                  <button
                    disabled={busy}
                    onClick={() => discover(x.id)}
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#d9a85b] px-3.5 py-1.5 text-xs font-semibold text-[#0c0b09] hover:bg-[#c99648] transition-colors disabled:opacity-40 cursor-pointer font-mono tracking-wide"
                  >
                    🔍 Investigate (+5)
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hints Section */}
      <div className={`${panel} p-6 sm:p-8 space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2a2620] pb-3">
          <div className={monoLabel}>
            CONFIDENTIAL HINTS ({c.hintsUsed} / {c.hintsTotal})
          </div>
          <span className="font-mono text-[11px] text-[#8c857a]">
            −10 points deducted per hint
          </span>
        </div>

        {c.hints.length > 0 ? (
          <ul className="space-y-2">
            {c.hints.map((h, i) => (
              <li key={i} className="text-xs sm:text-sm text-[#f2ede4] flex items-start gap-2.5">
                <span className="font-mono text-[11px] text-[#d9a85b] shrink-0 mt-0.5">#{i + 1}</span>
                <span className="leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[#8c857a] italic">
            No hints requested yet. Consult informants only when stumped.
          </p>
        )}

        <div className="pt-1">
          <button
            disabled={busy || c.hintsUsed >= c.hintsTotal}
            onClick={hint}
            className={btnGhost}
          >
            💡 Request hint (−10 pts)
          </button>
        </div>
      </div>

      {/* Action to Accuse */}
      <div className="pt-4 flex justify-end">
        <button className={btnGold} onClick={() => nav(`/case/${id}/accuse`)}>
          Make Accusation →
        </button>
      </div>
    </div>
  );
}

function Accusation() {
  const { id } = useParams();
  const nav = useNavigate();
  const [c, setC] = useState(null);
  const [pick, setPick] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getCase(id).then(setC).catch(e => setError(api.errMsg(e)));
  }, [id]);

  if (!c) return error ? <div className="py-12 max-w-lg mx-auto"><Err msg={error} /></div> : <Spin text="Opening indictment files…" />;

  const submit = async () => {
    setBusy(true);
    try {
      await api.accuse(id, pick);
      nav(`/case/${id}/result`);
    } catch (e) {
      setError(api.errMsg(e));
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div className="space-y-2">
        <div className={monoLabel}>FORMAL INDICTMENT</div>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#f2ede4]">
          Who is the <span className="text-[#d9a85b] italic">culprit?</span>
        </h2>
        <p className="text-sm text-[#8c857a] leading-relaxed">
          Select the suspect you believe perpetrated the crime based on discovered clues and witness testimonies. Once submitted, your accusation is final.
        </p>
      </div>

      <div className="space-y-3">
        {c.suspects.map(s => {
          const active = pick === s.id;
          return (
            <label
              key={s.id}
              className={`rounded-[4px] border p-4.5 cursor-pointer transition-all flex items-start gap-4 ${
                active
                  ? 'border-[#d9a85b] bg-[#d9a85b]/5'
                  : 'border-[#2a2620] bg-[#12110e] hover:border-[#8c857a]/60'
              }`}
            >
              <div className="pt-1">
                <input
                  type="radio"
                  name="suspect"
                  checked={active}
                  onChange={() => setPick(s.id)}
                  className="hidden"
                />
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    active ? 'border-[#d9a85b]' : 'border-[#8c857a]/40'
                  }`}
                >
                  {active && <span className="w-2 h-2 rounded-full bg-[#d9a85b]"></span>}
                </div>
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base font-semibold text-[#f2ede4]">
                    {s.name}
                  </span>
                  <span className="font-mono text-[11px] text-[#8c857a]">{s.role}</span>
                </div>
                <p className="text-xs text-[#8c857a] leading-relaxed">{s.description}</p>
              </div>
            </label>
          );
        })}
      </div>

      <Err msg={error} />

      <div className="flex items-center gap-4 pt-2">
        <button
          className={btnGold}
          disabled={!pick || busy}
          onClick={submit}
        >
          {busy ? 'Delivering Verdict…' : 'Accuse Suspect'}
        </button>
        <Link to={`/case/${id}`} className={btnGhost}>
          Return to Evidence
        </Link>
      </div>
    </div>
  );
}

function Results() {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getResult(id).then(setR).catch(e => setError(api.errMsg(e)));
  }, [id]);

  if (!r) return error ? <div className="py-12 max-w-lg mx-auto"><Err msg={error} /></div> : <Spin text="Reading the coroner and court verdict…" />;

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8 text-center">
      <div className="space-y-3">
        <div className={monoLabel}>VERDICT DELIVERED</div>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#f2ede4]">
          {r.correct ? (
            <>Case <span className="text-[#d9a85b] italic">Solved.</span></>
          ) : (
            <>Wrong <span className="text-red-400 italic">Suspect.</span></>
          )}
        </h2>
        <p className="text-xs sm:text-sm text-[#8c857a]">
          {r.correct
            ? 'Your deductive reasoning caught the guilty party.'
            : 'An innocent party was accused, but the true culprit has been revealed.'}
        </p>
      </div>

      {/* Big Gold Score Panel */}
      <div className={`${panel} p-8 space-y-4`}>
        <div className={monoLabel}>FINAL DETECTIVE SCORE</div>
        <div className="text-6xl sm:text-7xl font-serif font-bold text-[#d9a85b]">
          {r.score} <span className="text-2xl font-mono text-[#8c857a] font-normal">PTS</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-[#2a2620]">
          <div className="font-mono text-xs text-[#8c857a]">
            Base <span className="text-[#f2ede4]">+{r.breakdown.base}</span>
          </div>
          <span className="text-[#2a2620]">·</span>
          <div className="font-mono text-xs text-[#8c857a]">
            Clues <span className="text-[#f2ede4]">+{r.breakdown.cluePoints}</span>
          </div>
          <span className="text-[#2a2620]">·</span>
          <div className="font-mono text-xs text-[#8c857a]">
            Hints <span className="text-[#f2ede4]">−{r.breakdown.hintPenalty}</span>
          </div>
        </div>
      </div>

      {/* Bordered Culprit Card */}
      <div className={`${panel} p-6 sm:p-8 text-left space-y-3`}>
        <div className="flex items-center justify-between border-b border-[#2a2620] pb-2">
          <span className="font-mono text-[11px] tracking-widest text-[#d9a85b] uppercase">
            THE TRUE CULPRIT
          </span>
          <span className="font-mono text-[11px] text-[#8c857a]">{r.culprit.role}</span>
        </div>
        <h3 className="font-serif text-2xl font-semibold text-[#f2ede4]">{r.culprit.name}</h3>
        <p className="text-sm text-[#f2ede4]/90 leading-relaxed whitespace-pre-line pt-1">
          {r.explanation}
        </p>
      </div>

      <div className="pt-4">
        <Link to="/create" className={btnGold}>
          Start a New Mystery →
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0c0b09] text-[#f2ede4] font-sans antialiased selection:bg-[#d9a85b]/30 selection:text-[#f2ede4]">
      {/* Editorial Header */}
      <header className="border-b border-[#2a2620] bg-[#12110e]/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#d9a85b] group-hover:scale-110 transition-transform"></span>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#f2ede4]">
              AI MYSTERY <span className="text-[#d9a85b] italic">ROOM</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/create"
              className="font-mono text-[11px] uppercase tracking-wider text-[#8c857a] hover:text-[#d9a85b] transition-colors"
            >
              + New Case
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/case/:id" element={<Investigation />} />
          <Route path="/case/:id/accuse" element={<Accusation />} />
          <Route path="/case/:id/result" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
