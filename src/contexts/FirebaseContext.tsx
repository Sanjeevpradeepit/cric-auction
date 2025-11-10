"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, query, where, getDocs, runTransaction, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { Bid, Owner, Player, Team } from '@/type/types';

// Context shape
interface FirebaseContextType {
  user: User | null;
  loggedInAdmin: boolean;
  loggedInTeamId: string | null;
  loading: boolean;
  teams: Team[];
  players: Player[];
  bids: Bid[];
  owners: Owner[];

  addOwner: (ownerData: Omit<Owner, 'id'>) => Promise<void>;
  updateOwner: (ownerId: string, updatedData: Partial<Owner>) => Promise<void>;
  deleteOwner: (ownerId: string) => Promise<void>;
  teamLogin: (email: string, password: string) => Promise<boolean>;
  adminLogin: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;

  addTeam: (teamData: Omit<Team, 'id' | 'players' | 'teamManage'>, logoFile?: File) => Promise<void>;
  updateTeam: (teamId: string, updatedData: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  addPlayer: (playerData: Omit<Player, 'id'>, profileImage?: File, actionImage?: File) => Promise<void>;
  updatePlayer: (playerId: string, updatedData: Partial<Player>) => Promise<void>;
  deletePlayer: (playerId: string) => Promise<void>;
  addBid: (bidData: Omit<Bid, 'id' | 'timestamp'>) => Promise<void>;

  isAuctionActive: boolean;
  unsoldPlayers: Player[];
  soldPlayerIds: string[];
  finalUnsoldPlayers: Player[];
  currentPlayerIndex: number;
  currentBid: Bid | null;
  playerBidHistory: Bid[];
  timer: number;
  winningTeam: Team | null;
  biddingTurnTeamId: string | null;
  auctionTimerDuration: number;
  isTimerEnabled: boolean;

  startAuctionForPlayer: () => void;
  timerTick: () => void;
  setBiddingTurn: (teamId: string) => void;
  setRandomBiddingTurn: () => void;
  placeBid: (teamId: string, increment: number) => { success: boolean, message: string };
  passTurn: (teamId: string) => void;
  setAuctionTimerDuration: (duration: number) => void;
  setTimerEnabled: (enabled: boolean) => void;
  closeBidding: () => void;
  reAuctionPlayers: (playerIds: string[]) => void;
  addPlayersToAuction: (playerIds: string[]) => void;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // States
  const [user, setUser] = useState<User | null>(null);
  const [loggedInAdmin, setLoggedInAdmin] = useState(false);
  const [loggedInTeamId, setLoggedInTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isAuctionActive, setIsAuctionActive] = useState(false);
  const [unsoldPlayers, setUnsoldPlayers] = useState<Player[]>([]);
  const [finalUnsoldPlayers, setFinalUnsoldPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentBid, setCurrentBid] = useState<Bid | null>(null);
  const [timer, setTimer] = useState(60);
  const [auctionTimerDuration, setAuctionTimerDuration] = useState(60);
  const [isTimerEnabled, setTimerEnabledState] = useState(true);
  const [winningTeam, setWinningTeam] = useState<Team | null>(null);
  const [biddingTurnTeamId, setBiddingTurnTeamId] = useState<string | null>(null);
  const [passedTeams, setPassedTeams] = useState<string[]>([]);

  const soldPlayerIds = useMemo(() => teams.flatMap(t => t.players.map(p => p.id)), [teams]);
  const currentPlayer = useMemo(() => unsoldPlayers[currentPlayerIndex], [unsoldPlayers, currentPlayerIndex]);
  const playerBidHistory = useMemo(() => {
    if (!currentPlayer) return [];
    return bids.filter(b => b.playerId === currentPlayer.id).sort((a, b) => b.amount - a.amount);
  }, [bids, currentPlayer]);

  // Owners Listener
  useEffect(() => {
    const unsubscribeOwners = onSnapshot(collection(db, 'owners'), snapshot => {
      const ownersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Owner));
      setOwners(ownersData);
    });
    return () => unsubscribeOwners();
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      if (currentUser) {
        if (currentUser.email === 'superadmin@auction.com') {
          setLoggedInAdmin(true);
          setLoggedInTeamId(null);
        } else {
          const teamsQuery = query(collection(db, "teams"), where("email", "==", currentUser.email));
          const querySnapshot = await getDocs(teamsQuery);
          if (!querySnapshot.empty) {
            const teamDoc = querySnapshot.docs[0];
            setLoggedInTeamId(teamDoc.id);
          }
          setLoggedInAdmin(false);
        }
      } else {
        setLoggedInAdmin(false);
        setLoggedInTeamId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore real-time listeners
  useEffect(() => {
    setLoading(true);
    const unsubscribeTeams = onSnapshot(collection(db, 'teams'), (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
      setTeams(teamsData);
    });
    const unsubscribePlayers = onSnapshot(collection(db, 'players'), (snapshot) => {
      const playersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
      setPlayers(playersData);
    });
    const unsubscribeBids = onSnapshot(collection(db, 'bids'), (snapshot) => {
      const bidsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bid));
      setBids(bidsData.sort((a, b) => b.timestamp - a.timestamp));
    });
    setLoading(false);
    return () => {
      unsubscribeTeams();
      unsubscribePlayers();
      unsubscribeBids();
    };
  }, []);

