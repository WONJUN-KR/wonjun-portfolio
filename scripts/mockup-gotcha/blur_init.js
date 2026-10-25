// 리뷰 작성자 닉네임(다른 사용자)만 흐리게 - 화면 표시만 바꿈
(() => {
  const NAMES = ["꾹크다스"];
  const run = () => document.querySelectorAll("p,span,div").forEach(el => {
    if (el.children.length === 0 && NAMES.includes(el.textContent.trim())) el.style.filter = "blur(5px)";
  });
  new MutationObserver(run).observe(document, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", run);
})();
