import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  DocumentSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase.config";
import { v4 as uuidv4 } from "uuid";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export interface Post {
  id: string;
  userId: string;
  text: string;
  imageUrl?: string;
  createdAt: Date;
  likes: string[]; // Array of user IDs who liked the post
  comments: Comment[];
}

interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
}

export const createPost = async (
  userId: string,
  text: string,
  imageFile?: File
): Promise<any | null> => {
  try {
    let imageUrl: string | null = null;
    if (imageFile) {
      console.log(imageFile);

      const storage = getStorage();
      const uniqueFilename = uuidv4();
      const storageRef = ref(storage, `images/${uniqueFilename}`);
      try {
        const snapshot = await uploadBytes(storageRef, imageFile);

        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.log(error);
      }
    }
    console.log("Hello world1");

    const docRef = await addDoc(collection(db, "posts"), {
      userId,
      text,
      imageUrl,
      createdAt: new Date(),
      likes: [],
      comments: [],
    });
    console.log("Hello world2");

    console.log(docRef);

    return docRef;
  } catch (error) {
    console.error("Error creating post: ", error);
    return null;
  }
};

export const toggleLike = async (
  postId: string,
  userId: string,
  isLiked: boolean
): Promise<void> => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postRef);
    if (!postSnapshot.exists()) {
      console.error("Post does not exist");
      return;
    }

    let likes = postSnapshot.data().likes || [];
    if (isLiked) {
      likes.push(userId);
    } else {
      likes = likes.filter((id: string) => id !== userId);
    }

    await updateDoc(postRef, { likes });
  } catch (error) {
    console.error("Error toggling like: ", error);
  }
};

export const addComment = async (
  postId: string,
  userId: string,
  text: string
): Promise<string | null> => {
  try {
    const commentRef = await addDoc(
      collection(db, `posts/${postId}/comments`),
      {
        userId,
        text,
        createdAt: new Date(),
      }
    );
    return commentRef.id;
  } catch (error) {
    console.error("Error adding comment: ", error);
    return null;
  }
};
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw error;
  }
};

export const deleteComment = async (
  postId: string,
  commentId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, `posts/${postId}/comments`, commentId));
  } catch (error) {
    console.error("Error deleting comment: ", error);
  }
};

export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    const docRef = doc(db, "posts", postId);
    const docSnapshot: DocumentSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists) {
      const postData = docSnapshot.data();

      return {
        id: docSnapshot.id,
        userId: postData?.userId,
        text: postData?.text,
        imageUrl: postData?.imageUrl,
        createdAt: postData?.createdAt,
        likes: postData?.likes,
        comments: postData?.comments,
      };
    } else {
      console.error("Post does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching post: ", error);
    return null;
  }
};

export const getPosts = async (): Promise<Post[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      posts.push({
        id: doc.id,
        userId: postData.userId,
        text: postData.text,
        imageUrl: postData.imageUrl,
        createdAt: postData.createdAt,
        likes: postData.likes,
        comments: postData.comments,
      });
    });
    return posts;
  } catch (error) {
    console.error("Error getting posts: ", error);
    return [];
  }
};