  // --- Actions ---
  const uploadFile = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };
  const teamLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Team login failed:", error);
      return false;
    }
  };
  const adminLogin = async (password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, 'superadmin@auction.com', password);
      return true;
    } catch (error) {
      console.error("Admin login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const addTeam = async (teamData: Omit<Team, 'id' | 'players' | 'teamManage'>, logoFile?: File) => {
    try {
      let logoURL = teamData.logoURL || `https://picsum.photos/seed/${teamData.name}/100`;
      const docRef = await addDoc(collection(db, 'teams'), { ...teamData, players: [], teamManage: [] });
      if (logoFile) {
        logoURL = await uploadFile(logoFile, `team-logos/${docRef.id}/${logoFile.name}`);
        await updateDoc(docRef, { logoURL });
      }
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };
  const updateTeam = async (teamId: string, updatedData: Partial<Team>) => {
    const teamDoc = doc(db, 'teams', teamId);
    await updateDoc(teamDoc, updatedData);
  };
  const deleteTeam = async (teamId: string) => {
    await deleteDoc(doc(db, 'teams', teamId));
  };

  const addPlayer = async (playerData: Omit<Player, 'id'>, profileImage?: File, actionImage?: File) => {
    try {
      let profileImageURL = playerData.profileImageURL || `https://picsum.photos/seed/${playerData.name}/200`;
      let actionImageURL = playerData.actionImageURL || `https://picsum.photos/seed/${playerData.name}Action/800/600`;
      const docRef = await addDoc(collection(db, 'players'), playerData);
      if (profileImage) profileImageURL = await uploadFile(profileImage, `player-images/${docRef.id}/profile.jpg`);
      if (actionImage) actionImageURL = await uploadFile(actionImage, `player-images/${docRef.id}/action.jpg`);
      await updateDoc(docRef, { profileImageURL, actionImageURL });
    } catch (e) {
      console.error("Error adding player: ", e);
    }
  };
  const updatePlayer = async (playerId: string, updatedData: Partial<Player>) => {
    await updateDoc(doc(db, 'players', playerId), updatedData);
  };
  const deletePlayer = async (playerId: string) => {
    await deleteDoc(doc(db, 'players', playerId));
  };
  const addBid = async (bidData: Omit<Bid, 'id' | 'timestamp'>) => {
    await addDoc(collection(db, 'bids'), { ...bidData, timestamp: Timestamp.now().toMillis() });
  };

  // --- Owner CRUD ---
  const addOwner = async (ownerData: Omit<Owner, 'id'>) => {
    await addDoc(collection(db, 'owners'), ownerData);
  };
  const updateOwner = async (ownerId: string, updatedData: Partial<Owner>) => {
    const ownerDoc = doc(db, 'owners', ownerId);
    await updateDoc(ownerDoc, updatedData);
  };
  const deleteOwner = async (ownerId: string) => {
    await deleteDoc(doc(db, 'owners', ownerId));
  };

  // --- Auction Logic ---
  const closeBidding = useCallback(async () => {
    setIsAuctionActive(false);
    setBiddingTurnTeamId(null);
    if (currentBid && currentPlayer) {
      const winningTeamData = teams.find(t => t.id === currentBid.teamId);
      if (winningTeamData) {
        setWinningTeam(winningTeamData);
        const teamDocRef = doc(db, 'teams', winningTeamData.id);
        await runTransaction(db, async (transaction) => {
          const teamDoc = await transaction.get(teamDocRef);
          if (!teamDoc.exists()) throw "Team document does not exist!";
          const newPlayers = [...teamDoc.data().players, currentPlayer];
          const newCoins = teamDoc.data().coins - currentBid.amount;
          transaction.update(teamDocRef, { players: newPlayers, coins: newCoins });
        });
      }
    } else if (currentPlayer) {
      setFinalUnsoldPlayers(prev => [...prev, currentPlayer]);
    }
    setTimeout(() => {
      if (currentPlayerIndex + 1 >= unsoldPlayers.length) {
        setUnsoldPlayers([]);
        setCurrentPlayerIndex(0);
      } else {
        setCurrentPlayerIndex(prev => prev + 1);
      }
      setWinningTeam(null);
      setCurrentBid(null);
    }, 3000);
  }, [currentBid, currentPlayer, teams, unsoldPlayers, currentPlayerIndex]);

  const nextTurn = useCallback(() => {
    const activeBidders = teams.filter(t => !passedTeams.includes(t.id));
    if (activeBidders.length <= 1) {
      closeBidding();
      return;
    }
    const currentTurnIndex = activeBidders.findIndex(t => t.id === biddingTurnTeamId);
    const nextTurnIndex = (currentTurnIndex + 1) % activeBidders.length;
    setBiddingTurnTeamId(activeBidders[nextTurnIndex].id);
    setTimer(auctionTimerDuration);
  }, [teams, passedTeams, biddingTurnTeamId, auctionTimerDuration, closeBidding]);

  const passTurn = useCallback((teamId: string) => {
    if (biddingTurnTeamId !== teamId) return;
    setPassedTeams(prev => [...prev, teamId]);
  }, [biddingTurnTeamId]);

  const timerTick = useCallback(() => {
    if (isAuctionActive && isTimerEnabled) {
      setTimer(t => {
        if (t > 1) return t - 1;
        if (biddingTurnTeamId) {
          passTurn(biddingTurnTeamId);
        } else {
          closeBidding();
        }
        return 0;
      });
    }
  }, [isAuctionActive, isTimerEnabled, biddingTurnTeamId, closeBidding, passTurn]);

  useEffect(() => {
    if (isAuctionActive && passedTeams.length > 0) {
      nextTurn();
    }
  }, [passedTeams, isAuctionActive, nextTurn]);

  // Other auction actions
  const startAuctionForPlayer = () => {
    if (!currentPlayer) return;
    setIsAuctionActive(true);
    setCurrentBid(null);
    setWinningTeam(null);
    setTimer(auctionTimerDuration);
    setBiddingTurnTeamId(null);
    setPassedTeams([]);
  };

  const setBiddingTurn = (teamId: string) => {
    setBiddingTurnTeamId(teamId);
    setTimer(auctionTimerDuration);
  };

  const setRandomBiddingTurn = () => {
    const randomTeamIndex = Math.floor(Math.random() * teams.length);
    setBiddingTurn(teams[randomTeamIndex].id);
  };

  const addPlayersToAuction = (playerIds: string[]) => {
    const playersToAdd = players.filter(p => playerIds.includes(p.id));
    setUnsoldPlayers(prev => [...prev, ...playersToAdd]);
  };

  const reAuctionPlayers = (playerIds: string[]) => {
    const playersToReAuction = finalUnsoldPlayers.filter(p => playerIds.includes(p.id));
    setUnsoldPlayers(prev => [...prev, ...playersToReAuction]);
    setFinalUnsoldPlayers(prev => prev.filter(p => !playerIds.includes(p.id)));
  };

  const placeBid = (teamId: string, increment: number) => {
    if (!isAuctionActive || !currentPlayer || biddingTurnTeamId !== teamId) {
      return { success: false, message: 'Not your turn or auction is inactive.' };
    }
    const team = teams.find(t => t.id === teamId);
    if (!team) return { success: false, message: 'Team not found.' };

    const lastBidAmount = currentBid?.amount || 0;
    const baseAmount = lastBidAmount > 0 ? lastBidAmount : currentPlayer.baseCoins;
    const newAmount = increment > 0 ? baseAmount + increment : currentPlayer.baseCoins;

    if (lastBidAmount === 0 && increment === 0) {
      // First bid at base price
    } else if (newAmount <= lastBidAmount) {
      return { success: false, message: 'Bid must be higher than the current bid.' };
    }

    if (team.coins < newAmount) {
      return { success: false, message: 'Not enough coins.' };
    }

    const newBid: Omit<Bid, 'id' | 'timestamp'> = {
      teamId,
      playerId: currentPlayer.id,
      amount: newAmount,
    };
    addBid(newBid);
    setCurrentBid({ ...newBid, id: 'temp', timestamp: Date.now() });

    nextTurn();
    return { success: true, message: 'Bid placed.' };
  };

  // const handleSetAuctionTimerDuration = (duration: number) => {
  //   setAuctionTimerDuration(duration);
  // };
  const setTimerEnabled = (enabled: boolean) => {
    setTimerEnabledState(enabled);
  };

  const value: FirebaseContextType = {
    user,
    loggedInAdmin,
    loggedInTeamId,
    loading,
    teams,
    players,
    bids,
    owners,
    addOwner,
    updateOwner,
    deleteOwner,
    teamLogin,
    adminLogin,
    logout,
    addTeam,
    updateTeam,
    deleteTeam,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addBid,
    isAuctionActive,
    unsoldPlayers,
    soldPlayerIds,
    finalUnsoldPlayers,
    currentPlayerIndex,
    currentBid,
    playerBidHistory,
    timer,
    winningTeam,
    biddingTurnTeamId,
    auctionTimerDuration,
    isTimerEnabled,
    startAuctionForPlayer,
    timerTick,
    setBiddingTurn,
    setRandomBiddingTurn,
    placeBid,
    passTurn,
    setAuctionTimerDuration,
    setTimerEnabled,
    closeBidding,
    reAuctionPlayers,
    addPlayersToAuction,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
