"use client";
import { Post } from "@/firebase/logic.posts";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import ReactTimeago from "react-timeago";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import PostOptions from "./PostOptions";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
function PostComponent({ post }: { post: Post }) {
  const { user } = useUser();

  const fullNameWords = post.userName ? post.userName.split(" ") : [];
  const initials = fullNameWords.map((word) => word.charAt(0));
  const isAuthor = user?.id === post.userId;
  const handleDelete = async () => {
    try {
      const resp = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (resp.ok) {
        console.log("Post deleted successfully");
      } else {
        console.error("Error deleting post:", resp.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const formatText = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const boldReplacedText = text.replace(boldRegex, "<strong>$1</strong>");
    const italicRegex = /\*(.*?)\*/g;
    const italicReplacedText = boldReplacedText.replace(
      italicRegex,
      "<em>$1</em>"
    );
    return italicReplacedText;
  };

  return (
    <div className="bg-white rounded-md">
      <div className="p-4 flex space-x-2">
        <div className="">
          <Avatar>
            <AvatarImage src={post.userImageURL} />
            <AvatarFallback>{initials.join("")}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex justify-between flex-1">
          <div className="">
            <p className="font-semibold">
              {post.userName}
              {isAuthor && (
                <Badge className="ml-2" variant="secondary">
                  Author
                </Badge>
              )}
            </p>
            <p className="text-xs text-gray-400">
              @{post.userName.split(" ")[0]}
              {post.userName}-{post.userId.toString().slice(-4)}
            </p>
            <p className="text-xs text-gray-400">
              <ReactTimeago date={new Date(post.createdAt)} />
            </p>
          </div>
          {isAuthor && (
            <Button
              variant="outline"
              onClick={() => {
                const promise = handleDelete();
                toast.promise(promise, {
                  loading: "Deleting post...",
                  success: "Post deleted successfully",
                  error: "Failed to delete post",
                });
              }}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
      <div className="">
        <div className="p-4  text-wrap mb-2 mt-2">
          <p>{formatText(post.text)}</p>
        </div>
        {post.imageUrl && (
          <div className="p-4">
            <Image
              src={post.imageUrl}
              alt="post-image"
              width={500}
              height={500}
              className="rounded-md w-full mx-auto"
            />
          </div>
        )}
      </div>
      <PostOptions post={post} />
    </div>
  );
}

export default PostComponent;
