import { Router } from 'express';
import { z } from 'zod';
import Case from '../models/Case.js';
import { generateMystery, LIMITS } from '../services/gemini.js';

const r = Router();
const httpErr = (status, message) => Object.assign(new Error(message), { status });
const wrap = fn => (req, res, next) => fn(req, res).catch(next);

// Never includes solution. Undiscovered clue text is hidden.
const pub = c => ({
  id: c._id, title: c.title, story: c.story, difficulty: c.difficulty, status: c.status,
  suspects: c.suspects,
  clues: c.clues.map(x => ({ id: x.id, title: x.title, discovered: x.discovered, text: x.discovered ? x.text : null })),
  hints: c.hints.slice(0, c.progress.hintsUsed).map(h => h.text),
  hintsUsed: c.progress.hintsUsed, hintsTotal: c.hints.length,
});

async function load(id, withSolution = false) {
  if (!/^[a-f\d]{24}$/i.test(id)) throw httpErr(404, 'Case not found');
  const c = await (withSolution ? Case.findById(id).select('+solution') : Case.findById(id));
  if (!c) throw httpErr(404, 'Case not found');
  return c;
}

function score(c, correct) {
  const base = correct ? LIMITS[c.difficulty].points : 0;
  const clues = c.clues.filter(x => x.discovered).length;
  return { base, cluePoints: clues * 5, hintPenalty: c.progress.hintsUsed * 10,
    total: Math.max(0, base + clues * 5 - c.progress.hintsUsed * 10) };
}

function result(c) {
  const culprit = c.suspects.find(s => s.id === c.solution.culpritId);
  return { correct: c.accusation.correct, score: c.score, breakdown: score(c, c.accusation.correct),
    culprit, explanation: c.solution.explanation, accusedId: c.accusation.suspectId };
}

r.post('/', wrap(async (req, res) => {
  const body = z.object({
    premise: z.string().trim().min(10).max(2000),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    title: z.string().trim().max(100).optional(),
  }).safeParse(req.body);
  if (!body.success) throw httpErr(400, 'Premise must be 10–2000 characters and difficulty easy/medium/hard');
  const m = await generateMystery(body.data.premise, body.data.difficulty, body.data.title);
  const c = await Case.create({
    title: m.title, premise: body.data.premise, story: m.story, difficulty: body.data.difficulty,
    suspects: m.suspects, clues: m.clues, hints: m.hints.map(text => ({ text })),
    solution: { culpritId: m.culpritId, explanation: m.explanation },
  });
  res.status(201).json(pub(c));
}));

r.get('/:id', wrap(async (req, res) => res.json(pub(await load(req.params.id)))));

r.post('/:id/clues/:clueId/discover', wrap(async (req, res) => {
  const c = await load(req.params.id);
  if (c.status === 'solved') throw httpErr(409, 'Case already closed');
  const clue = c.clues.find(x => x.id === req.params.clueId);
  if (!clue) throw httpErr(404, 'Clue not found');
  clue.discovered = true;
  await c.save();
  res.json(pub(c));
}));

r.post('/:id/hints', wrap(async (req, res) => {
  const c = await load(req.params.id);
  if (c.status === 'solved') throw httpErr(409, 'Case already closed');
  if (c.progress.hintsUsed >= c.hints.length) throw httpErr(400, 'No hints left');
  c.progress.hintsUsed += 1;
  await c.save();
  res.json({ hint: c.hints[c.progress.hintsUsed - 1].text, hintsUsed: c.progress.hintsUsed, hintsRemaining: c.hints.length - c.progress.hintsUsed });
}));

r.post('/:id/accuse', wrap(async (req, res) => {
  const c = await load(req.params.id, true);
  if (c.status === 'solved') throw httpErr(409, 'Case already closed');
  const suspectId = req.body?.suspectId;
  if (!c.suspects.some(s => s.id === suspectId)) throw httpErr(400, 'Invalid suspect');
  const correct = suspectId === c.solution.culpritId;
  c.accusation = { suspectId, correct };
  c.score = score(c, correct).total;
  c.status = 'solved';
  await c.save();
  res.json(result(c));
}));

r.get('/:id/result', wrap(async (req, res) => {
  const c = await load(req.params.id, true);
  if (c.status !== 'solved') throw httpErr(409, 'Case not solved yet');
  res.json(result(c));
}));

export default r;
