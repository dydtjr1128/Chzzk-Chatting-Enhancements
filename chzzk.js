// ==UserScript==
// @name         Chzzk Chatting Enhancements
// @encoding     utf-8
// @namespace    https://github.com/dydtjr1128/Chzzk-Chatting-Enhancements
// @homepageURL  https://github.com/dydtjr1128/Chzzk-Chatting-Enhancements
// @supportURL   https://github.com/dydtjr1128/Chzzk-Chatting-Enhancements/issues
// @updateURL    https://raw.githubusercontent.com/dydtjr1128/Chzzk-Chatting-Enhancements/main/chzzk.js
// @downloadURL  https://raw.githubusercontent.com/dydtjr1128/Chzzk-Chatting-Enhancements/main/chzzk.js
// @version      2023-12-19
// @description  치지직 채팅 유저 색 변경 스크립트입니다.
// @match        https://chzzk.naver.com/*
// @grant        GM_addStyle
// ==/UserScript==


(function() {
    'use strict';
    console.log("스크립트 시작");
    const randomColorNumber =  20;

    function 랜덤색상생성() {
      const 색상 = Math.floor(Math.random() * 360); // 0부터 360까지의 색상 값
      const 채도 = Math.floor(Math.random() * 50) + 50; // 50부터 100까지의 채도 값 (더 진한 색)
      const 명도 = Math.floor(Math.random() * 40) + 50; // 50부터 90까지의 명도 값 (어두운 색)

      // HSL을 RGB로 변환
      const rgb색상 = hslToRgb(색상 / 360, 채도 / 100, 명도 / 100);

      return `rgb(${rgb색상[0]}, ${rgb색상[1]}, ${rgb색상[2]})`;
    }

    // HSL을 RGB로 변환하는 함수
    function hslToRgb(h, s, l){
        let r, g, b;

        if(s === 0){
            r = g = b = l; // 그레이 스케일
        } else {
            const hue2rgb = (p, q, t) => {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function 텍스트를_숫자로_변환(text) {
        let 숫자 = 0;

        for (let i = 0; i < text.length; i++) {
            // 각 문자의 아스키 코드 값을 더하기
            숫자 += text.charCodeAt(i);
        }

        // 0에서 randomColorNumber 사이의 범위로 조정
        숫자 = (숫자) % (randomColorNumber+1);

        return 숫자;
    }

    // 10개의 랜덤 색상 배열 생성
    const 랜덤색상들 = Array.from({ length: randomColorNumber }, 랜덤색상생성);
    // Mutation Observer를 사용하여 엘리먼트 변화 감지
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 새로 추가된 엘리먼트에 대한 처리
            mutation.addedNodes.forEach(addedNode => {
                if (addedNode.nodeType === 1) {
                  const elements = addedNode.querySelectorAll('[class^="live_chatting_list_item"] [class^="name_text"]');
                  elements.forEach(element => {
					   // 현재 시간을 가져오고 HH:mm 형식으로 포맷팅
                        const currentTime = new Date();
                        const hours = currentTime.getHours().toString().padStart(2, '0');
                        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
                        const timeText = `${hours}:${minutes}`;

                        // 새로운 span 엘리먼트 생성
                        const spanElement = document.createElement('span');
                        spanElement.textContent = `${timeText} `;

                        // 기존 엘리먼트의 자식으로 추가
                        element.parentNode.insertBefore(spanElement, element);
						
                        const textContent = element.textContent.trim();
                        // 값에 따라 CSS 스타일 조정
                        element.style.color = 랜덤색상들[텍스트를_숫자로_변환(textContent)];
                    });
                }
            });
        });
    });
document.querySelectorAll('[class^="live_chatting_list_donation"]')
document.querySelectorAll('[class^="live_chatting_list_item"]') 
    // 원하는 노드를 감시
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

})();
