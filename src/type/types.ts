export interface Player {
  id: string;
  name: string;
  nationality: string;
  position: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';
  dob:string;
  age: number; // Added
  gender?: string;
  birthPlace: string; // Added
  nickname?: string; // Added
  battingStyle: string; // Added
  bowlingStyle?: string; // Added
  debutDate?: string; // Added
  baseCoins: number;
  stats: {
    matches: number; // Added
    innsN0: number;
    inns: number;
    runs: number;
    ballsFaced: number; // Added
    highScore: number; // Added
    notOuts: number; // Added
    battingAverage: number;
    strikeRate: number;
    fours: number; // Added
    sixes: number; // Added
    fifties: number; // Added
    hundreds: number; // Added
    doubleHundreds?: number; // Added
    wickets: number;
    ballsBowled: number; // Added
    runsConceded: number; // Added
    bowlingAverage?: number; // Added
    economyRate: number;
    fiveWicketHauls?: number; // Added
    tenWicketHauls?: number; // Added
    bestBowlingInInnings?: string; // Added
    bestBowlingInMatch?: string; // Added
    ICCBattingRanking?: number; // Added
    ICCBowlingRanking?: number; // Added
    ICCAllRounderRanking?: number; // Added

    // Wicketkeeper specific:
  catches?: number;         // key wicketkeeping stat
  stumpings?: number;       // key wicketkeeping stat
  byesConceded?: number;   // optional
  dismissals?: number;     // catches + stumpings, can be derived
  keepingEfficiency?: number; // optional %, dismissals per match or innings

  };
  profileImageURL: string;
  actionImageURL: string;
}


export interface Owner {
  id: string;
  name: string;
  role: string;
}

export interface Team {
  id: string;
  name: string;
  logoURL: string;
  coins: number;
  players: Player[];
  owners: Owner[];
  email: string;
  password?: string; // In a real app, this would be handled securely
}



export interface Bid {
  id:string;
  teamId: string;
  playerId: string;
  amount: number;
  timestamp: number;
}

export type Page = 'home' | 'live-auction' | 'create-auction' | 'teams' | 'players' | 'results' | 'help' | 'login' | 'admin-login' | 'admin-dashboard' | 'unsold-players' | 'player-details' | 'sold-players' | 'auction-selection' | 'add-player' | 'add-team';