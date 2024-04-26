import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { followUser, unfollowUser } from "@/firebase/logic.follows";

export async function POST(
  req: Request,
  { params, body }: { params: { target_id: string }; body: { action: string } }
) {
  try {
    auth().protect();
    const user = await currentUser();

    const userId = user?.id ?? "";

    const userIdToFollow = params.target_id;

    const { action } = body;
    if (!action) {
      return NextResponse.json(
        { error: "Action (follow/unfollow) is missing" },
        { status: 400 }
      );
    }

    if (action === "follow") {
      await followUser(userId, userIdToFollow);
      return NextResponse.json({ message: "User followed successfully" });
    } else if (action === "unfollow") {
      await unfollowUser(userId, userIdToFollow);
      return NextResponse.json({ message: "User unfollowed successfully" });
    } else {
      return NextResponse.json(
        { error: "Invalid action. It must be 'follow' or 'unfollow'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error following/unfollowing user: ", error);
    return NextResponse.json(
      { error: "An error occurred while following/unfollowing user" },
      { status: 500 }
    );
  }
}
