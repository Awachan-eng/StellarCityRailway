/* ========================================
   STELLAR CITY RAILWAY
   Main JavaScript
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");
  const homeButton = document.getElementById("home-button");

  // 画面切り替え
  function showScreen(screenId) {
    screens.forEach((screen) => {
      screen.classList.toggle("active", screen.id === screenId);
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // メインメニューのボタン
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.screen);
    });
  });

  // ヘッダーのロゴからホームへ戻る
  homeButton.addEventListener("click", () => {
    showScreen("home-screen");
  });

  // 路線選択
  const routeCards = document.querySelectorAll("[data-route]");
  const resultArea = document.getElementById("route-selection-result");
  const selectedRouteName = document.getElementById("selected-route-name");

  routeCards.forEach((card) => {
    card.addEventListener("click", () => {
      const routeName = card.dataset.route;

      selectedRouteName.textContent = routeName;
      resultArea.hidden = false;

      routeCards.forEach((item) => {
        item.classList.remove("selected");
      });

      card.classList.add("selected");

      resultArea.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    });
  });

  // 音量設定
  const volumeSetting = document.getElementById("volume-setting");
  const volumeValue = document.getElementById("volume-value");

  const savedVolume = localStorage.getItem("stellarVolume");

  if (savedVolume !== null) {
    volumeSetting.value = savedVolume;
  }

  function updateVolume() {
    volumeValue.textContent = `${volumeSetting.value}%`;

    localStorage.setItem(
      "stellarVolume",
      volumeSetting.value
    );
  }

  volumeSetting.addEventListener("input", updateVolume);
  updateVolume();

  // 運転画面の表示設定
  const viewSetting = document.getElementById("view-setting");
  const savedView = localStorage.getItem("stellarDrivingView");

  if (savedView === "cab" || savedView === "forward") {
    viewSetting.value = savedView;
  }

  viewSetting.addEventListener("change", () => {
    localStorage.setItem(
      "stellarDrivingView",
      viewSetting.value
    );
  });

  console.log("STELLAR CITY RAILWAY");
  console.log("メニューの初期化が完了しました。");
});
