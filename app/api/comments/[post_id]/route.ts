import { NextApiRequest } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addComment, getCommentsByPostId } from "@/firebase/logic.posts";
import { deleteComment } from "@/firebase/logic.posts";

export async function POST(
  req: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    auth().protect();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    const userImageURL = user.imageUrl ?? "";

    const { post_id } = params;
    const text = await req.json();
    console.log(text);

    const userName = user?.fullName ?? "";

    if (!post_id || !text) {
      return NextResponse.json(
        { error: "Post ID or comment text is missing" },
        { status: 400 }
      );
    }

    const commentId = await addComment(
      post_id,
      user.id,
      userImageURL,
      text,
      userName
    );
    if (commentId) {
      return NextResponse.json({
        message: "Comment added successfully",
        commentId,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to add comment to post" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error adding comment to post: ", error);
    return NextResponse.json(
      { error: "An error occurred while adding comment to post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    auth().protect();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { post_id } = params;
    const { comment_id } = await req.json();

    if (!post_id || !comment_id) {
      return NextResponse.json(
        { error: "Post ID or comment ID is missing" },
        { status: 400 }
      );
    }

    await deleteComment(post_id, comment_id);

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment: ", error);
    return NextResponse.json(
      { error: "An error occurred while deleting comment" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    const { post_id } = params;

    if (!post_id) {
      return NextResponse.json(
        { error: "Post ID is missing" },
        { status: 400 }
      );
    }

    const comments = await getCommentsByPostId(post_id);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments: ", error);
    return NextResponse.json(
      { error: "An error occurred while fetching comments" },
      { status: 500 }
    );
  }
}
