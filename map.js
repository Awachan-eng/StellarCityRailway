document.addEventListener("DOMContentLoaded", () => {
  if (typeof STATIONS === "undefined" || typeof LINES === "undefined") return;

  const mapScreen = document.getElementById("map-screen");
  if (!mapScreen) return;

  const oldList = mapScreen.querySelector(".station-route-list");
  if (!oldList) return;

  const SVG_NS = "http://www.w3.org/2000/svg";
  const VIEW_W = 1075;
  const VIEW_H = 607;
  const DRAW_ORDER = ["seitojunkai", "hoshiyoi", "amanogawa", "ginga"];

  const LABELS = {
    seito: [0, -24, "middle"],
    seitominami: [-26, 22, "middle"],
    orihimebashi: [-45, 24, "middle"],
    ginkancho: [18, -10, "start"],
    hikarigaoka: [24, -4, "start"],
    ryuseikoenmae: [22, 0, "start"],
    tenmanbara: [22, -2, "start"],
    shiomidai: [22, -12, "start"],
    akatsukikaigan: [22, -14, "start"],
    seitorinkaikuko: [-22, 8, "end"],
    yoimachicho: [34, 28, "middle"],
    kasumino: [-4, 36, "middle"],
    hoshikawa: [-18, 12, "end"],
    suiseinomori: [-4, 36, "middle"],
    nishiseito: [0, 26, "middle"],
    tsukimidai: [18, 24, "middle"],
    hokutoguchi: [-16, 16, "end"],
    shiratorigaoka: [-16, 16, "end"],
    boseionsen: [-16, 10, "end"],
    okuseito: [18, -16, "start"],
    shinseito: [16, -14, "start"],
    nanseidai: [14, 16, "start"],
    izayoi: [-16, 12, "end"],
    seitodaigakumae: [-22, -22, "end"],
    kitaseito: [-28, -28, "middle"]
  };

  const VIA = {
    "hoshikawa>suiseinomori": [[350, 285], [385, 325], [440, 370]],
    "suiseinomori>tenmanbara": [[540, 420], [600, 436]]
  };

  const style = document.createElement("style");

  style.textContent = `
    .rail-map-wrap {
      padding: 8px;
      border: 1px solid rgba(164, 203, 255, 0.2);
      border-radius: 13px;
      background: #02060f;
    }

    .rail-map-svg {
      display: block;
      width: 100%;
      height: auto;
      max-height: calc(100vh - 230px);
      user-select: none;
      -webkit-user-select: none;
    }

    .rail-map-station {
      cursor: pointer;
    }

    .rail-map-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 18px;
      margin-top: 12px;
      color: #d5e1f5;
      font-size: 12px;
    }

    .rail-map-legend span,
    .rail-map-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .rail-map-legend i,
    .rail-map-chip i {
      display: inline-block;
      width: 14px;
      height: 6px;
      border-radius: 3px;
    }

    .rail-map-info {
      margin-top: 10px;
      padding: 12px 14px;
      border: 1px solid rgba(164, 203, 255, 0.2);
      border-radius: 9px;
      background: rgba(20, 34, 65, 0.9);
      color: #d5e1f5;
      font-size: 13px;
      line-height: 1.8;
    }

    .rail-map-info strong {
      margin-right: 8px;
      color: #ffffff;
      font-size: 16px;
    }

    .rail-map-info small {
      color: #aab8d4;
      font-size: 11px;
    }

    .rail-map-info p {
      margin: 2px 0 6px;
    }

    .rail-map-info .rail-map-chip {
      margin-right: 14px;
    }

    @media (orientation: landscape) and (max-height: 520px) {
      .rail-map-svg {
        max-height: calc(100vh - 150px);
      }

      .rail-map-info {
        padding: 8px 12px;
        font-size: 11px;
        line-height: 1.6;
      }
    }
  `;

  document.head.appendChild(style);

  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);

    Object.keys(attrs).forEach((key) => {
      el.setAttribute(key, attrs[key]);
    });

    return el;
  }

  function linePoints(line) {
    const points = [];

    line.stations.forEach((id, index) => {
      const station = STATIONS[id];
      points.push([station.x, station.y]);

      const nextId = line.stations[index + 1];

      if (nextId) {
        const via = VIA[id + ">" + nextId];

        if (via) {
          via.forEach((point) => points.push(point));
        }
      }
    });

    return points;
  }

  function closedSmoothPath(points) {
    const count = points.length;
    let d = `M ${points[0][0]} ${points[0][1]}`;

    for (let i = 0; i < count; i++) {
      const p0 = points[(i - 1 + count) % count];
      const p1 = points[i];
      const p2 = points[(i + 1) % count];
      const p3 = points[(i + 2) % count];

      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;

      d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
    }

    return d + " Z";
  }

  const stationLines = {};

  LINES.forEach((line) => {
    line.stations.forEach((id) => {
      if (!stationLines[id]) stationLines[id] = [];
      stationLines[id].push(line);
    });
  });

  const orderedLines = LINES.slice().sort((a, b) => {
    return DRAW_ORDER.indexOf(a.id) - DRAW_ORDER.indexOf(b.id);
  });

  const wrap = document.createElement("div");
  wrap.className = "rail-map-wrap";

  const svg = svgEl("svg", {
    class: "rail-map-svg",
    viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
    role: "img",
    "aria-label": "星都電鉄 路線図"
  });

  svg.appendChild(svgEl("rect", {
    x: 0,
    y: 0,
    width: VIEW_W,
    height: VIEW_H,
    fill: "#02060f"
  }));

  orderedLines.forEach((line) => {
    const points = linePoints(line);
    let shape;

    if (line.loop) {
      shape = svgEl("path", { d: closedSmoothPath(points) });
    } else {
      shape = svgEl("polyline", {
        points: points.map((point) => point.join(",")).join(" ")
      });
    }

    shape.setAttribute("fill", "none");
    shape.setAttribute("stroke", line.color);
    shape.setAttribute("stroke-width", "9");
    shape.setAttribute("stroke-linecap", "round");
    shape.setAttribute("stroke-linejoin", "round");

    svg.appendChild(shape);
  });

  const ring = svgEl("circle", {
    r: 17,
    fill: "none",
    stroke: "#ffffff",
    "stroke-width": 2,
    "stroke-dasharray": "4 3"
  });

  ring.style.display = "none";

  const info = document.createElement("div");
  info.className = "rail-map-info";
  info.textContent = "駅をタップすると、駅の情報が表示されます。";

  function selectStation(id) {
    const station = STATIONS[id];

    ring.setAttribute("cx", station.x);
    ring.setAttribute("cy", station.y);
    ring.style.display = "block";

    const chips = (stationLines[id] || []).map((line) => {
      return `<span class="rail-map-chip"><i style="background:${line.color}"></i>${line.name}</span>`;
    }).join("");

    info.innerHTML =
      `<strong>${station.name}駅</strong><small>${station.kana}</small>` +
      `<p>${station.feature}</p>` +
      `<div>${chips}</div>`;
  }

  Object.keys(STATIONS).forEach((id) => {
    const station = STATIONS[id];
    const label = LABELS[id] || [0, 26, "middle"];
    const ownLines = stationLines[id] || [];
    const lineColor = ownLines.length ? ownLines[0].color : "#ffffff";

    const group = svgEl("g", { class: "rail-map-station" });

    group.appendChild(svgEl("circle", {
      cx: station.x,
      cy: station.y,
      r: 20,
      fill: "transparent"
    }));

    if (station.hub) {
      group.appendChild(svgEl("circle", {
        cx: station.x,
        cy: station.y,
        r: 11,
        fill: "#ffffff",
        stroke: "#111111",
        "stroke-width": 3
      }));
    } else {
      group.appendChild(svgEl("circle", {
        cx: station.x,
        cy: station.y,
        r: 8,
        fill: "#ffffff",
        stroke: lineColor,
        "stroke-width": 4
      }));
    }

    const text = svgEl("text", {
      x: station.x + label[0],
      y: station.y + label[1],
      "text-anchor": label[2],
      "dominant-baseline": "central",
      fill: "#cfe3ff",
      stroke: "#02060f",
      "stroke-width": 4,
      "paint-order": "stroke",
      "font-size": 18,
      "font-family": "'Yu Gothic','Hiragino Kaku Gothic ProN',Meiryo,sans-serif"
    });

    text.textContent = station.name;
    group.appendChild(text);

    group.addEventListener("click", () => selectStation(id));

    svg.appendChild(group);
  });

  svg.appendChild(ring);
  wrap.appendChild(svg);

  const legend = document.createElement("div");
  legend.className = "rail-map-legend";

  LINES.forEach((line) => {
    const item = document.createElement("span");
    item.innerHTML = `<i style="background:${line.color}"></i>${line.name}`;
    legend.appendChild(item);
  });

  const container = document.createElement("div");
  container.appendChild(wrap);
  container.appendChild(legend);
  container.appendChild(info);

  oldList.replaceWith(container);
});
