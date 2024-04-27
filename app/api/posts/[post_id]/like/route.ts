import { toggleLike } from "@/firebase/logic.posts";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PUT = async (
  request: Request,
  { params }: { params: { post_id: string } }
) => {
  auth().protect();
  const user = await currentUser();

  const postId = params.post_id;
  const { isLiked } = await request.json();

  try {
    await toggleLike(postId, user?.id ?? "", isLiked);

    const message = isLiked ? "You liked the post " : "You unliked the post";

    return NextResponse.json({ message, isLiked });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while toggling the like" },
      { status: 500 }
    );
  }
};
