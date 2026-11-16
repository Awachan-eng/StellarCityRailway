
/* ========================================
   STELLAR CITY RAILWAY
   Station scenery system
======================================== */

(() => {
  "use strict";

  const sceneryByStation = {
    "星都駅": { description: "巨大ターミナル駅", icons: ["🚉", "🏙️", "🚄"], theme: "city" },
    "星都南駅": { description: "オフィス街・官公庁エリア", icons: ["🏢", "🏛️", "🏙️"], theme: "city" },
    "織姫橋駅": { description: "川沿いの歴史ある商業地区", icons: ["🌉", "🏘️", "🏮"], theme: "river" },
    "銀漢町駅": { description: "副都心的な乗換拠点", icons: ["🏙️", "🚉", "🏢"], theme: "city" },
    "光が丘駅": { description: "大規模ニュータウン", icons: ["🏢", "🏘️", "🌳"], theme: "suburb" },
    "流星公園前駅": { description: "スタジアム・美術館の文化エリア", icons: ["🏟️", "🏛️", "🌳"], theme: "park" },
    "天満原駅": { description: "車両基地がある郊外の拠点", icons: ["🚆", "🚉", "🏘️"], theme: "suburb" },
    "汐見台駅": { description: "海が見え始める高台の住宅街", icons: ["🏘️", "🌊", "🌳"], theme: "coast" },
    "暁海岸駅": { description: "オーシャンビューの観光駅", icons: ["🌊", "🏖️", "🏨"], theme: "coast" },
    "星都臨海空港駅": { description: "空の玄関口・臨海空港", icons: ["✈️", "🛫", "🏢"], theme: "airport" },
    "宵待町駅": { description: "レトロな商店街がある起点", icons: ["🏮", "🏬", "🚉"], theme: "historic" },
    "かすみ野駅": { description: "落ち着いた住宅街", icons: ["🏡", "🏘️", "🌳"], theme: "suburb" },
    "星川駅": { description: "川沿いの急行停車駅・乗換拠点", icons: ["🌉", "🚉", "🏙️"], theme: "river" },
    "翠星の森駅": { description: "大学や大きな公園がある文教エリア", icons: ["🎓", "🌳", "🏛️"], theme: "park" },
    "西星都駅": { description: "百貨店やホテルが並ぶ繁華街", icons: ["🏬", "🏨", "🏙️"], theme: "city" },
    "月見台駅": { description: "山の手の高級住宅街", icons: ["🏡", "🌲", "🏘️"], theme: "suburb" },
    "北斗口駅": { description: "古い神社や門前町があるエリア", icons: ["⛩️", "🏮", "🏘️"], theme: "historic" },
    "白鳥ヶ丘駅": { description: "別荘地・高原リゾート入口", icons: ["🏡", "🌲", "⛰️"], theme: "mountain" },
    "望星温泉駅": { description: "渓谷沿いの温泉街", icons: ["♨️", "🏯", "⛰️"], theme: "mountain" },
    "奥星都駅": { description: "国立天文台・ロープウェイの観光拠点", icons: ["🔭", "🚡", "⛰️"], theme: "mountain" },
    "新星都駅": { description: "新幹線・他社線が乗り入れる近代的ビジネス街", icons: ["🚄", "🚉", "🏙️"], theme: "city" },
    "南星台駅": { description: "昭和の面影を残す大規模団地エリア", icons: ["🏢", "🏘️", "🌳"], theme: "suburb" },
    "二十六夜駅": { description: "静かな寺社仏閣が集まる歴史地区", icons: ["🛕", "⛩️", "🌳"], theme: "historic" },
    "星都大学前駅": { description: "学生街・カフェが多いエリア", icons: ["🎓", "☕", "🏫"], theme: "park" },
    "北星都駅": { description: "アリーナ・大型ショッピングモールの再開発エリア", icons: ["🏟️", "🛍️", "🏙️"], theme: "city" }
  };

  const routeData = {
    "天の川線": [
      ["星都駅", 947], ["星都南駅", 1018], ["織姫橋駅", 1183],
      ["銀漢町駅", 1206], ["光が丘駅", 1062], ["流星公園前駅", 1591],
      ["天満原駅", 1284], ["汐見台駅", 1075], ["暁海岸駅", 1612],
      ["星都臨海空港駅", null]
    ],
    "星屑線": [
      ["宵待町駅", 958], ["かすみ野駅", 1203], ["星川駅", 1439],
      ["翠星の森駅", 1324], ["天満原駅", null]
    ],
    "銀河線": [
      ["星都駅", 871], ["西星都駅", 1059], ["月見台駅", 1042],
      ["星川駅", 1246], ["北斗口駅", 1428], ["白鳥ヶ丘駅", 1764],
      ["望星温泉駅", 1515], ["奥星都駅", null]
    ],
    "星都巡回線": [
      ["星都駅", 787], ["新星都駅", 980], ["銀漢町駅", 1014],
      ["宵待町駅", 916], ["南星台駅", 952], ["翠星の森駅", 893],
      ["二十六夜駅", 1051], ["月見台駅", 929],
      ["星都大学前駅", 927], ["北星都駅", 795]
    ]
  };

  function addStyles() {
    const style = document.createElement("style");

    style.textContent = `
      .forward-window {
        isolation: isolate;
      }

      .driving-placeholder {
        display: none !important;
      }

      #stellar-scenery {
        position: absolute;
        inset: 0;
        z-index: 1;
        overflow: hidden;
        pointer-events: none;
        --approach: 0;
      }

      #stellar-scenery .scene-skyline {
        position: absolute;
        left: -20%;
        right: -20%;
        bottom: 37%;
        height: 42%;
        opacity: .7;
        background:
          linear-gradient(to top, #354e58 0 58%, transparent 59%) 0 100% / 11% 100% repeat-x,
          linear-gradient(to top, #526b70 0 78%, transparent 79%) 5% 100% / 8% 100% repeat-x,
          linear-gradient(to top, #405b65 0 66%, transparent 67%) 2% 100% / 14% 100% repeat-x;
        background-position-x: var(--scroll);
      }

      #stellar-scenery .scene-landmarks {
        position: absolute;
        left: 50%;
        bottom: 35%;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: clamp(7px, 2.2vw, 25px);
        width: 90%;
        transform:
          translateX(-50%)
          scale(calc(.45 + var(--approach) * .65));
        transform-origin: center bottom;
        opacity: calc(.35 + var(--approach) * .65);
        white-space: nowrap;
        filter: drop-shadow(0 5px 4px rgba(0,0,0,.35));
      }

      #stellar-scenery .scene-icon {
        display: inline-block;
        font-size: clamp(32px, 8vw, 82px);
        line-height: 1;
      }

      #stellar-scenery .scene-name {
        position: absolute;
        top: 9px;
        right: 9px;
        padding: 5px 9px;
        border-radius: 5px;
        background: rgba(5,12,28,.78);
        color: white;
        font-size: clamp(9px, 1.5vw, 12px);
        text-align: right;
      }

      #stellar-scenery.theme-city {
        background: linear-gradient(to bottom, transparent 45%, rgba(65,85,100,.25));
      }

      #stellar-scenery.theme-river {
        background: linear-gradient(to bottom, transparent 45%, rgba(39,126,151,.48) 65%, transparent 82%);
      }

      #stellar-scenery.theme-suburb {
        background: linear-gradient(to bottom, transparent 45%, rgba(75,116,85,.35));
      }

      #stellar-scenery.theme-park {
        background: linear-gradient(to bottom, transparent 45%, rgba(42,111,67,.4));
      }

      #stellar-scenery.theme-coast {
        background: linear-gradient(to bottom, transparent 42%, rgba(38,139,171,.5) 62%, transparent 82%);
      }

      #stellar-scenery.theme-airport {
        background: linear-gradient(to bottom, transparent 45%, rgba(100,128,142,.35));
      }

      #stellar-scenery.theme-historic {
        background: linear-gradient(to bottom, transparent 45%, rgba(128,92,58,.35));
      }

      #stellar-scenery.theme-mountain {
        background:
          linear-gradient(140deg, transparent 0 35%, rgba(66,105,89,.55) 36% 48%, transparent 49%),
          linear-gradient(35deg, transparent 0 42%, rgba(79,119,99,.58) 43% 58%, transparent 59%);
      }

      .railway-ground,
      .railway-track,
      .rail-left,
      .rail-right {
        z-index: 2;
      }
    `;

    document.head.appendChild(style);
  }

  function startScenery() {
    const windowElement = document.querySelector(".forward-window");
    const currentStation = document.getElementById("driving-section");
    const nextStation = document.getElementById("next-station");
    const speedElement = document.getElementById("speed-value");
    const routeElement = document.getElementById("driving-route-name");
    const messageElement = document.getElementById("driving-message");

    if (
      !windowElement ||
      !currentStation ||
      !nextStation ||
      !speedElement ||
      !messageElement
    ) {
      console.error("星都電鉄：風景表示に必要な画面要素が見つかりません。");
      return;
    }

    const layer = document.createElement("div");
    layer.id = "stellar-scenery";
    layer.setAttribute("aria-hidden", "true");
    windowElement.appendChild(layer);

    let scroll = 0;
    let lastTime = 0;
    let lastSignature = "";

    function render() {
      const routeText = routeElement ? routeElement.textContent : "";
      const routeName = Object.keys(routeData).find(name =>
        routeText.includes(name)
      );

      const route = routeName ? routeData[routeName] : null;
      const currentName = currentStation.textContent.trim();
      const nextName = nextStation.textContent.trim();
      const message = messageElement.textContent;

      const isStopped = message.includes("に到着しました");

      let targetName = nextName;
      let progress = 0;
      let segmentLength = 1000;

      if (isStopped) {
        targetName = currentName;
        progress = 1;
      } else if (route) {
        const currentIndex = route.findIndex(item =>
          item[0] === currentName
        );

        if (currentIndex >= 0) {
          segmentLength = route[currentIndex][1] || 1000;
        }

        const remainingMatch = message.match(
          /次駅まで\s*([\d,]+)\s*m/
        );

        const passedMatch = message.match(
          /駅を\s*([\d,]+)\s*m通過/
        );

        if (remainingMatch) {
          const remaining = Number(
            remainingMatch[1].replace(/,/g, "")
          );

          progress = Math.max(
            0,
            Math.min(1, 1 - remaining / segmentLength)
          );
        } else if (passedMatch) {
          progress = 1;
        }
      }

      if (
        !targetName ||
        targetName === "未設定" ||
        targetName === "終点"
      ) {
        targetName = currentName;
      }

      const scenery = sceneryByStation[targetName] || {
        description: "星都の街並み",
        icons: ["🏙️", "🌳", "🏘️"],
        theme: "city"
      };

      const signature =
        `${targetName}|${Math.round(progress * 100)}`;

      if (signature !== lastSignature) {
        lastSignature = signature;

        layer.className = `theme-${scenery.theme}`;
        layer.style.setProperty(
          "--approach",
          progress.toFixed(3)
        );

        layer.innerHTML = `
          <div class="scene-skyline"></div>
          <div class="scene-landmarks">
            ${scenery.icons.map(icon =>
              `<span class="scene-icon">${icon}</span>`
            ).join("")}
          </div>
          <div class="scene-name">
            ${targetName}　${scenery.description}
          </div>
        `;
      }

      return Number(speedElement.textContent) || 0;
    }

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;

      const delta = Math.min(
        (timestamp - lastTime) / 1000,
        0.05
      );

      lastTime = timestamp;

      const speed = render();

      if (speed > 0) {
        scroll += speed * delta * 1.5;
        layer.style.setProperty(
          "--scroll",
          `${-scroll}px`
        );
      }

      requestAnimationFrame(animate);
    }

    render();
    requestAnimationFrame(animate);
  }

  addStyles();

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      startScenery,
      { once: true }
    );
  } else {
    startScenery();
  }
})();
