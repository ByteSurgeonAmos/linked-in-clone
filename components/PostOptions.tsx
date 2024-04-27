"use client";
import { Post } from "@/firebase/logic.posts";
import { SignedIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CommentOpen from "./CommentOpen";
import CommentForm from "./CommentForm";
import { toast } from "sonner";

const PostOptions = ({ post }: { post: Post }) => {
  const [isCommentOpen, setCommentOpen] = useState(false);
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [Comments, setComments] = useState([]);
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
  useEffect(() => {
    getComments();
    if (user?.id && post.likes?.includes(user.id)) {
      setLiked(true);
    }
  }, [post, user]);
  const handleLikeorUnlike = async () => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }
    setLiked(!liked);
    if (liked) {
      setLikes((prevLikes) => prevLikes.filter((id) => id !== user?.id));
    } else {
      setLikes((prevLikes) => [...prevLikes, user?.id ?? ""]);
    }
    try {
      const resp = await fetch(`/api/posts/${post.id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isLiked: !liked,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();

        console.log(data.message);
      } else {
        console.error("Errorupdating likes");
        setLiked(!liked);
        if (liked) {
          setLikes((prevLikes) => [...prevLikes, user?.id ?? ""]);
        } else {
          setLikes((prevLikes) => prevLikes.filter((id) => id !== user?.id));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <div className="">
        <div className="flex justify-between w-full p-2">
          <div className="p-2">
            {likes && likes.length > 0 && (
              <p className="text-xs text-gray-500 cursor-pointer hover:underline">
                {likes.length} likes
              </p>
            )}
          </div>
          <div className=" p-2">
            {Comments && Comments.length > 0 && (
              <p className="text-xs text-gray-500 cursor-pointer hover:underline">
                {Comments.length} comments
              </p>
            )}
          </div>
        </div>
        <div className="flex">
          <Button
            variant="ghost"
            onClick={() => {
              const promise = handleLikeorUnlike();
              toast.promise(promise, {
                error: "Error liking the post",
              });
            }}
            className=" flex justify-between p-4"
          >
            <ThumbsUpIcon
              className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}
            />
            Like
          </Button>
          <Button
            variant="ghost"
            onClick={() => setCommentOpen(!isCommentOpen)}
            className="postButton flex justify-center flex-1"
          >
            <MessageCircle
              className={cn(
                "mr-1",
                isCommentOpen && "text-gray-600 fill-gray-600"
              )}
            />
            Comment
          </Button>
          <Button variant="ghost" className=" flex justify-center flex-1">
            <Repeat2 className="mr-1" />
            Repost
          </Button>
          <Button variant="ghost" className=" flex justify-center flex-1">
            <Send className="mr-1" />
            Send
          </Button>
        </div>
        {isCommentOpen && (
          <div className="p-4">
            <SignedIn>
              <CommentForm post={post.id} />
            </SignedIn>

            <CommentOpen post={post} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostOptions;
