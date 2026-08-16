import type { Direction } from '../data/directions';
import type { ProductRecommendation } from '../types/product';
import { ScreenShell } from '../components/ui/ScreenShell';
import { Button } from '../components/ui/Button';
import { HoverZoomImage } from '../components/ui/HoverZoomImage';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Props {
  designerName: string;
  passEligible: boolean;
  direction: Direction | null;
  recommendations?: ProductRecommendation[];
  onPass: () => void;
}

export function HeritageScreen({
  designerName,
  passEligible,
  direction,
  recommendations = [],
  onPass,
}: Props) {
  return (
    <ScreenShell
      footer={
        <>
          <p className="mb-3 text-center text-meta text-atelier-muted">
            {passEligible
              ? '수사에 기여한 당신을 위해 특별한 보상이 준비되어 있습니다.'
              : '최종 추리에 실패해 Designer Pass를 발급할 수 없습니다.'}
          </p>
          <Button fullWidth onClick={onPass} disabled={!passEligible}>
            {passEligible ? 'Designer Pass 받기' : 'Designer Pass 발급 조건 미달'}
          </Button>
        </>
      }
    >
      <RevealGroup onView={false} stagger={0.08} className="flex flex-col items-center text-center">
        <Reveal>
          <p className="rounded-full border border-atelier-gold-dim px-4 py-2 font-mono text-caption font-semibold tracking-eyebrow text-atelier-gold">
            CASE CLOSED
          </p>
        </Reveal>
        <Reveal className="mt-4">
          <p className="font-mono text-small text-atelier-muted">디자이너 {designerName}</p>
        </Reveal>
        <Reveal className="mt-5">
          <h2 className="font-display text-display-sm font-bold">
            {passEligible ? (
              <>
                당신이 선택한 방향이
                <br />
                <span className="text-atelier-gold">하나의 가방으로 완성되었습니다.</span>
              </>
            ) : (
              <>
                사건은 종료되었지만
                <br />
                <span className="text-atelier-alert">디자인을 완성하지 못했습니다.</span>
              </>
            )}
          </h2>
        </Reveal>
      </RevealGroup>

      <Reveal delay={0.25} className="mt-9">
        <article
          className={
            passEligible
              ? 'overflow-hidden rounded-2xl border border-atelier-gold-dim bg-atelier-card md:grid md:grid-cols-[1.15fr_0.85fr]'
              : 'overflow-hidden rounded-2xl border border-atelier-line bg-atelier-card md:grid md:grid-cols-[1.15fr_0.85fr]'
          }
        >
          <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#f4f2ee] p-4 md:h-80 md:p-6">
            {direction ? (
              <img
                src={passEligible ? direction.artwork.complete : direction.artwork.silhouette}
                alt={
                  passEligible
                    ? `${direction.result.title} 완성 디자인`
                    : `${direction.title} 가방 실루엣`
                }
                className={
                  passEligible
                    ? 'h-full w-full object-contain'
                    : 'h-full w-full object-contain opacity-35 grayscale'
                }
              />
            ) : (
              <p className="font-mono text-meta text-paper-muted">선택한 디자인 정보가 없습니다.</p>
            )}
            <span className="absolute left-4 top-4 rounded-full bg-atelier-bg/85 px-3 py-1.5 font-mono text-micro font-semibold tracking-label text-atelier-gold backdrop-blur-sm">
              {passEligible ? 'YOUR COMPLETED DESIGN' : 'DESIGN INCOMPLETE'}
            </span>
          </div>

          <div className="flex flex-col justify-center p-5 md:p-7">
            <p className="font-mono text-caption font-semibold tracking-eyebrow text-atelier-gold">
              {direction?.track ?? 'SELECTED DESIGN'}
            </p>
            <h3 className="mt-2 font-display text-display-md font-bold">
              {passEligible
                ? direction?.result.title ?? '완성된 가방'
                : '완성되지 않은 디자인'}
            </h3>
            <p className="mt-3 text-small text-atelier-muted text-pretty">
              {passEligible
                ? direction?.result.description
                : '최종 추리에 실패해 선택한 실루엣의 디자인 단계를 완료하지 못했습니다.'}
            </p>

            {passEligible && direction?.result.productUrl ? (
              <a
                href={direction.result.productUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md border border-atelier-gold px-5 font-display text-small font-bold text-atelier-gold transition-colors hover:bg-atelier-gold/10"
              >
                제품 상세 보기 ↗
              </a>
            ) : passEligible ? (
              <span className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md border border-atelier-line px-5 font-display text-small font-bold text-atelier-muted/70">
                제품 링크 준비 중
              </span>
            ) : null}
          </div>
        </article>
      </Reveal>

      {direction && (
        <section className="mt-11" aria-labelledby="recommended-products-title">
          <Reveal>
            <p className="font-mono text-caption font-semibold tracking-eyebrow text-atelier-gold">
              RECOMMENDED FOR YOU
            </p>
            <h3 id="recommended-products-title" className="mt-2 font-display text-display-sm font-bold">
              {direction.title} 카테고리 추천 가방
            </h3>
            <p className="mt-2 text-small text-atelier-muted">
              선택한 디자인 방향과 어울리는 제품을 만나보세요.
            </p>
          </Reveal>

          {recommendations.length > 0 ? (
            <RevealGroup
              stagger={0.08}
              className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {recommendations.map((product) => (
                <Reveal key={product.id}>
                  <article className="group h-full overflow-hidden rounded-xl border border-atelier-line bg-atelier-card">
                    <HoverZoomImage
                      src={product.imageUrl}
                      alt={product.name}
                      useGroupHover
                      className="h-52 w-full bg-[#f4f2ee]"
                      imageClassName="object-contain p-4"
                    />
                    <div className="p-4">
                      <h4 className="font-display text-card-title font-bold">{product.name}</h4>
                      {product.description && (
                        <p className="mt-2 text-small text-atelier-muted text-pretty">
                          {product.description}
                        </p>
                      )}
                      {product.price && (
                        <p className="mt-2 font-mono text-meta text-atelier-text">{product.price}</p>
                      )}
                      <a
                        href={product.productUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block font-mono text-meta font-semibold text-atelier-gold hover:text-atelier-text"
                      >
                        제품 상세 보기 ↗
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </RevealGroup>
          ) : (
            <Reveal delay={0.15} className="mt-5">
              <div className="rounded-xl border border-dashed border-atelier-line bg-atelier-card/70 px-5 py-10 text-center">
                <p className="font-display text-body font-bold">추천 상품을 준비하고 있습니다.</p>
                <p className="mt-2 text-small text-atelier-muted">
                  백엔드 연동 후 {direction.title} 카테고리의 상품이 이곳에 표시됩니다.
                </p>
              </div>
            </Reveal>
          )}
        </section>
      )}
    </ScreenShell>
  );
}
