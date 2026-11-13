/* ========================================
   STAR CITY RAILWAY
   Main JavaScript
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");

  if (!mainContent) {
    console.error("ゲーム画面を読み込めませんでした。");
    return;
  }

  // 初期画面の読み込み完了
  document.body.classList.add("page-ready");

  console.log("STAR CITY RAILWAY");
  console.log("ゲームの初期化が完了しました。");
});
