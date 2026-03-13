export function CTASection() {
  return (
    <section className="flex min-h-100 w-full items-center justify-center px-10 py-20 lg:h-150 lg:py-0">
      <div className="flex w-full max-w-184 flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center gap-8 text-center text-ink">
          <span
            className="w-full font-semibold tracking-[-3.2px] leading-[1.3]"
            style={{ fontSize: "clamp(36px,6vw,80px)" }}
          >
            들어오면 6가지 프로그램을
            <br />
            전부 경험할 수 있어요
          </span>
          <span
            className="w-full font-medium tracking-[-1.44px] leading-[1.3]"
            style={{ fontSize: "clamp(20px,2.8vw,36px)" }}
          >
            봄나들이부터 아이디어톤, MT까지 —
            <br />
            포트폴리오에 쓸 결과물도 만들어요.
          </span>
        </div>
        <button
          className="group cursor-pointer whitespace-nowrap rounded-[56px] px-5 py-1.5 font-semibold text-[15px]"
          style={{
            background: "#1a7aff",
            color: "#fafafa",
            border: "1px solid #1a7aff",
          }}
        >
          <span className="font-semibold tracking-[-0.48px] leading-[1.3] whitespace-nowrap">
            지원하러 가기 →
          </span>
        </button>
      </div>
    </section>
  );
}
