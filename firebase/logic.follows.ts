import { db } from "./firebase.config";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export const followUser = async (
  currentUserId: string,
  targetUserId: string
): Promise<void> => {
  try {
    const currentFollowingRef = doc(db, "users", currentUserId);
    const targetFollowersRef = doc(db, "users", targetUserId);

    const currentFollowingSnapshot = await getDoc(currentFollowingRef);
    const targetFollowersSnapshot = await getDoc(targetFollowersRef);

    if (currentFollowingSnapshot.exists() && targetFollowersSnapshot.exists()) {
      await updateDoc(currentFollowingRef, {
        following: arrayUnion(targetUserId),
      });
      await updateDoc(targetFollowersRef, {
        followers: arrayUnion(currentUserId),
      });
    } else {
      console.error("One or both users do not exist");
    }
  } catch (error) {
    console.error("Error following user: ", error);
    throw error;
  }
};

export const unfollowUser = async (
  currentUserId: string,
  targetUserId: string
): Promise<void> => {
  try {
    const currentFollowingRef = doc(db, "users", currentUserId);
    const targetFollowersRef = doc(db, "users", targetUserId);

    const currentFollowingSnapshot = await getDoc(currentFollowingRef);
    const targetFollowersSnapshot = await getDoc(targetFollowersRef);

    if (currentFollowingSnapshot.exists() && targetFollowersSnapshot.exists()) {
      await updateDoc(currentFollowingRef, {
        following: arrayRemove(targetUserId),
      });
      await updateDoc(targetFollowersRef, {
        followers: arrayRemove(currentUserId),
      });
    } else {
      console.error("One or both users do not exist");
    }
  } catch (error) {
    console.error("Error unfollowing user: ", error);
    throw error;
  }
};
export const getFollowers = async (userId: string): Promise<string[]> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const followers = userDocSnapshot.data()?.followers || [];
      return followers;
    } else {
      console.error("User does not exist");
      return [];
    }
  } catch (error) {
    console.error("Error fetching followers: ", error);
    throw error;
  }
};

export const getFollowing = async (userId: string): Promise<string[]> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const following = userDocSnapshot.data()?.following || [];
      return following;
    } else {
      console.error("User does not exist");
      return [];
    }
  } catch (error) {
    console.error("Error fetching following: ", error);
    throw error;
  }
};
