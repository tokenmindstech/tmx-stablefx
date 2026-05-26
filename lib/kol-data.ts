export type KOLPlatform =
  | "X"
  | "YouTube"
  | "Instagram"
  | "TikTok"
  | "Telegram"
  | "Discord";

export type KOLRisk = "Low" | "Medium" | "High";

export type KOLNiche =
  | "Content Creator"
  | "Social Media Influencer"
  | "Crypto/DeFi"
  | "Finance"
  | "Education"
  | "Community"
  | "Crypto/Web3"
  | "Gaming"
  | "Technology"
  | "NFT/Art";

export interface ContactMethod {
  type: "Email" | "Telegram" | "Discord" | "Twitter DM" | "WhatsApp";
  value: string;
}

export interface PlatformStat {
  platform: KOLPlatform;
  handle: string;
  followers: number;
  avgViews: number;
  engagementRate: number;
  postsPerMonth: number;
  profileUrl: string;
}

export interface CampaignHistory {
  campaignName: string;
  client: string;
  date: string;
  budget: number;
  reach: number;
  status: "Completed" | "Active" | "Paused";
}

export interface RateCard {
  platform: KOLPlatform;
  contentType: string;
  price: number;
  currency: string;
}

export interface KOL {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  niche: KOLNiche;
  region: string;
  country: string;
  languages: string[];
  platforms: KOLPlatform[];
  primaryPlatform: KOLPlatform;
  totalFollowers: number;
  totalReach: number;
  avgEngagementRate: number;
  risk: KOLRisk;
  riskReason?: string;
  contacts: ContactMethod[];
  platformStats: PlatformStat[];
  rateCard: RateCard[];
  campaigns: CampaignHistory[];
  tags: string[];
  notes: string;
  joinedDate: string;
  lastActivity: string;
  verified: boolean;
  // Aggregate stats
  totalPostsLastMonth: number;
  totalImpressionsLastMonth: number;
  audienceDemographics: {
    ageGroup: string;
    percentage: number;
  }[];
  topAudienceCountries: {
    country: string;
    percentage: number;
  }[];
}

