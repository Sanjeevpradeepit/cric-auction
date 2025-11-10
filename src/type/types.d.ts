//  interface Player {
//   id: string;
//   name: string;
//   nationality: string;
//   position: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';
//   baseCoins: number;
//   stats: {
//     battingAverage: number;
//     strikeRate: number;
//     wickets: number;
//     economyRate: number;
//   };
//   profileImageURL: string;
//   actionImageURL: string;
// }

//  interface Owner {
//   id: string;
//   name: string;
//   role: string;
// }

//  interface Team {
//   id: string;
//   name: string;
//   logoURL: string;
//   coins: number;
//   players: Player[];
//   owners: Owner[];
//   email: string;
//   password?: string | undefined; // In a real app, this would be handled securely
// }



//  interface Bid {
//   id:string;
//   teamId: string;
//   playerId: string;
//   amount: number;
//   timestamp: number;
// }

//  type Page = 'home' | 'live-auction' | 'create-auction' | 'teams' | 'players' | 'results' | 'help' | 'login' | 'admin-login' | 'admin-dashboard' | 'unsold-players' | 'player-details' | 'sold-players' | 'auction-selection' | 'add-player' | 'add-team';