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
  let selectedVehicle = null;

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
  // 路線・駅間距離データ
  // ========================================

  // distance は、その駅から次駅までの距離（m）
  // 星都巡回線は時計回り
  const routeData = {
    "天の川線": [
      { name: "星都駅", distance: 947 },
      { name: "星都南駅", distance: 1018 },
      { name: "織姫橋駅", distance: 1183 },
      { name: "銀漢町駅", distance: 1206 },
      { name: "光が丘駅", distance: 1062 },
      { name: "流星公園前駅", distance: 1591 },
      { name: "天満原駅", distance: 1284 },
      { name: "汐見台駅", distance: 1075 },
      { name: "暁海岸駅", distance: 1612 },
      { name: "星都臨海空港駅", distance: null }
    ],

    "星屑線": [
      { name: "宵待町駅", distance: 1458 },
      { name: "かすみ野駅", distance: 1203 },
      { name: "星川駅", distance: 1439 },
      { name: "翠星の森駅", distance: 1324 },
      { name: "天満原駅", distance: null }
    ],

    "銀河線": [
      { name: "星都駅", distance: 1871 },
      { name: "西星都駅", distance: 1059 },
      { name: "月見台駅", distance: 1042 },
      { name: "星川駅", distance: 1246 },
      { name: "北斗口駅", distance: 1428 },
      { name: "白鳥ヶ丘駅", distance: 1764 },
      { name: "望星温泉駅", distance: 1515 },
      { name: "奥星都駅", distance: null }
    ],

    "星都巡回線": [
      { name: "星都駅", distance: 787 },
      { name: "新星都駅", distance: 980 },
      { name: "銀漢町駅", distance: 1014 },
      { name: "宵待町駅", distance: 916 },
      { name: "南星台駅", distance: 952 },
      { name: "翠星の森駅", distance: 893 },
      { name: "二十六夜駅", distance: 1051 },
      { name: "月見台駅", distance: 929 },
      { name: "星都大学前駅", distance: 927 },
      { name: "北星都駅", distance: 795 }
    ]
  };


  // ========================================
  // 車両データ
  // ========================================

  const vehicleData = {
    "1000": {
      name: "1000系",
      service: "普通",
      maxSpeed: 80,
      color: "#55b9df",
      description: "標準的な性能を持つ普通列車"
    },

    "2000": {
      name: "2000系",
      service: "急行",
      maxSpeed: 100,
      color: "#e56b62",
      description: "高速運転に対応した急行列車"
    },

    "7000": {
      name: "7000系",
      service: "観光特急",
      maxSpeed: 120,
      color: "#a987df",
      description: "高い最高速度を持つ観光特急列車"
    }
  };


  // ========================================
  // 車両選択画面のスタイル
  // ========================================

  const vehicleStyle = document.createElement("style");

  vehicleStyle.textContent = `
    .vehicle-select-area {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(164, 203, 255, 0.2);
    }

    .vehicle-select-heading {
      margin-bottom: 12px;
      color: #f5f8ff;
      font-size: 14px;
      font-weight: bold;
    }

    .vehicle-select-list {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .vehicle-select-card {
      min-width: 0;
      padding: 12px 8px;
      border: 2px solid rgba(164, 203, 255, 0.2);
      border-radius: 9px;
      background: rgba(20, 34, 65, 0.9);
      color: #f5f8ff;
      text-align: center;
      cursor: pointer;
      transition: 0.2s;
    }

    .vehicle-select-card:hover {
      background: rgba(45, 67, 105, 0.95);
    }

    .vehicle-select-card.selected {
      border-color: #83dfff;
      background: rgba(55, 105, 145, 0.35);
      box-shadow: 0 0 10px rgba(131, 223, 255, 0.18);
    }

    .vehicle-select-card strong {
      display: block;
      margin-bottom: 5px;
      font-size: 16px;
    }

    .vehicle-select-card small {
      display: block;
      color: #aab8d4;
      font-size: 10px;
    }

    .vehicle-select-speed {
      display: block;
      margin-top: 9px;
      color: #83dfff;
      font-size: 17px;
      font-weight: bold;
    }

    .vehicle-select-detail {
      margin-top: 12px;
      padding: 10px;
      border-radius: 7px;
      background: rgba(5, 12, 28, 0.55);
      color: #aab8d4;
      font-size: 12px;
      text-align: center;
    }

    .vehicle-select-detail strong {
      color: #83dfff;
    }

    #start-driving-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    @media (max-width: 700px) {
      .vehicle-select-list {
        gap: 5px;
      }

      .vehicle-select-card {
        padding: 10px 4px;
      }

      .vehicle-select-card strong {
        font-size: 13px;
      }

      .vehicle-select-card small {
        font-size: 9px;
      }

      .vehicle-select-speed {
        font-size: 14px;
      }
    }
  `;

  document.head.appendChild(vehicleStyle);


  // ========================================
  // 路線選択
  // ========================================

  const routeCards = document.querySelectorAll("[data-route]");
  const resultArea = document.getElementById("route-selection-result");
  const selectedRouteName = document.getElementById("selected-route-name");
  const drivingRouteName = document.getElementById("driving-route-name");

  const startDrivingButton =
    document.getElementById("start-driving-button");

  const vehicleSelectionArea = document.createElement("div");

  vehicleSelectionArea.className = "vehicle-select-area";

  vehicleSelectionArea.innerHTML = `
    <div class="vehicle-select-heading">
      運転する車両を選択
    </div>

    <div class="vehicle-select-list">

      <button class="vehicle-select-card" data-vehicle="1000">
        <strong>1000系</strong>
        <small>普通</small>
        <span class="vehicle-select-speed">80 km/h</span>
      </button>

      <button class="vehicle-select-card" data-vehicle="2000">
        <strong>2000系</strong>
        <small>急行</small>
        <span class="vehicle-select-speed">100 km/h</span>
      </button>

      <button class="vehicle-select-card" data-vehicle="7000">
        <strong>7000系</strong>
        <small>観光特急</small>
        <span class="vehicle-select-speed">120 km/h</span>
      </button>

    </div>

    <div class="vehicle-select-detail" id="vehicle-select-detail">
      車両を選択してください。
    </div>
  `;

  resultArea.insertBefore(
    vehicleSelectionArea,
    startDrivingButton
  );

  startDrivingButton.disabled = true;

  const vehicleSelectCards =
    vehicleSelectionArea.querySelectorAll("[data-vehicle]");

  const vehicleSelectDetail =
    document.getElementById("vehicle-select-detail");

  vehicleSelectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const vehicleId = card.dataset.vehicle;
      selectedVehicle = vehicleData[vehicleId];

      vehicleSelectCards.forEach((item) => {
        item.classList.remove("selected");
      });

      card.classList.add("selected");

      vehicleSelectDetail.innerHTML =
        `<strong>${selectedVehicle.name}</strong> を選択中<br>` +
        `${selectedVehicle.description}<br>` +
        `最高速度：<strong>${selectedVehicle.maxSpeed} km/h</strong>`;

      startDrivingButton.disabled = false;
    });
  });

  routeCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectedRoute = card.dataset.route;
      selectedVehicle = null;

      selectedRouteName.textContent =
        selectedRoute + "を選択中";

      resultArea.hidden = false;
      startDrivingButton.disabled = true;

      vehicleSelectCards.forEach((item) => {
        item.classList.remove("selected");
      });

      vehicleSelectDetail.textContent =
        "車両を選択してください。";

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

  const controllerTrack =
    document.getElementById("controller-track");

  const controllerInner =
    document.getElementById("controller-track-inner");

  const controllerThumb =
    document.getElementById("controller-thumb");

  const controllerReadout =
    document.getElementById("controller-readout");

  const controllerLabels =
    document.querySelectorAll(".notch-label");

  const drivingMessage =
    document.getElementById("driving-message");

  const instrumentInfo =
    document.querySelectorAll(".instrument-info div strong");

  const buildings =
    document.querySelector(".distant-buildings");

  const cloud =
    document.querySelector(".sky-cloud");

  const drivingStatusSpeed =
    document.querySelector(
      "#driving-screen .driving-status .status-box:nth-child(3) strong"
    );

  const drivingStatusLabel =
    document.querySelector(
      "#driving-screen .driving-status .status-box:nth-child(3) small"
    );

  const drivingSection =
    document.getElementById("driving-section");

  const nextStation =
    document.getElementById("next-station");

  // 次駅欄の下に残り距離を表示する
  const routeStatusExtra = document.createElement("div");
  routeStatusExtra.id = "remaining-distance";
  routeStatusExtra.style.cssText =
    "margin-top:5px;color:#83dfff;font-size:11px;text-align:center;";

  nextStation.parentElement.appendChild(routeStatusExtra);


  // ========================================
  // マスコン設定
  // ========================================

  const notches = [
    "P7", "P6", "P5", "P4", "P3", "P2", "P1",
    "N",
    "B1", "B2", "B3", "B4", "B5"
  ];

  let currentNotchIndex = 7;
  let isDragging = false;

  const powerRatios = {
    P1: 0.15,
    P2: 0.25,
    P3: 0.38,
    P4: 0.52,
    P5: 0.67,
    P6: 0.83,
    P7: 1.00
  };

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
  let maxSpeed = 80;

  const maxAcceleration = 1.30;
  const maxBraking = 1.00;
  const coastingResistance = 0.025;

  let animationFrameId = null;
  let previousFrameTime = null;
  let sceneryOffset = 0;

  let currentRouteStations = [];
  let currentStationIndex = 0;
  let remainingDistance = 0;
  let isStoppedAtStation = false;

  const stationArrivalTolerance = 0.002;


  // ========================================
  // マスコン表示更新
  // ========================================

  function updateController(index) {
    currentNotchIndex = Math.max(0, Math.min(12, index));

    const notchName = notches[currentNotchIndex];
    const percentage = (currentNotchIndex / 12) * 100;

    controllerThumb.style.top = `${percentage}%`;
    controllerReadout.textContent = notchName;

    controllerLabels.forEach((label) => {
      const labelIndex = Number(label.dataset.index);

      label.classList.toggle(
        "selected",
        labelIndex === currentNotchIndex
      );
    });

    controllerTrack.setAttribute("aria-valuenow", currentNotchIndex);
    controllerTrack.setAttribute("aria-valuetext", notchName);

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

  controllerTrack.addEventListener("pointerdown", (event) => {
    isDragging = true;

    controllerTrack.setPointerCapture(event.pointerId);
    setNotchFromPointer(event);
  });

  controllerTrack.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    setNotchFromPointer(event);
  });

  controllerTrack.addEventListener("pointerup", () => {
    isDragging = false;
  });

  controllerTrack.addEventListener("pointercancel", () => {
    isDragging = false;
  });

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
  // 駅間走行・駅到着
  // ========================================

  function updateStationDisplay() {
    if (!currentRouteStations.length) return;

    const current = currentRouteStations[currentStationIndex];
    const isCircular = selectedRoute === "星都巡回線";
    const nextIndex = currentStationIndex + 1;

    if (!isCircular && nextIndex >= currentRouteStations.length) {
      drivingSection.textContent = current.name;
      nextStation.textContent = "終点";
      routeStatusExtra.textContent = "終点に到着";
      return;
    }

    const next =
      currentRouteStations[nextIndex % currentRouteStations.length];

    drivingSection.textContent = current.name;
    nextStation.textContent = next.name;

    routeStatusExtra.textContent = isStoppedAtStation
      ? "駅に停車中"
      : `次駅まで ${remainingDistance.toFixed(2)} km`;
  }


  function arriveAtNextStation() {
    if (isStoppedAtStation || !currentRouteStations.length) return;

    const nextIndex = currentStationIndex + 1;
    const isCircular = selectedRoute === "星都巡回線";

    speed = 0;
    isStoppedAtStation = true;

    // 終点に到着した場合
    if (!isCircular && nextIndex >= currentRouteStations.length) {
      currentStationIndex = currentRouteStations.length - 1;

      updateController(7);
      updateStationDisplay();

      drivingMessage.textContent =
        `${currentRouteStations[currentStationIndex].name}に到着しました。終点です。`;

      return;
    }

    // 次の駅へ到着
    currentStationIndex =
      nextIndex % currentRouteStations.length;

    remainingDistance =
      currentRouteStations[currentStationIndex].distance || 0;

    updateController(7);
    updateStationDisplay();

    drivingMessage.textContent =
      `${currentRouteStations[currentStationIndex].name}に到着しました。停車中です。`;
  }


  // ========================================
  // 列車の加速・減速計算
  // ========================================

  function calculateTrainMovement(deltaTime) {
    if (isStoppedAtStation) return;

    const notchName = notches[currentNotchIndex];

    let acceleration = 0;

    // 力行
    if (powerRatios[notchName] !== undefined) {
      const power = powerRatios[notchName];

      const speedFactor = Math.max(
        0,
        1 - speed / (maxSpeed * 1.25)
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

    const previousSpeed = speed;

    speed += acceleration * 3.6 * deltaTime;
    speed = Math.min(speed, maxSpeed);
    speed = Math.max(speed, 0);

    const averageSpeed = (previousSpeed + speed) / 2;
    const movedDistance = (averageSpeed / 3600) * deltaTime;

    distance += movedDistance;

    if (currentRouteStations.length > 0) {
      remainingDistance = Math.max(
        0,
        remainingDistance - movedDistance
      );

      if (remainingDistance <= stationArrivalTolerance) {
        arriveAtNextStation();
      }
    }
  }


  // ========================================
  // 速度計・運転情報の更新
  // ========================================

  function updateDrivingDisplay() {
    const displayedSpeed = Math.floor(speed);
    speedValue.textContent = displayedSpeed;

    if (speed < 0.5) {
      instrumentInfo[0].textContent = "停車中";
    } else {
      instrumentInfo[0].textContent = "走行中";
    }

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

    instrumentInfo[2].textContent = "未設定";

    updateStationDisplay();

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

    let deltaTime = (timestamp - previousFrameTime) / 1000;
    previousFrameTime = timestamp;

    deltaTime = Math.min(deltaTime, 0.1);

    calculateTrainMovement(deltaTime);
    updateDrivingDisplay();

    animationFrameId =
      requestAnimationFrame(simulationLoop);
  }


  function startSimulation() {
    stopSimulation();

    speed = 0;
    distance = 0;
    sceneryOffset = 0;

    currentRouteStations = routeData[selectedRoute] || [];
    currentStationIndex = 0;
    remainingDistance =
      currentRouteStations[0]?.distance || 0;

    isStoppedAtStation = false;

    updateController(7);
    updateStationDisplay();
    updateDrivingDisplay();

    previousFrameTime = null;

    animationFrameId =
      requestAnimationFrame(simulationLoop);
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

  startDrivingButton.addEventListener("click", () => {
    if (!selectedRoute || !selectedVehicle) {
      return;
    }

    maxSpeed = selectedVehicle.maxSpeed;

    drivingRouteName.textContent =
      `${selectedRoute} ／ ${selectedVehicle.name}`;

    drivingStatusLabel.textContent = "車両最高速度";
    drivingStatusSpeed.textContent = `${maxSpeed} km/h`;

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


  // ========================================
  // 初期化
  // ========================================

  updateController(7);

  console.log("STELLAR CITY RAILWAY");
  console.log("列車走行システムの初期化が完了しました。");

});
