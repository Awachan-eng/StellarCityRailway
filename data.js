const STATIONS = {
  seito: { name: "星都", kana: "せいと", x: 547, y: 147, hub: true, feature: "巨大ターミナル駅" },
  seitominami: { name: "星都南", kana: "せいとみなみ", x: 592, y: 196, hub: false, feature: "オフィス街・官公庁エリア" },
  orihimebashi: { name: "織姫橋", kana: "おりひめばし", x: 640, y: 233, hub: false, feature: "川沿いの歴史ある商業地区" },
  ginkancho: { name: "銀漢町", kana: "ぎんかんちょう", x: 692, y: 271, hub: true, feature: "副都心的な乗換拠点" },
  hikarigaoka: { name: "光が丘", kana: "ひかりがおか", x: 748, y: 301, hub: false, feature: "大規模ニュータウン" },
  ryuseikoenmae: { name: "流星公園前", kana: "りゅうせいこうえんまえ", x: 771, y: 374, hub: false, feature: "スタジアムや美術館がある文化エリア" },
  tenmanbara: { name: "天満原", kana: "てんまはら", x: 766, y: 433, hub: true, feature: "車両基地がある郊外の拠点" },
  shiomidai: { name: "汐見台", kana: "しおみだい", x: 830, y: 478, hub: false, feature: "海が見え始める高台の住宅街" },
  akatsukikaigan: { name: "暁海岸", kana: "あかつきかいがん", x: 910, y: 522, hub: false, feature: "オーシャンビューの観光駅" },
  seitorinkaikuko: { name: "星都臨海空港", kana: "せいとりんかいくうこう", x: 1003, y: 579, hub: false, feature: "空の玄関口" },
  yoimachicho: { name: "宵待町", kana: "よいまちちょう", x: 670, y: 344, hub: true, feature: "レトロな商店街がある起点" },
  kasumino: { name: "かすみ野", kana: "かすみの", x: 529, y: 304, hub: false, feature: "落ち着いた住宅街" },
  hoshikawa: { name: "星川", kana: "ほしかわ", x: 329, y: 224, hub: true, feature: "川沿いの急行停車駅・乗換拠点" },
  suiseinomori: { name: "翠星の森", kana: "すいせいのもり", x: 494, y: 396, hub: true, feature: "大学や大きな公園がある文教エリア" },
  nishiseito: { name: "西星都", kana: "にしせいと", x: 453, y: 205, hub: false, feature: "百貨店やホテルが並ぶ繁華街" },
  tsukimidai: { name: "月見台", kana: "つきみだい", x: 389, y: 241, hub: true, feature: "山の手の高級住宅街" },
  hokutoguchi: { name: "北斗口", kana: "ほくとぐち", x: 258, y: 178, hub: false, feature: "古い神社や門前町があるエリア" },
  shiratorigaoka: { name: "白鳥ヶ丘", kana: "しらとりがおか", x: 208, y: 139, hub: false, feature: "別荘地・高原リゾート入口" },
  boseionsen: { name: "望星温泉", kana: "ぼうせいおんせん", x: 150, y: 98, hub: false, feature: "渓谷沿いの温泉街" },
  okuseito: { name: "奥星都", kana: "おくせいと", x: 79, y: 46, hub: false, feature: "国立天文台やロープウェイがある観光拠点" },
  shinseito: { name: "新星都", kana: "しんせいと", x: 664, y: 178, hub: false, feature: "新幹線や他社線も乗り入れる近代的ビジネス街" },
  nanseidai: { name: "南星台", kana: "なんせいだい", x: 582, y: 397, hub: false, feature: "昭和の面影を残す大規模団地エリア" },
  izayoi: { name: "二十六夜", kana: "いざよい", x: 411, y: 353, hub: false, feature: "静かな寺社仏閣が集まる歴史地区" },
  seitodaigakumae: { name: "星都大学前", kana: "せいとだいがくまえ", x: 420, y: 178, hub: false, feature: "学生街・カフェが多いエリア" },
  kitaseito: { name: "北星都", kana: "きたせいと", x: 481, y: 150, hub: false, feature: "アリーナや大型ショッピングモールがある再開発エリア" }
};

const LINES = [
  {
    id: "amanogawa",
    name: "天の川線",
    kana: "あまのがわ",
    color: "#00e5ff",
    loop: false,
    stations: ["seito", "seitominami", "orihimebashi", "ginkancho", "hikarigaoka", "ryuseikoenmae", "tenmanbara", "shiomidai", "akatsukikaigan", "seitorinkaikuko"],
    distancesM: [947, 1018, 1183, 1206, 1062, 1591, 1284, 1075, 1612]
  },
  {
    id: "hoshiyoi",
    name: "星屑線",
    kana: "ほしよい",
    color: "#ff8c00",
    loop: false,
    stations: ["yoimachicho", "kasumino", "hoshikawa", "suiseinomori", "tenmanbara"],
    distancesM: [958, 1203, 1439, 1324]
