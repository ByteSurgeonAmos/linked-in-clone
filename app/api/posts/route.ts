import { createPost, getPosts, Post } from "@/firebase/logic.posts";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    auth().protect();
    const user = await currentUser();
    const userId = user?.id ?? "";

    const formData = await request.formData();
    const postInput = formData.get("postInput")?.toString() || "";
    const imageFile = formData.get("imageFile") as File | undefined;

    const post = await createPost(userId, postInput, imageFile);
    console.log(imageFile);
    if (post !== null) {
      return NextResponse.json(
        {
          message: "Post created successfully",
          postId: post,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "An error occurred while creating the post" },
        { status: 501 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
export async function GET(request: Request) {
  try {
    const posts = await getPosts();
    const user = await currentUser();

    const postsWithLikeStatus = posts.map((post: Post) => ({
      ...post,
      isLiked: user && post.likes.includes(user.id),
    }));

    return NextResponse.json({ posts: postsWithLikeStatus });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching posts" },
      { status: 500 }
    );
  }
}
