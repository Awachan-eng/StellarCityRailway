/* ========================================
   STELLAR CITY RAILWAY
   Train Driving System
======================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ========================================
  // 画面管理
  // ========================================

  const screens = document.querySelectorAll(".screen");
  const homeButton = document.getElementById("home-button");

  let selectedRoute = "";

  function showScreen(screenId) {
    screens.forEach((screen) => {
      screen.classList.toggle("active", screen.id === screenId);
    });

    if (screenId !== "driving-screen") {
      stopSimulation();
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.screen);
    });
  });

  homeButton.addEventListener("click", () => {
    showScreen("home-screen");
  });


  // ========================================
  // 路線選択
  // ========================================

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


  // ========================================
  // 運転画面の表示要素
  // ========================================

  const speedValue = document.getElementById("speed-value");
  const controllerTrack = document.getElementById("controller-track");
  const controllerInner = document.getElementById("controller-track-inner");
  const controllerThumb = document.getElementById("controller-thumb");
  const controllerReadout = document.getElementById("controller-readout");
  const controllerLabels = document.querySelectorAll(".notch-label");
  const drivingMessage = document.getElementById("driving-message");

  const instrumentInfo = document.querySelectorAll(
    ".instrument-info div strong"
  );

  const buildings = document.querySelector(".distant-buildings");
  const cloud = document.querySelector(".sky-cloud");


  // ========================================
  // マスコン設定
  // ========================================

  const notches = [
    "P7", "P6", "P5", "P4", "P3", "P2", "P1",
    "N",
    "B1", "B2", "B3", "B4", "B5"
  ];

  // 0 = P7、7 = N、12 = B5
  let currentNotchIndex = 7;
  let isDragging = false;

  // 力行の出力割合
  const powerRatios = {
    P1: 0.15,
    P2: 0.25,
    P3: 0.38,
    P4: 0.52,
    P5: 0.67,
    P6: 0.83,
    P7: 1.00
  };

  // ブレーキの出力割合
  const brakeRatios = {
    B1: 0.20,
    B2: 0.35,
    B3: 0.50,
    B4: 0.75,
    B5: 1.00
  };


  // ========================================
  // 列車の走行データ
  // ========================================

  let speed = 0;
  let distance = 0;

  // 暫定の走行性能
  const maxSpeed = 80;

  // ★ 最大加速度を0.90から1.30に変更
  const maxAcceleration = 1.30;

  const maxBraking = 1.00;

  // 惰行時の自然減速
  const coastingResistance = 0.025;

  let animationFrameId = null;
  let previousFrameTime = null;
  let sceneryOffset = 0;


  // ========================================
  // マスコン表示更新
  // ========================================

  function updateController(index) {

    currentNotchIndex = Math.max(
      0,
      Math.min(12, index)
    );

    const notchName = notches[currentNotchIndex];

    const percentage = (currentNotchIndex / 12) * 100;

    // レバー位置
    controllerThumb.style.top = `${percentage}%`;

    // 現在のノッチ表示
    controllerReadout.textContent = notchName;

    // 目盛りの強調
    controllerLabels.forEach((label) => {
      const labelIndex = Number(label.dataset.index);

      label.classList.toggle(
        "selected",
        labelIndex === currentNotchIndex
      );
    });

    // スライダー情報
    controllerTrack.setAttribute(
      "aria-valuenow",
      currentNotchIndex
    );

    controllerTrack.setAttribute(
      "aria-valuetext",
      notchName
    );

    updateDrivingMessage();
  }


  // ========================================
  // マスコン操作
  // ========================================

  function setNotchFromPointer(event) {

    const rect = controllerInner.getBoundingClientRect();

    let ratio = (event.clientY - rect.top) / rect.height;

    ratio = Math.max(0, Math.min(1, ratio));

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

  // キーボード操作
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


  // ========================================
  // 列車の加速・減速計算
  // ========================================

  function calculateTrainMovement(deltaTime) {

    const notchName = notches[currentNotchIndex];

    // m/s² で計算
    let acceleration = 0;

    // 力行
    if (powerRatios[notchName] !== undefined) {

      const power = powerRatios[notchName];

      // 高速になるほど加速力を弱める
      const speedFactor = Math.max(
        0,
        1 - speed / 100
      );

      acceleration =
        maxAcceleration *
        power *
        speedFactor;
    }

    // 惰行
    else if (notchName === "N") {

      if (speed > 0) {
        acceleration = -(
          coastingResistance +
          speed * 0.001
        );
      }
    }

    // ブレーキ
    else if (brakeRatios[notchName] !== undefined) {

      const brakePower = brakeRatios[notchName];

      acceleration = -maxBraking * brakePower;
    }

    // 速度を更新
    const previousSpeed = speed;

    speed += acceleration * 3.6 * deltaTime;

    // 最高速度制限
    speed = Math.min(speed, maxSpeed);

    // 逆方向には進まない
    speed = Math.max(speed, 0);

    // 走行距離を更新
    const averageSpeed = (previousSpeed + speed) / 2;

    distance += (averageSpeed / 3600) * deltaTime;
  }


  // ========================================
  // 速度計・運転情報の更新
  // ========================================

  function updateDrivingDisplay() {

    const displayedSpeed = Math.floor(speed);

    speedValue.textContent = displayedSpeed;

    // 現在速度
    if (speed < 0.5) {
      instrumentInfo[0].textContent = "停車中";
    } else {
      instrumentInfo[0].textContent = "走行中";
    }

    // 列車状態
    const notchName = notches[currentNotchIndex];

    if (speed < 0.5) {
      instrumentInfo[1].textContent = "停車中";
    } else if (powerRatios[notchName] !== undefined) {
      instrumentInfo[1].textContent = "加速中";
    } else if (notchName === "N") {
      instrumentInfo[1].textContent = "惰行中";
    } else {
      instrumentInfo[1].textContent = "減速中";
    }

    // 信号はまだ未実装
    instrumentInfo[2].textContent = "未設定";

    // 景色の移動
    sceneryOffset += (speed / 3.6) * 0.15;

    buildings.style.transform =
      `translateX(-${sceneryOffset % 100}px)`;

    cloud.style.transform =
      `translateX(-${sceneryOffset * 0.15 % 100}px)`;
  }


  // ========================================
  // 操作メッセージ
  // ========================================

  function updateDrivingMessage() {

    const notchName = notches[currentNotchIndex];

    let description = "";

    if (powerRatios[notchName] !== undefined) {
      description = "力行・加速";
    } else if (notchName === "N") {
      description = "惰行";
    } else {
      description = "ブレーキ";
    }

    drivingMessage.textContent =
      `マスコン：${notchName}　／　${description}`;
  }


  // ========================================
  // 走行シミュレーション
  // ========================================

  function simulationLoop(timestamp) {

    if (previousFrameTime === null) {
      previousFrameTime = timestamp;
    }

    let deltaTime =
      (timestamp - previousFrameTime) / 1000;

    previousFrameTime = timestamp;

    // タブ切り替え等による急激な時間変化を防ぐ
    deltaTime = Math.min(deltaTime, 0.1);

    calculateTrainMovement(deltaTime);

    updateDrivingDisplay();

    animationFrameId = requestAnimationFrame(simulationLoop);
  }


  function startSimulation() {

    stopSimulation();

    speed = 0;
    distance = 0;
    sceneryOffset = 0;

    updateController(7);
    updateDrivingDisplay();

    previousFrameTime = null;

    animationFrameId = requestAnimationFrame(simulationLoop);
  }


  function stopSimulation() {

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    previousFrameTime = null;
  }


  // ========================================
  // 運転開始・終了
  // ========================================

  const startDrivingButton =
    document.getElementById("start-driving-button");

  startDrivingButton.addEventListener("click", () => {

    if (!selectedRoute) return;

    drivingRouteName.textContent = selectedRoute;

    showScreen("driving-screen");

    startSimulation();
  });


  document.getElementById("exit-driving-button")
    .addEventListener("click", () => {

      showScreen("route-select-screen");
    });


  // ========================================
  // 音量設定
  // ========================================

  const volumeSetting =
    document.getElementById("volume-setting");

  const volumeValue =
    document.getElementById("volume-value");

  const savedVolume =
    localStorage.getItem("stellarVolume");

  if (savedVolume !== null) {
    volumeSetting.value = savedVolume;
  }

  function updateVolume() {

    volumeValue.textContent =
      `${volumeSetting.value}%`;

    localStorage.setItem(
      "stellarVolume",
      volumeSetting.value
    );
  }

  volumeSetting.addEventListener("input", updateVolume);

  updateVolume();


  // ========================================
  // 運転画面設定
  // ========================================

  const viewSetting =
    document.getElementById("view-setting");

  const savedView =
    localStorage.getItem("stellarDrivingView");

  if (savedView === "cab" || savedView === "forward") {
    viewSetting.value = savedView;
  }

  viewSetting.addEventListener("change", () => {

    localStorage.setItem(
      "stellarDrivingView",
      viewSetting.value
    );
  });


  // 初期化
  updateController(7);

  console.log("STELLAR CITY RAILWAY");
  console.log("列車走行システムの初期化が完了しました。");

});
