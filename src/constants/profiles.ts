const THIS_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: THIS_YEAR - 18 - 1939 }, (_, i) =>
  String(THIS_YEAR - 18 - i)
);
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const HEIGHTS = Array.from({ length: 81 }, (_, i) => `${140 + i} cm`);
export const WEIGHTS = Array.from({ length: 111 }, (_, i) => `${40 + i} kg`);

export const MARITAL_OPTIONS = [
  "Unmarried",
  "Widow/Widower",
  "Divorced",
  "Separated",
];

export const PROFILES = [
  "Myself",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Relative",
  "Friend",
];

export const AUTO_GENDER: Record<string, "Male" | "Female"> = {
  Son: "Male",
  Brother: "Male",
  Daughter: "Female",
  Sister: "Female",
};

export const DISABILITY_OPTIONS = [
  "Visual impairment",
  "Hearing impairment",
  "Mobility impairment",
  "Cognitive impairment",
  "Chronic illness",
  "Other",
];

export const PHYSICAL_BUILD_OPTIONS = ["Slim", "Fit", "Muscular", "Average", "Heavy"];

export const EDUCATION_OPTIONS = [
  "School",
  "O/L",
  "A/L",
  "Professional Certification",
  "Diploma",
  "HND",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
];

export const SECTOR = [
  "Government",
  "Private",
  "Business / Self-Employed",
  "Defense / Police",
  "NGO / Social Work",
  "Student",
  "Not Working",
];

export const RELIGION_OPTIONS = [
  "Hindu",
  "Christian",
  "Prefer not to say",
];

export const CASTE_OPTIONS = [
  "Agamudaiyar",
  "Kallar",
  "Karaiyar",
  "Maravar",
  "Mukkuvar",
  "Naidu",
  "Nair",
  "Nalavar",
  "Pallar",
  "Paraiyar",
  "Reddiyar",
  "Saliyar",
  "Thurumbar",
  "Vellalar",
  "Catholic",
  "Orthodox",
  "Protestant",
  "Ceylon Evangelical Lutheran Church (CELC)",
  "Ceylon Pentecostal Mission (CPM)",
  "Christian Reformed Church of Sri Lanka",
  "Church of South India (Jaffna Diocese)",
  "Jehovah's Witnesses",
  "Methodist Church of Sri Lanka",
  "Presbyterian Church (St. Andrew's Church)",
  "Sri Lanka Baptist Sangamaya",
  "The Church of Ceylon",
  "The Church of Jesus Christ of Latter-day Saints",
  "The Salvation Army",
  "Other",
  "Prefer not to say",
];

export const CASTE_OPTIONS_HINDU = [
  "Agamudaiyar",
  "Kallar",
  "Karaiyar",
  "Maravar",
  "Mukkuvar",
  "Naidu",
  "Nair",
  "Nalavar",
  "Pallar",
  "Paraiyar",
  "Reddiyar",
  "Saliyar",
  "Thurumbar",
  "Vellalar",
  "Other",
  "Prefer not to say",
];

export const CASTE_OPTIONS_CHRISTIAN = [
  "Catholic",
  "Orthodox",
  "Protestant",
  "Ceylon Evangelical Lutheran Church (CELC)",
  "Ceylon Pentecostal Mission (CPM)",
  "Christian Reformed Church of Sri Lanka",
  "Church of South India (Jaffna Diocese)",
  "Jehovah's Witnesses",
  "Methodist Church of Sri Lanka",
  "Presbyterian Church (St. Andrew's Church)",
  "Sri Lanka Baptist Sangamaya",
  "The Church of Ceylon",
  "The Church of Jesus Christ of Latter-day Saints",
  "The Salvation Army",
  "Other",
  "Prefer not to say",
];


export const DIET_OPTIONS = [
  "Vegetarian",
  "Non-Vegetarian",
  "Eggetarian",
  "Vegan",
  "Prefer not to say",
];

