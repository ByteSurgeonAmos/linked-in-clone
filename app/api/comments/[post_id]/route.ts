import { NextApiRequest } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addComment } from "@/firebase/logic.posts";
import { deleteComment } from "@/firebase/logic.posts";

export async function POST(
  req: NextApiRequest,
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
    const { text } = req.body;

    if (!post_id || !text) {
      return NextResponse.json(
        { error: "Post ID or comment text is missing" },
        { status: 400 }
      );
    }

    const commentId = await addComment(post_id, user.id, text);
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
  req: NextApiRequest,
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

    // Extract post ID and comment ID from request body
    const { post_id } = params;
    // Extract post ID and comment ID from request body
    const { comment_id } = req.body;

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
