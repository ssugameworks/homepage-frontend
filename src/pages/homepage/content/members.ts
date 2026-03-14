import imgFrame7  from "@/assets/exec-img-1.webp";
import imgFrame8  from "@/assets/exec-img-2.webp";
import imgFrame9  from "@/assets/exec-img-3.webp";
import imgFrame10 from "@/assets/exec-img-4.webp";
import imgFrame11 from "@/assets/exec-img-5.webp";
import imgFrame12 from "@/assets/exec-img-6.webp";
import imgFrame13 from "@/assets/exec-img-7.webp";

export const MEMBERS = [
  { role: "회장",  name: "장윤아", desc: "기획과 디자인으로 팀의 방향을 함께 만들어가요.",          img: imgFrame7,  delay: 0,   style: { height: "112.66%", left: "-3.52%",   top: "-3.54%", width: "106.8%"  } },
  { role: "회장",  name: "조영찬", desc: "프론트엔드와 개발 운영으로 팀의 속도를 만들어요.",       img: imgFrame8,  delay: 80,  style: { height: "115.78%", left: "-4.82%",   top: "-5.19%", width: "109.76%" } },
  { role: "총무",  name: "박서영", desc: "일정과 운영을 꼼꼼하게 챙겨서 팀이 잘 돌아가게 해요.",  img: imgFrame9,  delay: 160, style: { height: "121.45%", left: "-10.96%",  top: "-7.3%",  width: "115.94%" } },
  { role: "부회장", name: "유다은", desc: "UX 디자인으로 결과물을 더 선명하게 만들어요.",           img: imgFrame10, delay: 0,   style: { height: "111.61%", left: "-3.17%",   top: "-5.98%", width: "105.81%" } },
  { role: "부회장", name: "최서정", desc: "백엔드 설계로 팀의 든든한 기반을 만들어요.",              img: imgFrame11, delay: 80,  style: { height: "111.78%", left: "-3.15%",   top: "-5.74%", width: "105.97%" } },
  { role: "부회장", name: "최지원", desc: "홍보와 콘텐츠로 게임웍스의 에너지를 밖으로 전해요.",    img: imgFrame12, delay: 160, style: { height: "110.35%", left: "-2.37%",   top: "-5.22%", width: "104.61%" } },
  { role: "부회장", name: "홍준우", desc: "프론트엔드 경험으로 팀의 구현 수준을 높여요.",           img: imgFrame13, delay: 240, style: { height: "102.78%", left: "-12.76%",  top: "-2.86%", width: "124.99%" } },
] as const;
