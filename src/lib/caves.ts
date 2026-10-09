export type CaveEvent = {
  prompt: string;
  options: { label: string; correct: boolean }[];
  insight: string;
};

export type Cave = {
  slug: string;
  title: string;
  subject: string;
  summary: string;
  description: string;
  duration: string;
  difficulty: "Easy" | "Steady" | "Deep dive";
  image: string;
  imageAlt: string;
  photographer: string;
  photographerUrl: string;
  events: CaveEvent[];
};

export const caves: Cave[] = [
  {
    slug: "echo-chamber",
    title: "The Echo Chamber",
    subject: "Sound & physics",
    summary: "A lost survey beacon answers from somewhere in the dark. Use its echoes to find the way through.",
    description: "Read the cave by sound. Each event asks you to listen closely, test an idea, and follow the signal deeper.",
    duration: "5 min",
    difficulty: "Easy",
    image: "/cave-echo.jpg",
    imageAlt: "Warm lights reveal a chamber of cave formations.",
    photographer: "Shalev Cohen",
    photographerUrl: "https://unsplash.com/@shalevcohen",
    events: [
      {
        prompt: "A sharp clap returns as an echo a moment later. What does that delay tell you about the wall?",
        options: [
          { label: "The wall is farther away", correct: true },
          { label: "The wall is warmer", correct: false },
          { label: "The cave is getting quieter", correct: false },
        ],
        insight: "An echo is sound traveling to a surface and back. A longer delay means the round trip took more time, so the reflecting wall is farther away.",
      },
      {
        prompt: "The beacon chirps twice from a narrow passage. Which surface is most likely to return a clear echo?",
        options: [
          { label: "A soft, moss-covered wall", correct: false },
          { label: "A broad, hard rock face", correct: true },
          { label: "A pile of loose leaves", correct: false },
        ],
        insight: "Hard, broad surfaces reflect more sound back toward you. Soft or irregular materials absorb and scatter it.",
      },
    ],
  },
  {
    slug: "quiet-current",
    title: "The Quiet Current",
    subject: "Water & geology",
    summary: "Follow a hidden stream through limestone and uncover the slow work that shaped the chamber.",
    description: "Trace water through stone, read its marks, and piece together a landscape built over deep time.",
    duration: "7 min",
    difficulty: "Steady",
    image: "/cave-current.jpg",
    imageAlt: "A still pool beneath the walls of an underground cavern.",
    photographer: "Victor Velázquez",
    photographerUrl: "https://unsplash.com/@bork95",
    events: [
      {
        prompt: "The stream has left a widening channel in the limestone. What helped the water shape the rock?",
        options: [
          { label: "Weakly acidic water dissolving minerals", correct: true },
          { label: "The stream freezing the stone solid", correct: false },
          { label: "Sunlight bleaching the riverbed", correct: false },
        ],
        insight: "Rainwater absorbs carbon dioxide and becomes mildly acidic. Over time, it dissolves calcite in limestone and enlarges cracks into passages.",
      },
      {
        prompt: "A line of rounded stones rests along the bend. What is the current hinting at?",
        options: [
          { label: "The water once flowed around this bend", correct: true },
          { label: "The stones grew in place", correct: false },
          { label: "The cave was filled with dry sand", correct: false },
        ],
        insight: "Moving water carries and rounds sediment. Deposits along a bend can preserve clues about how a stream once traveled.",
      },
    ],
  },
  {
    slug: "mosslight-garden",
    title: "The Mosslight Garden",
    subject: "Life & ecology",
    summary: "A fragile underground garden is changing. Notice what each organism needs before the light fades.",
    description: "Explore a small hidden ecosystem, connect each clue, and see how one change can ripple through a habitat.",
    duration: "6 min",
    difficulty: "Easy",
    image: "/cave-hero.jpg",
    imageAlt: "Subtle green light reflects from water beneath textured cave walls.",
    photographer: "Andrew Lancaster",
    photographerUrl: "https://unsplash.com/@andrewlancaster",
    events: [
      {
        prompt: "Tiny green patches gather where a thin beam reaches the wall. What do these plants need most to grow?",
        options: [
          { label: "Light and moisture", correct: true },
          { label: "Salt and complete darkness", correct: false },
          { label: "Dry air and warm sand", correct: false },
        ],
        insight: "Mosses need water and light for photosynthesis. In caves they often cluster near entrances or other small sources of light.",
      },
      {
        prompt: "A dripstone channel stops bringing water to the moss. Which change should you expect first?",
        options: [
          { label: "The moss begins to dry and shrink", correct: true },
          { label: "The moss becomes a fungus overnight", correct: false },
          { label: "The cave gains more daylight", correct: false },
        ],
        insight: "Mosses have no deep roots to reach hidden groundwater. They rely on moisture at their surface, so changes in water supply affect them quickly.",
      },
    ],
  },
  {
    slug: "salt-archive",
    title: "The Salt Archive",
    subject: "Minerals & history",
    summary: "Layered crystals preserve a record of vanished water. Read the mineral clues to reconstruct the past.",
    description: "Compare the layers, follow the crystal trail, and discover how a changing climate can leave a mark underground.",
    duration: "8 min",
    difficulty: "Deep dive",
    image: "/cave-current.jpg",
    imageAlt: "Mineral-lined cave walls meet a dark underground pool.",
    photographer: "Victor Velázquez",
    photographerUrl: "https://unsplash.com/@bork95",
    events: [
      {
        prompt: "A pale crystal crust sits above the old waterline. What most likely left it behind?",
        options: [
          { label: "Mineral-rich water evaporating", correct: true },
          { label: "A gust of wind polishing the rock", correct: false },
          { label: "Fresh lava cooling in the pool", correct: false },
        ],
        insight: "When mineral-rich water evaporates, dissolved minerals can crystallize on the surface. These deposits can record past water levels and conditions.",
      },
      {
        prompt: "The crystal layers become thinner toward the entrance. Which clue would best explain the change?",
        options: [
          { label: "The water supply or evaporation rate changed", correct: true },
          { label: "The crystals moved toward the entrance", correct: false },
          { label: "The cave became younger", correct: false },
        ],
        insight: "Mineral growth depends on water chemistry, supply, and evaporation. A shift in any of these can change how quickly a crust builds up.",
      },
    ],
  },
];