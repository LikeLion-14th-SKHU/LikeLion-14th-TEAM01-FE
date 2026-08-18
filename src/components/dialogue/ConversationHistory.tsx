import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import type { Message } from '../../types/game';

interface Props {
  characterName: string;
  messages: Message[];
}

const formatTime = (createdAt?: string) => {
  if (!createdAt) return null;

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

export function ConversationHistory({ characterName, messages }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const questionCount = messages.filter((message) => message.role === 'detective').length;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight });
  }, [isOpen, messages]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex min-h-11 items-center gap-2 rounded-full border border-atelier-line bg-atelier-card/85 px-4 font-mono text-caption font-semibold text-atelier-text backdrop-blur transition-colors hover:border-atelier-gold/70 hover:text-atelier-gold"
      >
        <span aria-hidden className="text-atelier-gold">☰</span>
        대화 내역
        <span className="text-atelier-muted">{questionCount}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="대화 내역 닫기"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="conversation-history-title"
              className="relative flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-atelier-line bg-atelier-bg shadow-2xl md:max-h-[80dvh] md:rounded-2xl"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <header className="flex items-start justify-between gap-4 border-b border-atelier-line px-5 py-4 md:px-6">
                <div>
                  <p className="font-mono text-caption font-semibold tracking-label text-atelier-gold">
                    CONVERSATION LOG
                  </p>
                  <h2 id="conversation-history-title" className="mt-1 font-display text-card-title font-bold">
                    {characterName}와의 대화
                  </h2>
                  <p className="mt-1 text-meta text-atelier-muted">질문과 답변 {questionCount}건</p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="-mr-2 flex min-h-11 items-center gap-1.5 px-2 font-mono text-meta text-atelier-muted transition-colors hover:text-atelier-text"
                >
                  <span aria-hidden>✕</span> 닫기
                </button>
              </header>

              <div
                ref={historyRef}
                className="flex min-h-52 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 md:px-6"
              >
                {messages.length === 0 ? (
                  <div className="grid min-h-48 place-items-center text-center">
                    <div>
                      <p className="font-display text-body font-bold text-atelier-text">
                        아직 기록된 대화가 없습니다
                      </p>
                      <p className="mt-2 text-meta text-atelier-muted">
                        용의자에게 질문하면 이곳에 대화가 기록됩니다.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isDetective = message.role === 'detective';
                    const time = formatTime(message.createdAt);

                    return (
                      <article
                        key={message.id}
                        className={cn('flex flex-col', isDetective ? 'items-end' : 'items-start')}
                      >
                        <div className="mb-1.5 flex items-center gap-2 px-1 font-mono text-caption text-atelier-muted">
                          <span>{isDetective ? '나의 질문' : characterName}</span>
                          {time && <time dateTime={message.createdAt}>{time}</time>}
                        </div>
                        <p
                          className={cn(
                            'max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-body leading-relaxed md:max-w-[78%]',
                            isDetective
                              ? 'rounded-br-sm bg-atelier-gold text-atelier-bg'
                              : 'rounded-bl-sm border border-atelier-line bg-atelier-card text-atelier-text',
                          )}
                        >
                          {message.content || (message.pending ? '답변을 작성하고 있습니다…' : '')}
                        </p>
                      </article>
                    );
                  })
                )}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
