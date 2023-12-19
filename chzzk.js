// ==UserScript==
// @name         Chzzk Chatting Enhancements
// @encoding     utf-8
// @namespace    https://github.com/dydtjr1128/Chzzk-Chatting-Enhancements
// @homepageURL  https://github.com/dydtjr1128/Chzzk-Chatting-Enhancements
// @supportURL   https://github.com/dydtjr1128/Chzzk-Chatting-Enhancements/issues
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
        const 최소값 = 50; // 어두운 색을 피하기 위한 최소값
        const 최대값 = 200; // 너무 밝은 색을 피하기 위한 최대값

        const 랜덤RGB값 = () => Math.floor(Math.random() * (최대값 - 최소값 + 1)) + 최소값;

        const 랜덤색상 = `rgb(${랜덤RGB값()}, ${랜덤RGB값()}, ${랜덤RGB값()})`;
        return 랜덤색상;
    }

    function 텍스트를_숫자로_변환(text) {
        let 숫자 = 0;

        for (let i = 0; i < text.length; i++) {
            // 각 문자의 아스키 코드 값을 더합니다.
            숫자 += text.charCodeAt(i);
        }

        // 0에서 randomColorNumber 사이의 범위로 조정합니다.
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
                        // name_text로 시작하는 엘리먼트의 값 가져오기
                        const textContent = element.textContent.trim();
                        element.style.color = 랜덤색상들[텍스트를_숫자로_변환(textContent)];
                        // 값에 따라 CSS 스타일 조정
                    });
                }
            });
        });
    });

    // 원하는 노드를 감시
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

})();
