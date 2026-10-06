export type ThemeId = "green" | "amber" | "white" | "blue";

export type Weapon = {
  id: string;
  name: string;
  damage: string;
  ammo: string;
  count: string;
  rate: string;
  range: string;
  accuracy: string;
  value: string;
  weight: string;
  image: string;
};

export type Special = {
  id: string;
  name: string;
  score: number;
  desc: string;
  image: string;
};

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: "green", label: "GREEN" },
  { id: "amber", label: "AMBER" },
  { id: "white", label: "WHITE" },
  { id: "blue", label: "ELECTRIC BLUE" },
];

export const SPECIAL: Special[] = [
  {
    id: "strength",
    name: "Strength",
    score: 4,
    desc: "Strength is a measure of your raw physical power. It affects how much you can carry, and the damage of all melee attacks.",
    image: "/unit99/img/stat-special/Strength_FO4.webp",
  },
  {
    id: "perception",
    name: "Perception",
    score: 4,
    desc: "Perception is your environmental awareness and sixth sense, and affects weapon accuracy in V.A.T.S.",
    image: "/unit99/img/stat-special/Perception_FO4.webp",
  },
  {
    id: "endurance",
    name: "Endurance",
    score: 4,
    desc: "Endurance is a measure of your overall physical fitness. It affects your total Health and the Action Point drain from sprinting.",
    image: "/unit99/img/stat-special/Endurance_FO4.webp",
  },
  {
    id: "charisma",
    name: "Charisma",
    score: 3,
    desc: "Charisma is your ability to charm and convince others. It affects your success to persuade in dialogue and prices when you barter.",
    image: "/unit99/img/stat-special/Charisma_FO4.webp",
  },
  {
    id: "intelligence",
    name: "Intelligence",
    score: 3,
    desc: "Intelligence is a measure of your overall mental acuity, and affects the number of Experience Points earned.",
    image: "/unit99/img/stat-special/Intelligence_FO4.webp",
  },
  {
    id: "agility",
    name: "Agility",
    score: 3,
    desc: "Agility is a measure of your overall finesse and reflexes. It affects the number of Action Points in V.A.T.S. and your ability to sneak.",
    image: "/unit99/img/stat-special/Agility_FO4.webp",
  },
  {
    id: "luck",
    name: "Luck",
    score: 2,
    desc: "Luck is the measure of your general good fortune, and affects the recharge rate of critical hits.",
    image: "/unit99/img/stat-special/Luck_FO4.webp",
  },
];

export const WEAPONS: Weapon[] = [
  { id: "the-gainer", name: "The Gainer", damage: "48", ammo: ".44 rounds", count: "24", rate: "6", range: "119", accuracy: "74", value: "468", weight: "4.4", image: "/unit99/img/weapons/the-gainer.webp" },
  { id: "combat-rifle", name: "Combat Rifle", damage: "28", ammo: ".45 rounds", count: "101", rate: "33", range: "120", accuracy: "68", value: "130", weight: "7.0", image: "/unit99/img/weapons/combat-rifle.webp" },
  { id: "double-barrel-shotgun", name: "Double Barrel Shotgun", damage: "80", ammo: "Shotgun Shells", count: "27", rate: "36", range: "36", accuracy: "14", value: "100", weight: "6.0", image: "/unit99/img/weapons/double-barrel-shotgun.webp" },
  { id: "10mm-smg", name: "10mm submachine gun", damage: "17", ammo: "10mm rounds", count: "12", rate: "91", range: "84", accuracy: "50", value: "57", weight: "3.0", image: "/unit99/img/weapons/10mm-smg.webp" },
  { id: "gauss-rifle", name: "Gauss Rifle", damage: "125", ammo: "2mm EC", count: "39", rate: "77", range: "204", accuracy: "60", value: "200", weight: "8.0", image: "/unit99/img/weapons/gauss-rifle.webp" },
  { id: "gatling-gun", name: "Gatling Gun", damage: "43", ammo: "5mm rounds", count: "35", rate: "20", range: "120", accuracy: "55", value: "175", weight: "18.0", image: "/unit99/img/weapons/gatling-gun.webp" },
  { id: "m79", name: "M79 grenade launcher", damage: "3", ammo: "40mm grenade rounds", count: "43", rate: "3", range: "120", accuracy: "27", value: "30", weight: "6.0", image: "/unit99/img/weapons/m79-gnd-lnchr.webp" },
  { id: "reba", name: "Reba", damage: "37", ammo: ".308 rounds", count: "23", rate: "3", range: "131", accuracy: "71", value: "55", weight: "9.6", image: "/unit99/img/weapons/reba.webp" },
  { id: "laser-gun", name: "Laser gun", damage: "21", ammo: "Fusion Cell", count: "5", rate: "40", range: "120", accuracy: "72", value: "60", weight: "3.0", image: "/unit99/img/weapons/laser-gun.webp" },
  { id: "bfg-9000", name: "BFG 9000", damage: "300", ammo: "Alien blaster rounds", count: "2", rate: "66", range: "11", accuracy: "52", value: "2000", weight: "35.0", image: "/unit99/img/weapons/bfg-9000.webp" },
];

export const STATIONS = [
  { id: "vault", name: "VAULT MAINTENANCE", freq: "99.1" },
  { id: "road", name: "MIRAMICHI ROAD", freq: "103.5" },
  { id: "static", name: "STATIC SWEEP", freq: "87.9" },
  { id: "mix", name: "FAVOURITE RADIO MIX", freq: "106.7" },
];

export const BOOT_LINES = [
  "launch EFI 0 0x0000A4 0x00000000000000000 1 0 0x000009 0x000000000000E003D CPU",
  "starting EFI 0 0x0000A4 0x00000000000000000 1 0 0x0000A4 0x00000000000000000",
  "start memory discovery",
  "starting cell relocation",
  "*************** PIP-OS (R) V7.1.0.8 ***************",
  "COPYRIGHT 2075 ROBCO(R)",
  "INITIATING...",
  "LOADING",
  "INITIALIZED",
  "VAULT MAINTENANCE UNIT 99-E",
];
