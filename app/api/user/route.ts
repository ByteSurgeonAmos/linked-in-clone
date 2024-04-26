import { NextApiRequest, NextApiResponse } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getFollowers, getFollowing } from "@/firebase/logic.follows";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    auth().protect();
    const user = await currentUser();

    const userId = user?.id;
    if (userId) {
      const followers = await getFollowers(userId);
      const following = await getFollowing(userId);
      return NextResponse.json({ followers, following });
    }
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("Error fetching data: ", error);
    return NextResponse.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}
