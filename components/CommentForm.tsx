"use client";

import { useUser } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { toast } from "sonner";

const CommentForm = ({ post }: { post: string }) => {
  const { user } = useUser();
  const [text, setText] = useState("");

  const ref = useRef<HTMLFormElement>(null);
  const handleCommentAction = async (formData: FormData) => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    try {
      const response = await fetch(`/api/comments/${post}`, {
        method: "POST",
        body: JSON.stringify(text),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      ref.current?.reset();
    } catch (error) {
      console.log(error);
    }
  };
  const newLocal = "outline-none flex-1 text-sm bg-transparent";
  return (
    <form
      ref={ref}
      action={(formData) => {
        const promise = handleCommentAction(formData);
        toast.promise(promise, {
          loading: "Posting comment...",
          success: "Comment posted successfully",
          error: "Error posting comment",
        });
      }}
      className="flex items-center space-x-1"
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 bg-white rounded-full px-3 py-2">
        <input
          type="text"
          name="commentInput"
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className={newLocal}
        />
        <Button type="submit">Comment</Button>
      </div>
    </form>
  );
};

export default CommentForm;
