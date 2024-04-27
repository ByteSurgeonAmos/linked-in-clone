"use client";

import { Comment, Post } from "@/firebase/logic.posts";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CommentOpen = ({ post }: { post: Post }) => {
  const { user } = useUser();
  const [Comments, setComments] = useState([]);
  const isAuthor = user?.id === post.userId;
  const getComments = async () => {
    try {
      const comments = await fetch(`/api/comments/${post.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await comments.json();
      setComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteCommentAction = async (commentId: string) => {
    try {
      const resp = await fetch(`/api/comments/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment_id: commentId,
        }),
      });
      if (resp.ok) {
        getComments();
        console.log("Post deleted successfully");
      } else {
        console.error("Error deleting post:", resp.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className=" space-y-2 mt-3 w-full border rounded-md bg-gray-100">
      {Comments?.map((comment: Comment) => (
        <div key={comment.id} className="flex space-x-1 w-full">
          <Avatar>
            <AvatarImage src={comment.userImageURL} />
            <AvatarFallback>
              {comment.userName.charAt(0)}
              {comment.userName.split(" ")[0]}
            </AvatarFallback>
          </Avatar>

          <div className="bg-gray-100 px-4 py-2 rounded-md w-full ">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold w-full flex  ">
                  {comment.userName}
                  {isAuthor && (
                    <div className="">
                      <Badge className=" ml-2" variant="secondary">
                        Author
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400 flex justify-between w-full">
                  @{comment.userName.split(" ")[0]}
                  {comment.userName}-{comment.userId.toString().slice(-4)}
                  <Badge
                    className="ml-10 w-min cursor-pointer"
                    variant="destructive"
                    onClick={() => {
                      const promise = deleteCommentAction(comment.id);
                      toast.promise(promise, {
                        loading: "Deleting comment...",
                        success: "Coment deleted successfully",
                        error: "Failed to delete comment",
                      });
                    }}
                  >
                    Delete
                  </Badge>
                </div>
                <p className="text-wrap">{comment.text}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentOpen;
