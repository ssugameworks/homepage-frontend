import { scrollTo } from "@/pages/homepage/hooks/useHomepageEffects";

export function CTASection() {
  return (
    <section className="flex min-h-100 w-full items-center justify-center px-10 pt-10 pb-20 lg:h-150 lg:py-0">
      <div className="flex w-full max-w-184 flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center gap-8 text-center text-ink">
          <span
            className="font-semibold tracking-[-3.2px] leading-[1.3]"
            style={{ fontSize: "clamp(36px,5vw,64px)" }}
          >
            즐겁게 몰입하고
            <br />
            함께 성장할 사람을 구해요
          </span>
          <span
            className="font-medium tracking-[-1.44px] leading-[1.3]"
            style={{ fontSize: "clamp(18px,2vw,28px)" }}
          >
            우리의 도전이 각자의 성장으로 이어질 것을 믿어요.
          </span>
        </div>
        <button
          onClick={() => scrollTo("apply")}
          className="group cursor-pointer whitespace-nowrap rounded-cta px-5 py-1.5 font-semibold text-[15px]"
          style={{
            background: "#1a7aff",
            color: "#fafafa",
            border: "1px solid #1a7aff",
          }}
        >
          <span className="font-semibold tracking-[-0.48px] leading-[1.3]">
            지원하러 가기 →
          </span>
        </button>
      </div>
    </section>
  );
}
