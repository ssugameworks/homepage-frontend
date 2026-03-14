import { scrollTo } from "@/pages/homepage/hooks/useHomepageEffects";

const imgFrame14 = "https://www.figma.com/api/mcp/asset/bbcfd9b9-ad14-4adb-9f2a-3a7f383b5089";

export function Footer() {
  return (
    <footer className="w-full bg-footer px-6 md:px-16 lg:px-28 pt-16 pb-10">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-0 max-w-300 mx-auto">
        <div className="flex flex-col gap-6 items-start max-w-75">
          <span className="font-semibold text-snow text-[24px] md:text-[32px] tracking-[-1.28px] leading-[1.3]">GAMEWORKS</span>
          <p className="font-medium text-muted text-[16px] md:text-[20px] tracking-[-0.5px] leading-[1.5]">
            2000년부터 이어진<br />글로벌미디어학부 대표 학술 소모임입니다.
          </p>
        </div>
        <div className="flex gap-12 md:gap-20 lg:gap-25">
          <div className="flex flex-col gap-4 items-start">
            <span className="font-semibold text-snow text-[18px] md:text-[24px] tracking-[-0.5px] leading-[1.3]">바로가기</span>
            <div className="flex flex-col gap-2 items-start">
              {[
                { label: "홈", id: "home" },
                { label: "활동", id: "event" },
                { label: "연혁", id: "history" },
                { label: "임원진", id: "people" },
              ].map(({ label, id }) => (
                <button key={label}
                  onClick={() => id === "home" ? window.scrollTo({ top: 0, behavior: "smooth" }) : scrollTo(id)}
                  className="font-medium text-muted text-[16px] md:text-[20px] tracking-[-0.5px] leading-[1.3] hover:text-snow transition-colors duration-200 bg-transparent cursor-pointer">
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 items-start">
            <span className="font-semibold text-snow text-[18px] md:text-[24px] tracking-[-0.5px] leading-[1.3] whitespace-nowrap">연락하기</span>
            <div className="flex flex-col gap-2 items-start">
              {["Instagram", "Discord", "~~~@gmail.com", "000 : 010-0000-0000"].map((item) => (
                <div key={item} className="flex gap-2.5 items-center group cursor-pointer">
                  <div className="relative shrink-0 size-4">
                    <div className="absolute inset-[-1.77%]">
                      <img alt="" className="block max-w-none size-full" src={imgFrame14} />
                    </div>
                  </div>
                  <span className="font-medium text-muted text-[16px] md:text-[20px] tracking-[-0.5px] leading-[1.3] whitespace-nowrap group-hover:text-snow transition-colors duration-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/10 font-medium text-muted text-[13px] md:text-[14px] text-center tracking-[-0.3px] leading-[1.5] max-w-300 mx-auto">
        <p>© 2026 GAMEWORKS, All rights reserved.</p>
        <p>25년째 같이 만들고 있는 학부 대표 소모임, GAMEWORKS</p>
      </div>
    </footer>
  );
}
