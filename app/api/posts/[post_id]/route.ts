import { deletePost, getPostById } from "@/firebase/logic.posts";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: { post_id: string } }
) => {
  try {
    const postId = params.post_id;
    const post = await getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const user = await currentUser();
    const isLiked = user && post.likes.includes(user.id);
    return NextResponse.json({ ...post, isLiked });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occured while fetching the post" },
      { status: 500 }
    );
  }
};

export async function DELETE(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  auth().protect();
  const user = await currentUser();

  const postId = params.post_id;

  try {
    const post = await getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.userId !== user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await deletePost(postId);
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occured while deleting the post" },
      { status: 500 }
    );
  }
}