export const SMOKING_OPTIONS = [
  "Non-Smoker",
  "Occasionally",
  "Regularly",
  "Prefer not to say",
];

export const DRINKING_OPTIONS = [
  "Never",
  "Occasionally",
  "Regularly",
  "Prefer not to say",
];


export type InterestGroup = {
  heading: string;
  items: string[];
};

export const INTEREST_GROUPS: InterestGroup[] = [
  {
    heading: "🎨 Creativity",
    items: [
      "Photography",
      "Painting & sketching",
      "Writing & poetry",
      "Bharatanatyam",
      "Kolam design",
      "Graphic design",
      "Crafting & DIY",
      "Acting / drama",
      "Fashion & styling",
    ],
  },
  {
    heading: "⭐ Fan favourite",
    items: [
      "Comic con",
      "Comics",
      "Harry Potter",
      "Dungeons & dragons",
      "Disney",
      "DC",
      "Manga",
      "Marvel",
    ],
  },
  {
    heading: "🍲 Food and drink",
    items: [
      "Cooking",
      "Baking",
      "Trying new restaurants",
      "Coffee enthusiast",
      "Tea lover",
      "Vegetarian cooking",
      "Street food exploring",
      "Wine tasting",
    ],
  },
  {
    heading: "🎮 Gaming",
    items: [
      "Video games (PC/console)",
      "Mobile gaming",
      "Board games",
      "Carrom",
      "Chess",
      "E-sports",
      "Card games",
    ],
  },
  {
    heading: "🌃 Going out",
    items: [
      "Concerts & live music",
      "Theatre & plays",
      "Stand-up comedy",
      "Exploring new cities",
      "Museums & galleries",
      "Food festivals",
      "Nightlife",
    ],
  },
  {
    heading: "🎵 Music",
    items: [
      "Tamil cinema music",
      "Carnatic music",
      "Western pop & R&B",
      "A.R. Rahman songs",
      "Ilaiyaraaja songs",
      "U1 songs",
      "Classical music",
      "Playing an instrument",
      "Singing",
    ],
  },
  {
    heading: "🏕️ Outdoors and adventure",
    items: [
      "Road trips",
      "Traveling",
      "Hiking & trekking",
      "Beaches & coastal walks",
      "Cycling",
      "Camping",
      "Wildlife photography",
      "Scuba diving",
      "Motorcycling",
      "Astrology",
    ],
  },
  {
    heading: "📱 Social and content",
    items: [
      "Vlogging",
      "Podcasting",
      "Content creation",
      "Blogging",
      "Photography (for S.M)",
      "Meme culture",
    ],
  },
  {
    heading: "🏋️ Sports and fitness",
    items: [
      "Cricket",
      "Badminton",
      "Gym & weightlifting",
      "Yoga",
      "Football (soccer)",
      "Running & marathons",
      "Swimming",
      "Martial arts",
    ],
  },
  {
    heading: "🏡 Staying in",
    items: [
      "Reading books",
      "Gardening",
      "Cooking together",
      "Home décor & interior",
      "Listening to podcasts",
      "Relaxing with pets",
    ],
  },
  {
    heading: "🎬 TV and film",
    items: [
      "Tamil cinema",
      "Watching series",
      "Anime",
      "Documentaries",
      "True crime & thrillers",
      "Short films",
      "Sci-fi & fantasy",
    ],
  },
  {
    heading: "🤝 Values and causes",
    items: [
      "Volunteering",
      "Community service",
      "Temple / church activities",
      "Animal rescue",
      "Environmental activism",
      "Education & mentoring",
      "Human rights",
    ],
  },
  {
    heading: "🧘 Wellness and lifestyle",
    items: [
      "Meditation",
      "Spirituality",
      "Mindfulness",
      "Journaling",
      "Healthy eating",
      "Pilates",
      "Ayurveda",
    ],
  },
];