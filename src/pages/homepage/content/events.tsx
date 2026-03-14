import React from "react";
import eventImg1 from "@/assets/event-img-1.webp";
import eventImg2 from "@/assets/event-img-2.webp";
import eventImg3 from "@/assets/event-img-3.webp";
import eventImg4 from "@/assets/event-img-4.webp";
import eventImg5 from "@/assets/event-img-5.webp";
import eventImg6 from "@/assets/event-img-6.webp";

export const EVENTS = [
  {
    title: "벚꽃을 보러 놀러가요.",
    titleHighlight: "봄나들이",
    description: (
      <>
        벚꽃을 보러 밖에 나가요.
        <br />
        가볍게 친해지기 딱 좋은 시간이에요.
      </>
    ),
    imgSrc: eventImg1,
  },
  {
    title: "선배에게 물어봐요.",
    titleHighlight: "멘토링",
    description: (
      <>
        학교 생활, 전공, 소모임 활용까지 —<br />
        먼저 겪어본 재학생 멘토한테 뭐든 물어볼 수 있어요.
      </>
    ),
    imgSrc: eventImg2,
  },
  {
    title: "미션을 풀며 친해져요.",
    titleHighlight: "짝선짝후",
    description: (
      <>
        선배·후배 짝지어 미션을 같이 풀어요.
        <br />
        어색함이 금방 사라져요.
      </>
    ),
    imgSrc: eventImg3,
  },
  {
    title: "직무에 대한 이야기를 들어요.",
    titleHighlight: "커피챗",
    description: (
      <>
        실제 일하고 있는 선배의 커리어 이야기를 직접 들어요.
        <br />
        취업, 진로 — 궁금한 거 바로 물어볼 수 있어요.
      </>
    ),
    imgSrc: eventImg4,
  },
  {
    title: "서비스로 구현하고 모의 투자를 받아요.",
    titleHighlight: "Flow: Startup Bridge",
    description: (
      <>
        아이디어톤에서 나아가 사업화까지 해요.
        <br />
        투자자 앞에서 IR 피칭으로 모의 투자를 받아요.
      </>
    ),
    imgSrc: eventImg5,
  },
  {
    title: "꾸준히 풀며 실력을 쌓아요.",
    titleHighlight: "잔디심기 챌린지",
    description: (
      <>
        매일 백준 문제를 풀며 점수를 쌓아요.
        <br />
        점수가 쌓이면 상품으로 돌아와요.
      </>
    ),
    imgSrc: eventImg4,
  },
  {
    title: "나만의 서비스를 기획해요.",
    titleHighlight: "아이디어톤",
    description: (
      <>
        팀이랑 사업 아이템을 기획하고,
        <br />
        멘토와 심사위원에게 직접 피드백을 받아요.
      </>
    ),
    imgSrc: eventImg5,
  },
  {
    title: "내 작품을 직접 전시해요.",
    titleHighlight: "미디어 아트 전시회",
    description: (
      <>
        감각적인 미디어 아트를 직접 만들고,
        <br />
        전시회를 열어 관람객을 맞이해요.
      </>
    ),
    imgSrc: eventImg6,
  },
  {
    title: "1박 2일로 같이 떠나요.",
    titleHighlight: "MT",
    description: (
      <>
        학기 중엔 못 나눈 이야기까지,
        <br />한 번에 가까워지는 시간이에요.
      </>
    ),
    imgSrc: eventImg6,
  },
] as const;
