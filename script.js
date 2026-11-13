/* ========================================
   STELLAR CITY RAILWAY
   Main JavaScript
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");
  const homeButton = document.getElementById("home-button");

  let selectedRoute = "";

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

  // メインメニュー
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.screen);
    });
  });

  // ホームへ戻る
  homeButton.addEventListener("click", () => {
    showScreen("home-screen");
  });

  // 路線選択
  const routeCards = document.querySelectorAll("[data-route]");
  const resultArea = document.getElementById("route-selection-result");
  const selectedRouteName = document.getElementById("selected-route-name");
  const drivingRouteName = document.getElementById("driving-route-name");

  routeCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectedRoute = card.dataset.route;

      selectedRouteName.textContent = selectedRoute + "を選択中";
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

  // 運転開始
  const startDrivingButton = document.getElementById("start-driving-button");

  startDrivingButton.addEventListener("click", () => {
    if (!selectedRoute) return;

    drivingRouteName.textContent = selectedRoute;
    showScreen("driving-screen");
  });

  // 運転終了
  document.getElementById("exit-driving-button").addEventListener("click", () => {
    showScreen("route-select-screen");
  });

  // ========================================
  // スライド式マスコン
  // ========================================

  const notches = [
    "P7", "P6", "P5", "P4", "P3", "P2", "P1",
    "N",
    "B1", "B2", "B3", "B4", "B5"
  ];

  const controllerTrack = document.getElementById("controller-track");
  const controllerInner = document.getElementById("controller-track-inner");
  const controllerThumb = document.getElementById("controller-thumb");
  const controllerReadout = document.getElementById("controller-readout");
  const controllerLabels = document.querySelectorAll(".notch-label");
  const drivingMessage = document.getElementById("driving-message");

  // 0 = P7、7 = N、12 = B5
  let currentNotchIndex = 7;
  let isDragging = false;

  function updateController(index) {
    // 0～12の範囲に収める
    currentNotchIndex = Math.max(0, Math.min(12, index));

    const notchName = notches[currentNotchIndex];
    const percentage = (currentNotchIndex / 12) * 100;

    // レバーの位置を変更
    controllerThumb.style.top = `${percentage}%`;

    // 現在のノッチを表示
    controllerReadout.textContent = notchName;

    // 操作位置の表示を更新
    controllerLabels.forEach((label) => {
      const labelIndex = Number(label.dataset.index);
      label.classList.toggle(
        "selected",
        labelIndex === currentNotchIndex
      );
    });

    // アクセシビリティ情報を更新
    controllerTrack.setAttribute("aria-valuenow", currentNotchIndex);
    controllerTrack.setAttribute("aria-valuetext", notchName);

    drivingMessage.textContent =
      `マスコン：${notchName}　／　レバーをスライドして操作できます。`;
  }

  // 指やマウスの位置からノッチを計算
  function setNotchFromPointer(event) {
    const rect = controllerInner.getBoundingClientRect();

    // レバーが移動できる範囲
    const usableHeight = rect.height;

    let ratio = (event.clientY - rect.top) / usableHeight;

    // 上端より上・下端より下には行かない
    ratio = Math.max(0, Math.min(1, ratio));

    // 最も近いノッチに自動的に合わせる
    const index = Math.round(ratio * 12);

    updateController(index);
  }

  // スライド開始
  controllerTrack.addEventListener("pointerdown", (event) => {
    isDragging = true;

    controllerTrack.setPointerCapture(event.pointerId);

    setNotchFromPointer(event);
  });

  // スライド中
  controllerTrack.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    setNotchFromPointer(event);
  });

  // スライド終了
  controllerTrack.addEventListener("pointerup", () => {
    isDragging = false;
  });

  controllerTrack.addEventListener("pointercancel", () => {
    isDragging = false;
  });

  // キーボード操作にも対応
  controllerTrack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      updateController(currentNotchIndex - 1);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      updateController(currentNotchIndex + 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      updateController(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      updateController(12);
    }
  });

  // 初期位置はN
  updateController(7);

  // ========================================
  // 音量設定
  // ========================================

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

  // ========================================
  // 運転画面の表示設定
  // ========================================

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
  console.log("スライド式マスコンの初期化が完了しました。");
});
