import type { AskCharacter } from '../types/game';

const getMockAnswer = (characterId: string, question: string): string => {
  const normalized = question.replaceAll(' ', '');

  if (characterId === 'clara') {
    if (/반납|몇시|시간|시안/.test(normalized)) {
      return '오후 3시 11분에 시안을 빨간색 RP-03 포트폴리오에 넣어 반납했습니다. 시간은 분명히 기억해요.';
    }
    if (/그뒤|다음|어디|염색실/.test(normalized)) {
      return '반납 직후인 3시 14분에 염색실로 들어갔습니다. 4시 6분까지 그곳을 떠나지 않았어요.';
    }
    return '제가 직접 확인한 사실만 말씀드릴게요. 시안은 정해진 절차대로 아카이브에 반납했습니다.';
  }

  if (characterId === 'johannes') {
    if (/촬영|몇시|시간|마지막/.test(normalized)) {
      return '마지막 촬영은 오후 3시 40분쯤 끝났습니다. 그 뒤에는 장비를 정리하고 있었어요.';
    }
    if (/빨간|포트폴리오|RP-03/.test(normalized)) {
      return '빨간 포트폴리오요? 촬영실에서는 본 적 없습니다. 저는 촬영 장비만 신경 썼어요.';
    }
    return '촬영에 관한 질문이라면 짧게 답하죠. 사라진 시안에 대해서는 아는 것이 없습니다.';
  }

  return '그 질문에는 답하기 어렵습니다.';
};

export const mockAskCharacter: AskCharacter = async function* ({ characterId, question }) {
  const answer = getMockAnswer(characterId, question);

  for (const chunk of answer.match(/.{1,4}/gu) ?? []) {
    await new Promise((resolve) => window.setTimeout(resolve, 35));
    yield chunk;
  }
};

export const serverAskCharacter: AskCharacter = async function* ({ characterId, question }) {
  const res = await fetch('/api/interrogate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ characterId, question, history: [] }),
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
      const line = event.split('\n').find((item) => item.startsWith('data:'));
      if (!line) continue;

      const payload = line.slice(5).trim();
      if (payload === '[DONE]') return;

      try {
        const parsed = JSON.parse(payload) as { text?: string };
        if (parsed.text) yield parsed.text;
      } catch {
        // 잘못된 스트림 조각은 건너뛴다.
      }
    }
  }
};

// 실제 API가 준비되면 VITE_USE_REAL_INTERROGATION=true로 전환한다.
export const askCharacter: AskCharacter =
  import.meta.env.VITE_USE_REAL_INTERROGATION === 'true' ? serverAskCharacter : mockAskCharacter;
