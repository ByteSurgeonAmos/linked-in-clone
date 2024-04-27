import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  DocumentSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase.config";
import { v4 as uuidv4 } from "uuid";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { deleteObject } from "firebase/storage";

export interface Post {
  id: string;
  userId: string;
  text: string;
  userName: string;
  imageUrl?: string;
  userImageURL: string;
  createdAt: Date;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  userName: string;
  userImageURL: string;
  createdAt: Date;
}

export const createPost = async (
  userId: string,
  userName: string,
  userImageURL: string,
  text: string,
  imageFile?: File | undefined
): Promise<string | null> => {
  try {
    let imageUrl: string | null = null;
    if (imageFile) {
      const storage = getStorage();
      const uniqueFilename = uuidv4();
      const storageRef = ref(storage, `images/${uniqueFilename}`);

      const snapshot = await uploadBytes(storageRef, imageFile);

      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const newPostRef = doc(collection(db, "posts"));

    await setDoc(newPostRef, {
      userId,
      text,
      imageUrl,
      userImageURL,
      userName,
      createdAt: new Date(),
      likes: [],
      comments: [],
    });

    return newPostRef.id;
  } catch (error) {
    console.error("Error creating post:", error);
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
  userImageURL: string,
  text: string,
  userName: string
): Promise<string | null> => {
  try {
    const commentRef = await addDoc(
      collection(db, `posts/${postId}/comments`),
      {
        userId,
        userImageURL,
        text,
        userName,
        createdAt: new Date(),
      }
    );
    return commentRef.id;
  } catch (error) {
    console.error("Error adding comment: ", error);
    return null;
  }
};

export const getCommentsByPostId = async (
  postId: string
): Promise<Comment[]> => {
  try {
    const commentsSnapshot = await getDocs(
      collection(db, `posts/${postId}/comments`)
    );
    const comments: Comment[] = [];
    commentsSnapshot.forEach((doc) => {
      const commentData = doc.data();
      if (commentData) {
        comments.push({
          id: doc.id,
          userId: commentData.userId,
          text: commentData.text,
          userImageURL: commentData.userImageURL,
          userName: commentData.userName,
          createdAt: commentData.createdAt.toDate(),
        });
      }
    });
    return comments;
  } catch (error) {
    console.error("Error getting comments: ", error);
    return [];
  }
};

export const deletePost = async (
  postId: string,
  imageUrl?: string
): Promise<{ message: string } | void> => {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);

    console.log("Post deleted successfully");

    if (imageUrl) {
      const storage = getStorage();
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      console.log("Image file deleted successfully");
    }
    return { message: "Post deleted succesfully" };
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

    if (docSnapshot.exists()) {
      const postData = docSnapshot.data();

      return {
        id: docSnapshot.id,
        userId: postData?.userId,
        text: postData?.text,
        imageUrl: postData?.imageUrl,
        userImageURL: postData?.userImageURL,
        userName: postData?.userName,
        createdAt: postData?.createdAt.toDate(),
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
      if (postData) {
        posts.push({
          id: doc.id,
          userId: postData.userId,
          text: postData.text,
          imageUrl: postData.imageUrl,
          userImageURL: postData.userImageURL,
          userName: postData.userName,
          createdAt: postData.createdAt.toDate(),
          likes: postData.likes || [],
          comments: postData.comments,
        });
      }
    });
    return posts;
  } catch (error) {
    console.error("Error getting posts: ", error);
    return [];
  }
};
