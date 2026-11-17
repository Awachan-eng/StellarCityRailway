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
