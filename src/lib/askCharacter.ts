import type { AskCharacter } from '../types/game';

export const askCharacter: AskCharacter = async function* ({ characterId, question }) {
  const res = await fetch('/api/interrogate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ characterId, question, history }),
  });

  if (!res.ok || !res.body) throw new Error('답변을 가져오지 못했습니다. (' + res.status + ')');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const line = event.split('\n').find((l) => l.startsWith('data:'));
      if (!line) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        const parsed = JSON.parse(payload) as { text?: string };
        if (parsed.text) yield parsed.text;
      } catch {
        // ignore
      }
    }
  }
};

export const mockAskCharacter: AskCharacter = async function* ({ question }) {
  const answer =
    '"' + question.slice(0, 12) + '..." 라고 물으셨죠. 오후 3시 11분에 시안을 빨간색 포트폴리오에 넣어 반납했습니다. 그 뒤로는 염색실에만 있었어요.';
  for (const chunk of answer.match(/.{1,4}/gu) ?? []) {
    await new Promise((r) => setTimeout(r, 45));
    yield chunk;
  }
};