export const KOL_DATA: KOL[] = [
  {
    id: "1",
    name: "ilodiwow",
    username: "ilodiwow",
    avatar: "",
    bio: "Crypto enthusiast and content creator based in West Asia. Specializing in DeFi tutorials, NFT reviews, and blockchain education. Partnered with 30+ crypto projects.",
    niche: "Content Creator",
    region: "West Asia",
    country: "United Arab Emirates",
    languages: ["English", "Arabic"],
    platforms: ["X", "YouTube", "Telegram"],
    primaryPlatform: "X",
    totalFollowers: 88400,
    totalReach: 245000,
    avgEngagementRate: 4.8,
    risk: "Low",
    contacts: [
      { type: "Email", value: "ilodiwow@gmail.com" },
      { type: "Telegram", value: "@ilodiwow_biz" },
      { type: "Twitter DM", value: "@ilodiwow" },
    ],
    platformStats: [
      {
        platform: "X",
        handle: "@ilodiwow",
        followers: 88400,
        avgViews: 15200,
        engagementRate: 4.8,
        postsPerMonth: 45,
        profileUrl: "https://x.com/ilodiwow",
      },
      {
        platform: "YouTube",
        handle: "ilodiwow",
        followers: 120000,
        avgViews: 38000,
        engagementRate: 6.2,
        postsPerMonth: 8,
        profileUrl: "https://youtube.com/@ilodiwow",
      },
      {
        platform: "Telegram",
        handle: "ilodiwow_channel",
        followers: 36600,
        avgViews: 22000,
        engagementRate: 5.1,
        postsPerMonth: 60,
        profileUrl: "https://t.me/ilodiwow_channel",
      },
    ],
    rateCard: [
      {
        platform: "X",
        contentType: "Tweet + Thread",
        price: 400,
        currency: "USD",
      },
      {
        platform: "YouTube",
        contentType: "Dedicated Video (5–10 min)",
        price: 2500,
        currency: "USD",
      },
      {
        platform: "YouTube",
        contentType: "Integration (60s)",
        price: 1200,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "Channel Post",
        price: 300,
        currency: "USD",
      },
    ],
    campaigns: [
      {
        campaignName: "DeFi Summer 2025",
        client: "Uniswap V4",
        date: "2025-07-01",
        budget: 3500,
        reach: 180000,
        status: "Completed",
      },
      {
        campaignName: "NFT Launch Blast",
        client: "ArtBlocks",
        date: "2025-09-15",
        budget: 2000,
        reach: 95000,
        status: "Completed",
      },
      {
        campaignName: "Layer2 Awareness",
        client: "Arbitrum",
        date: "2026-01-10",
        budget: 4000,
        reach: 210000,
        status: "Completed",
      },
    ],
    tags: ["DeFi", "NFT", "Blockchain Education", "Web3", "Arabic Market"],
    notes:
      "Very responsive. Delivers content on time. Strong Arabic-speaking audience — good for MENA market campaigns.",
    joinedDate: "2024-03-12",
    lastActivity: "2026-05-20",
    verified: true,
    totalPostsLastMonth: 42,
    totalImpressionsLastMonth: 890000,
    audienceDemographics: [
      { ageGroup: "18–24", percentage: 32 },
      { ageGroup: "25–34", percentage: 41 },
      { ageGroup: "35–44", percentage: 18 },
      { ageGroup: "45+", percentage: 9 },
    ],
    topAudienceCountries: [
      { country: "UAE", percentage: 28 },
      { country: "Saudi Arabia", percentage: 19 },
      { country: "Egypt", percentage: 12 },
      { country: "USA", percentage: 10 },
      { country: "UK", percentage: 7 },
    ],
  },
  {
    id: "2",
    name: "BULLION_ist",
    username: "BULLION_ist",
    avatar: "",
    bio: "New York-based crypto and precious metals analyst. Covering tokenized assets, stablecoins, and macro finance. Regular contributor to CoinDesk and Decrypt.",
    niche: "Social Media Influencer",
    region: "New York, USA",
    country: "United States",
    languages: ["English"],
    platforms: ["X", "Instagram"],
    primaryPlatform: "X",
    totalFollowers: 7149,
    totalReach: 22000,
    avgEngagementRate: 3.6,
    risk: "Low",
    contacts: [
      { type: "Email", value: "bullionist@protonmail.com" },
      { type: "Twitter DM", value: "@BULLION_ist" },
    ],
    platformStats: [
      {
        platform: "X",
        handle: "@BULLION_ist",
        followers: 7149,
        avgViews: 4200,
        engagementRate: 3.6,
        postsPerMonth: 30,
        profileUrl: "https://x.com/BULLION_ist",
      },
      {
        platform: "Instagram",
        handle: "@bullionist_official",
        followers: 14851,
        avgViews: 8100,
        engagementRate: 4.1,
        postsPerMonth: 12,
        profileUrl: "https://instagram.com/bullionist_official",
      },
    ],
    rateCard: [
      {
        platform: "X",
        contentType: "Tweet Thread",
        price: 200,
        currency: "USD",
      },
      {
        platform: "Instagram",
        contentType: "Reel",
        price: 600,
        currency: "USD",
      },
      {
        platform: "Instagram",
        contentType: "Static Post",
        price: 350,
        currency: "USD",
      },
    ],
    campaigns: [
      {
        campaignName: "Tokenized Gold Launch",
        client: "Paxos",
        date: "2025-04-20",
        budget: 800,
        reach: 21000,
        status: "Completed",
      },
      {
        campaignName: "Stablecoin Awareness",
        client: "Circle",
        date: "2026-02-01",
        budget: 1200,
        reach: 34000,
        status: "Completed",
      },
    ],
    tags: ["Gold", "Stablecoins", "Macro Finance", "Tokenized Assets"],
    notes:
      "Niche but highly engaged audience. Good for finance-adjacent crypto projects targeting US market.",
    joinedDate: "2024-06-05",
    lastActivity: "2026-05-18",
    verified: false,
    totalPostsLastMonth: 28,
    totalImpressionsLastMonth: 98000,
    audienceDemographics: [
      { ageGroup: "18–24", percentage: 18 },
      { ageGroup: "25–34", percentage: 38 },
      { ageGroup: "35–44", percentage: 30 },
      { ageGroup: "45+", percentage: 14 },
    ],
    topAudienceCountries: [
      { country: "USA", percentage: 62 },
      { country: "UK", percentage: 11 },
      { country: "Canada", percentage: 9 },
      { country: "Australia", percentage: 5 },
      { country: "Germany", percentage: 4 },
    ],
  },
  {
    id: "3",
    name: "KierianV",
    username: "KierianV",
    avatar: "",
    bio: "European DeFi researcher and yield farming expert. Runs weekly alpha newsletters and live trading sessions. Trusted voice in the Ethereum and L2 ecosystem.",
    niche: "Crypto/DeFi",
    region: "Europe",
    country: "Netherlands",
    languages: ["English", "Dutch"],
    platforms: ["X", "Telegram", "Discord"],
    primaryPlatform: "X",
    totalFollowers: 17300,
    totalReach: 58000,
    avgEngagementRate: 5.9,
    risk: "Low",
    contacts: [
      { type: "Email", value: "kierianv@defiresearch.io" },
      { type: "Telegram", value: "@kierianv_defi" },
      { type: "Discord", value: "kierianv#4521" },
    ],
    platformStats: [
      {
        platform: "X",
        handle: "@KierianV",
        followers: 17300,
        avgViews: 9800,
        engagementRate: 5.9,
        postsPerMonth: 55,
        profileUrl: "https://x.com/KierianV",
      },
      {
        platform: "Telegram",
        handle: "KierianV Alpha",
        followers: 8200,
        avgViews: 7500,
        engagementRate: 7.2,
        postsPerMonth: 80,
        profileUrl: "https://t.me/kierianvalpha",
      },
      {
        platform: "Discord",
        handle: "KierianV Server",
        followers: 3100,
        avgViews: 1200,
        engagementRate: 8.4,
        postsPerMonth: 40,
        profileUrl: "https://discord.gg/kierianv",
      },
    ],
    rateCard: [
      {
        platform: "X",
        contentType: "Tweet + Thread",
        price: 450,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "Alpha Post",
        price: 350,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "Newsletter Sponsorship",
        price: 800,
        currency: "USD",
      },
    ],
    campaigns: [
      {
        campaignName: "Uniswap V4 DeFi Push",
        client: "Uniswap",
        date: "2025-06-01",
        budget: 1500,
        reach: 45000,
        status: "Completed",
      },
      {
        campaignName: "Eigenlayer Restaking",
        client: "Eigenlayer",
        date: "2025-11-20",
        budget: 2200,
        reach: 62000,
        status: "Completed",
      },
      {
        campaignName: "Pendle Finance Campaign",
        client: "Pendle",
        date: "2026-03-05",
        budget: 1800,
        reach: 51000,
        status: "Completed",
      },
    ],
    tags: ["DeFi", "Yield Farming", "Ethereum", "L2", "Alpha", "Restaking"],
    notes:
      "Deep DeFi knowledge. Audience is highly sophisticated — ideal for protocol-level campaigns. Has paid newsletter with 4,200 subscribers.",
    joinedDate: "2024-01-18",
    lastActivity: "2026-05-24",
    verified: true,
    totalPostsLastMonth: 55,
    totalImpressionsLastMonth: 310000,
    audienceDemographics: [
      { ageGroup: "18–24", percentage: 22 },
      { ageGroup: "25–34", percentage: 48 },
      { ageGroup: "35–44", percentage: 24 },
      { ageGroup: "45+", percentage: 6 },
    ],
    topAudienceCountries: [
      { country: "Netherlands", percentage: 18 },
      { country: "Germany", percentage: 14 },
      { country: "USA", percentage: 22 },
      { country: "UK", percentage: 11 },
      { country: "France", percentage: 8 },
    ],
  },
  {
    id: "4",
    name: "0xFallin",
    username: "0xFallin",
    avatar: "",
    bio: "Anonymous finance and crypto analyst. Known for sharp macro takes and early project discoveries. Has a track record of calling 3 top-10 altcoins before breakout.",
    niche: "Finance",
    region: "The Heavens",
    country: "Unknown",
    languages: ["English"],
    platforms: ["X", "Telegram"],
    primaryPlatform: "X",
    totalFollowers: 13400,
    totalReach: 41000,
    avgEngagementRate: 6.7,
    risk: "Low",
    contacts: [
      { type: "Twitter DM", value: "@0xFallin" },
      { type: "Telegram", value: "@fallin_0x" },
    ],
    platformStats: [
      {
        platform: "X",
        handle: "@0xFallin",
        followers: 13400,
        avgViews: 11200,
        engagementRate: 6.7,
        postsPerMonth: 65,
        profileUrl: "https://x.com/0xFallin",
      },
      {
        platform: "Telegram",
        handle: "Fallin Alpha",
        followers: 4800,
        avgViews: 4200,
        engagementRate: 6.1,
        postsPerMonth: 90,
        profileUrl: "https://t.me/fallin_alpha",
      },
    ],
    rateCard: [
      {
        platform: "X",
        contentType: "Tweet Analysis",
        price: 600,
        currency: "USD",
      },
      {
        platform: "X",
        contentType: "Pinned Tweet (7 days)",
        price: 1000,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "Alpha Call",
        price: 500,
        currency: "USD",
      },
    ],
    campaigns: [
      {
        campaignName: "Altcoin Season Push",
        client: "Binance",
        date: "2025-08-10",
        budget: 3000,
        reach: 85000,
        status: "Completed",
      },
      {
        campaignName: "DeFi Protocol Launch",
        client: "Curve Finance",
        date: "2026-01-25",
        budget: 2500,
        reach: 72000,
        status: "Completed",
      },
    ],
    tags: ["Macro", "Altcoins", "Alpha Calls", "Anonymous", "Finance"],
    notes:
      "Anonymous influencer with high credibility in CT (Crypto Twitter). Very high engagement. Prefers to work with quality projects only.",
    joinedDate: "2024-05-22",
    lastActivity: "2026-05-22",
    verified: false,
    totalPostsLastMonth: 58,
    totalImpressionsLastMonth: 420000,
    audienceDemographics: [
      { ageGroup: "18–24", percentage: 28 },
      { ageGroup: "25–34", percentage: 45 },
      { ageGroup: "35–44", percentage: 20 },
      { ageGroup: "45+", percentage: 7 },
    ],
    topAudienceCountries: [
      { country: "USA", percentage: 35 },
      { country: "UK", percentage: 12 },
      { country: "India", percentage: 10 },
      { country: "Nigeria", percentage: 8 },
      { country: "Philippines", percentage: 6 },
    ],
  },
  {
    id: "5",
    name: "anilsingta",
    username: "anilsingta",
    avatar: "",
    bio: "Indian crypto educator with a focus on making Web3 accessible to the masses. Runs educational threads, explainer videos, and beginner-friendly guides in Hindi and English.",
    niche: "Education",
    region: "India",
    country: "India",
    languages: ["English", "Hindi"],
    platforms: ["X", "YouTube", "Instagram", "Telegram"],
    primaryPlatform: "X",
    totalFollowers: 15600,
    totalReach: 88000,
    avgEngagementRate: 5.3,
    risk: "Low",
    contacts: [
      { type: "Email", value: "anil@web3india.com" },
      { type: "Telegram", value: "@anilsingta" },
      { type: "WhatsApp", value: "+91 98765 43210" },
    ],
    platformStats: [
      {
        platform: "X",
        handle: "@anilsingta",
        followers: 15600,
        avgViews: 8900,
        engagementRate: 5.3,
        postsPerMonth: 40,
        profileUrl: "https://x.com/anilsingta",
      },
      {
        platform: "YouTube",
        handle: "Anil Singta Web3",
        followers: 42000,
        avgViews: 18500,
        engagementRate: 4.8,
        postsPerMonth: 6,
        profileUrl: "https://youtube.com/@anilsingta",
      },
      {
        platform: "Instagram",
        handle: "@anilsingta",
        followers: 21000,
        avgViews: 9200,
        engagementRate: 4.1,
        postsPerMonth: 14,
        profileUrl: "https://instagram.com/anilsingta",
      },
      {
        platform: "Telegram",
        handle: "Web3 India by Anil",
        followers: 9400,
        avgViews: 7800,
        engagementRate: 5.9,
        postsPerMonth: 50,
        profileUrl: "https://t.me/web3india_anil",
      },
    ],
    rateCard: [
      {
        platform: "X",
        contentType: "Educational Thread",
        price: 300,
        currency: "USD",
      },
      {
        platform: "YouTube",
        contentType: "Dedicated Video",
        price: 1800,
        currency: "USD",
      },
      {
        platform: "Instagram",
        contentType: "Reel",
        price: 500,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "Sponsored Post",
        price: 250,
        currency: "USD",
      },
    ],
    campaigns: [
      {
        campaignName: "Web3 India Bootcamp",
        client: "Polygon",
        date: "2025-03-01",
        budget: 4000,
        reach: 120000,
        status: "Completed",
      },
      {
        campaignName: "DeFi 101 Series",
        client: "Aave",
        date: "2025-09-10",
        budget: 2800,
        reach: 87000,
        status: "Completed",
      },
      {
        campaignName: "NFT Marketplace Launch",
        client: "OpenSea",
        date: "2026-02-14",
        budget: 3200,
        reach: 95000,
        status: "Completed",
      },
    ],
    tags: ["Education", "Hindi", "India", "Web3 Beginner", "Explainer"],
    notes:
      "Strong reach in Indian crypto community. Hindi-speaking audience is underserved — great for South Asia market expansion.",
    joinedDate: "2023-11-30",
    lastActivity: "2026-05-23",
    verified: true,
    totalPostsLastMonth: 48,
    totalImpressionsLastMonth: 620000,
    audienceDemographics: [
      { ageGroup: "18–24", percentage: 42 },
      { ageGroup: "25–34", percentage: 38 },
      { ageGroup: "35–44", percentage: 14 },
      { ageGroup: "45+", percentage: 6 },
    ],
    topAudienceCountries: [
      { country: "India", percentage: 68 },
      { country: "Pakistan", percentage: 6 },
      { country: "Bangladesh", percentage: 4 },
      { country: "USA", percentage: 8 },
      { country: "UK", percentage: 5 },
    ],
  },
  {
    id: "6",
    name: "sezorock",
    username: "sezorock",
    avatar: "",
    bio: "Turkish crypto community builder and Web3 evangelist. Organizes local meetups, manages a 30K+ Telegram community, and collaborates with global crypto projects for Turkish market entry.",
    niche: "Community",
    region: "Turkey",
    country: "Turkey",
    languages: ["Turkish", "English"],
    platforms: ["X", "Telegram", "Discord"],
    primaryPlatform: "X",
    totalFollowers: 30700,
    totalReach: 95000,
    avgEngagementRate: 4.4,
    risk: "Low",
    contacts: [
      { type: "Email", value: "sezorock@cryptoturkiye.com" },
      { type: "Telegram", value: "@sezorock" },
      { type: "Twitter DM", value: "@sezorock" },
    ],
    platformStats: [
      {
        platform: "X",
        handle: "@sezorock",
        followers: 30700,
        avgViews: 12400,
        engagementRate: 4.4,
        postsPerMonth: 35,
        profileUrl: "https://x.com/sezorock",
      },
      {
        platform: "Telegram",
        handle: "Crypto Türkiye",
        followers: 31200,
        avgViews: 18000,
        engagementRate: 4.8,
        postsPerMonth: 70,
        profileUrl: "https://t.me/cryptoturkiye",
      },
      {
        platform: "Discord",
        handle: "Web3 TR",
        followers: 5600,
        avgViews: 2100,
        engagementRate: 5.1,
        postsPerMonth: 30,
        profileUrl: "https://discord.gg/web3tr",
      },
    ],
    rateCard: [
      {
        platform: "X",
        contentType: "Tweet + Retweet",
        price: 350,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "Community Post",
        price: 400,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "AMA (1 hour)",
        price: 1200,
        currency: "USD",
      },
    ],
    campaigns: [
      {
        campaignName: "Turkey Market Entry",
        client: "Binance TR",
        date: "2025-02-20",
        budget: 5000,
        reach: 140000,
        status: "Completed",
      },
      {
        campaignName: "DeFi Awareness Turkey",
        client: "Compound",
        date: "2025-10-05",
        budget: 2600,
        reach: 78000,
        status: "Completed",
      },
      {
        campaignName: "GameFi Launch",
        client: "Axie Infinity",
        date: "2026-04-12",
        budget: 3400,
        reach: 98000,
        status: "Active",
      },
    ],
    tags: ["Turkey", "Community", "Turkish", "Meetups", "AMA"],
    notes:
      "Go-to KOL for Turkish market. Organizes monthly Istanbul crypto meetups with 200–500 attendees. Very professional.",
    joinedDate: "2023-09-14",
    lastActivity: "2026-05-25",
    verified: true,
    totalPostsLastMonth: 62,
    totalImpressionsLastMonth: 480000,
    audienceDemographics: [
      { ageGroup: "18–24", percentage: 35 },
      { ageGroup: "25–34", percentage: 44 },
      { ageGroup: "35–44", percentage: 16 },
      { ageGroup: "45+", percentage: 5 },
    ],
    topAudienceCountries: [
      { country: "Turkey", percentage: 74 },
      { country: "Germany", percentage: 7 },
      { country: "Netherlands", percentage: 4 },
      { country: "USA", percentage: 6 },
      { country: "UK", percentage: 3 },
    ],
  },
  {
    id: "7",
    name: "BizoveCrypto",
    username: "BizoveCrypto",
    avatar: "",
    bio: "Web3 builder, investor, and educator. Focus on emerging crypto projects, launchpad analysis, and on-chain analytics. Runs a popular weekly crypto digest.",
    niche: "Crypto/Web3",
    region: "DM for collab",
    country: "Unknown",
    languages: ["English"],
    platforms: ["X", "Telegram"],
    primaryPlatform: "X",
    totalFollowers: 8434,
    totalReach: 26000,
    avgEngagementRate: 5.1,
    risk: "Low",
    contacts: [
      { type: "Twitter DM", value: "@BizoveCrypto" },
      { type: "Telegram", value: "@bizovecrypto_biz" },
    ],
    platformStats: [
      {
        platform: "X",
        handle: "@BizoveCrypto",
        followers: 8434,
        avgViews: 5600,
        engagementRate: 5.1,
        postsPerMonth: 50,
        profileUrl: "https://x.com/BizoveCrypto",
      },
      {
        platform: "Telegram",
        handle: "Bizovelabs Digest",
        followers: 3200,
        avgViews: 2800,
        engagementRate: 5.5,
        postsPerMonth: 28,
        profileUrl: "https://t.me/bizovelabs",
      },
    ],
    rateCard: [
      {
        platform: "X",
        contentType: "Tweet Review",
        price: 250,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "Digest Feature",
        price: 400,
        currency: "USD",
      },
    ],
    campaigns: [
      {
        campaignName: "Launchpad Awareness",
        client: "PinkSale",
        date: "2025-05-18",
        budget: 1100,
        reach: 32000,
        status: "Completed",
      },
      {
        campaignName: "On-chain Analytics Push",
        client: "Nansen",
        date: "2025-12-01",
        budget: 900,
        reach: 24000,
        status: "Completed",
      },
    ],
    tags: ["Web3", "Launchpad", "On-chain", "Analytics", "Weekly Digest"],
    notes:
      "Prefers DM contact. Quick turnaround. Good for launchpad and analytics tools promotion.",
    joinedDate: "2024-07-10",
    lastActivity: "2026-05-19",
    verified: false,
    totalPostsLastMonth: 44,
    totalImpressionsLastMonth: 145000,
    audienceDemographics: [
      { ageGroup: "18–24", percentage: 30 },
      { ageGroup: "25–34", percentage: 46 },
      { ageGroup: "35–44", percentage: 18 },
      { ageGroup: "45+", percentage: 6 },
    ],
    topAudienceCountries: [
      { country: "USA", percentage: 28 },
      { country: "UK", percentage: 10 },
      { country: "Nigeria", percentage: 12 },
      { country: "India", percentage: 15 },
      { country: "Philippines", percentage: 8 },
    ],
  },
  {
    id: "8",
    name: "ApeChartz",
    username: "ApeChartz",
    avatar: "",
    bio: "US-based crypto charting specialist and technical analyst. Known for precise entry/exit calls on BTC, ETH, and top altcoins. Collaborates with exchanges and trading platforms.",
    niche: "Crypto/Web3",
    region: "United States",
    country: "United States",
    languages: ["English"],
    platforms: ["X", "YouTube", "Discord"],
    primaryPlatform: "X",
    totalFollowers: 26600,
    totalReach: 72000,
    avgEngagementRate: 4.2,
    risk: "Low",
    contacts: [
      { type: "Email", value: "apechartz@tradingdesk.io" },
      { type: "Discord", value: "ApeChartz#0001" },
      { type: "Twitter DM", value: "@ApeChartz" },
    ],
    platformStats: [
      {
        platform: "X",
        handle: "@ApeChartz",
        followers: 26600,
        avgViews: 13800,
        engagementRate: 4.2,
        postsPerMonth: 48,
        profileUrl: "https://x.com/ApeChartz",
      },
      {
        platform: "YouTube",
        handle: "ApeChartz TA",
        followers: 18900,
        avgViews: 9200,
        engagementRate: 3.8,
        postsPerMonth: 10,
        profileUrl: "https://youtube.com/@apechartz",
      },
      {
        platform: "Discord",
        handle: "ApeChartz Trading Hub",
        followers: 7800,
        avgViews: 3200,
        engagementRate: 6.1,
        postsPerMonth: 20,
        profileUrl: "https://discord.gg/apechartz",
      },
    ],
    rateCard: [
      {
        platform: "X",
        contentType: "Chart Analysis Post",
        price: 500,
        currency: "USD",
      },
      {
        platform: "YouTube",
        contentType: "Chart Review Video",
        price: 2200,
        currency: "USD",
      },
      {
        platform: "Discord",
        contentType: "Pinned Announcement",
        price: 800,
        currency: "USD",
      },
    ],
    campaigns: [
      {
        campaignName: "Exchange Launch",
        client: "Bitget",
        date: "2025-07-22",
        budget: 4500,
        reach: 95000,
        status: "Completed",
      },
      {
        campaignName: "Futures Trading Promo",
        client: "Bybit",
        date: "2025-11-08",
        budget: 5000,
        reach: 110000,
        status: "Completed",
      },
      {
        campaignName: "DCA Tool Awareness",
        client: "3Commas",
        date: "2026-03-20",
        budget: 3800,
        reach: 88000,
        status: "Completed",
      },
    ],
    tags: ["Technical Analysis", "Trading", "Charts", "BTC", "ETH", "Altcoins"],
    notes:
      "Strong US-based trading audience. Best for exchange, trading tools, and derivatives platforms. Very professional delivery.",
    joinedDate: "2023-08-25",
    lastActivity: "2026-05-24",
    verified: true,
    totalPostsLastMonth: 52,
    totalImpressionsLastMonth: 560000,
    audienceDemographics: [
      { ageGroup: "18–24", percentage: 25 },
      { ageGroup: "25–34", percentage: 47 },
      { ageGroup: "35–44", percentage: 22 },
      { ageGroup: "45+", percentage: 6 },
    ],
    topAudienceCountries: [
      { country: "USA", percentage: 52 },
      { country: "Canada", percentage: 8 },
      { country: "Australia", percentage: 7 },
      { country: "UK", percentage: 9 },
      { country: "Singapore", percentage: 5 },
    ],
  },
  {
    id: "9",
    name: "Okpara081",
    username: "Okpara081",
    avatar: "",
    bio: "Nigerian crypto influencer and ambassador for Web3 adoption in Africa. Focuses on P2E gaming, crypto earning opportunities, and financial inclusion through blockchain.",
    niche: "Social Media Influencer",
    region: "Nigeria",
    country: "Nigeria",
    languages: ["English", "Yoruba"],
    platforms: ["X", "Telegram", "TikTok"],
    primaryPlatform: "X",
    totalFollowers: 42900,
    totalReach: 115000,
    avgEngagementRate: 5.8,
    risk: "Low",
    contacts: [
      { type: "Email", value: "okpara081@web3africa.ng" },
      { type: "Telegram", value: "@okpara081" },
      { type: "Twitter DM", value: "@Okpara081" },
    ],
    platformStats: [
      {
        platform: "X",
        handle: "@Okpara081",
        followers: 42900,
        avgViews: 19800,
        engagementRate: 5.8,
        postsPerMonth: 55,
        profileUrl: "https://x.com/Okpara081",
      },
      {
        platform: "Telegram",
        handle: "Web3 Africa Hub",
        followers: 22000,
        avgViews: 14500,
        engagementRate: 5.2,
        postsPerMonth: 65,
        profileUrl: "https://t.me/web3africahub",
      },
      {
        platform: "TikTok",
        handle: "@okpara081",
        followers: 50200,
        avgViews: 35000,
        engagementRate: 7.4,
        postsPerMonth: 20,
        profileUrl: "https://tiktok.com/@okpara081",
      },
    ],
    rateCard: [
      {
        platform: "X",
        contentType: "Tweet Campaign",
        price: 380,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "Community Blast",
        price: 350,
        currency: "USD",
      },
      {
        platform: "TikTok",
        contentType: "Short Video",
        price: 900,
        currency: "USD",
      },
    ],
    campaigns: [
      {
        campaignName: "P2E Africa Push",
        client: "Axie Infinity",
        date: "2025-04-05",
        budget: 3200,
        reach: 145000,
        status: "Completed",
      },
      {
        campaignName: "Africa Crypto Onboarding",
        client: "Binance",
        date: "2025-08-20",
        budget: 4500,
        reach: 180000,
        status: "Completed",
      },
      {
        campaignName: "GameFi Nigeria",
        client: "STEPN",
        date: "2026-01-18",
        budget: 2900,
        reach: 110000,
        status: "Completed",
      },
    ],
    tags: [
      "Africa",
      "Nigeria",
      "P2E",
      "GameFi",
      "Financial Inclusion",
      "Web3 Africa",
    ],
    notes:
      "Top KOL for African market. TikTok presence is growing fast. Audience is very active and conversion-oriented.",
    joinedDate: "2023-12-08",
    lastActivity: "2026-05-25",
    verified: true,
    totalPostsLastMonth: 68,
    totalImpressionsLastMonth: 870000,
    audienceDemographics: [
      { ageGroup: "18–24", percentage: 48 },
      { ageGroup: "25–34", percentage: 36 },
      { ageGroup: "35–44", percentage: 12 },
      { ageGroup: "45+", percentage: 4 },
    ],
    topAudienceCountries: [
      { country: "Nigeria", percentage: 58 },
      { country: "Ghana", percentage: 9 },
      { country: "Kenya", percentage: 7 },
      { country: "South Africa", percentage: 6 },
      { country: "UK", percentage: 5 },
    ],
  },
  {
    id: "10",
    name: "cryptokupumps",
    username: "cryptokupumps",
    avatar: "",
    bio: "West Asia crypto analyst specializing in low-cap gem discovery and presale opportunities. Known for early calls on 10x–100x projects. Runs a private investment club.",
    niche: "Social Media Influencer",
    region: "West Asia",
    country: "Bahrain",
    languages: ["English", "Arabic"],
    platforms: ["X", "Telegram"],
    primaryPlatform: "X",
    totalFollowers: 14800,
    totalReach: 42000,
    avgEngagementRate: 6.9,
    risk: "Low",
    riskReason:
      "Historically promoted legitimate projects; no rug history detected.",
    contacts: [
      { type: "Telegram", value: "@cryptokupumps" },
      { type: "Twitter DM", value: "@cryptokupumps" },
    ],
    platformStats: [
      {
        platform: "X",
        handle: "@cryptokupumps",
        followers: 14800,
        avgViews: 10200,
        engagementRate: 6.9,
        postsPerMonth: 70,
        profileUrl: "https://x.com/cryptokupumps",
      },
      {
        platform: "Telegram",
        handle: "Crypto Ku Calls",
        followers: 11500,
        avgViews: 9400,
        engagementRate: 7.2,
        postsPerMonth: 85,
        profileUrl: "https://t.me/cryptokucalls",
      },
    ],
    rateCard: [
      {
        platform: "X",
        contentType: "Gem Call Post",
        price: 550,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "Presale Promo",
        price: 600,
        currency: "USD",
      },
      {
        platform: "Telegram",
        contentType: "Private Group Feature",
        price: 1500,
        currency: "USD",
      },
    ],
    campaigns: [
      {
        campaignName: "Presale Listing Push",
        client: "DexTools",
        date: "2025-06-12",
        budget: 2800,
        reach: 65000,
        status: "Completed",
      },
      {
        campaignName: "Low Cap Gems Series",
        client: "CoinMarketCap",
        date: "2025-12-20",
        budget: 3500,
        reach: 88000,
        status: "Completed",
      },
      {
        campaignName: "Arab Market IDO",
        client: "DAO Maker",
        date: "2026-04-01",
        budget: 4200,
        reach: 102000,
        status: "Active",
      },
    ],
    tags: ["Low Cap", "Gems", "Presale", "Arabic Market", "IDO", "Early Calls"],
    notes:
      "High engagement rate. Private Telegram group has 2,000+ paid members. Strong MENA region influence. Good for IDO/presale campaigns.",
    joinedDate: "2024-02-28",
    lastActivity: "2026-05-26",
    verified: false,
    totalPostsLastMonth: 72,
    totalImpressionsLastMonth: 390000,
    audienceDemographics: [
      { ageGroup: "18–24", percentage: 38 },
      { ageGroup: "25–34", percentage: 43 },
      { ageGroup: "35–44", percentage: 14 },
      { ageGroup: "45+", percentage: 5 },
    ],
    topAudienceCountries: [
      { country: "Bahrain", percentage: 22 },
      { country: "UAE", percentage: 20 },
      { country: "Saudi Arabia", percentage: 16 },
      { country: "Kuwait", percentage: 9 },
      { country: "Egypt", percentage: 8 },
    ],
  },
];

export const KOL_NICHES: KOLNiche[] = [
  "Content Creator",
  "Social Media Influencer",
  "Crypto/DeFi",
  "Finance",
  "Education",
  "Community",
  "Crypto/Web3",
  "Gaming",
  "Technology",
  "NFT/Art",
];

export const KOL_PLATFORMS: KOLPlatform[] = [
  "X",
  "YouTube",
  "Instagram",
  "TikTok",
  "Telegram",
  "Discord",
];

export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}
