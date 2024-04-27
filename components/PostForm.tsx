"use client";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const PostForm = () => {
  const { user } = useUser();
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      setImage(file);
    }
  };

  const handlePostAction = async () => {
    try {
      if (!text.trim()) {
        throw new Error("You must provide a post input");
      }

      const formData = new FormData();
      formData.append("postInput", text);
      if (image) {
        formData.append("imageFile", image);
      }
      console.log(formData);

      const promise = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!promise.ok) {
        throw new Error("Failed to create post");
      }

      setText("");
      setImage(undefined);
      setPreview(null);
    } catch (error) {
      console.log("Error creating post", error);
    }
  };

  return (
    <div className="mb-2">
      <div className="p-3 bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Avatar>
            {user?.id ? (
              <AvatarImage src={user?.imageUrl} />
            ) : (
              <AvatarImage src="https://github.com/shadcn.png" />
            )}

            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing a post..."
            className="flex-1 outline-none rounded-full py-3 px-4 border"
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => {
              const promise = handlePostAction();
              toast.promise(promise, {
                loading: "Creating post...",
                success: "Post created successfully",
                error: "Failed to create post",
              });
            }}
          >
            Post
          </button>
        </div>
        {preview && (
          <div className="mt-3">
            <img src={preview} alt="preview" className="w-full object-cover" />
          </div>
        )}
        <div className="flex justify-end mt-2 space-x-2">
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="mr-2" size={16} color="currentColor" />
            {preview ? "Change" : "Add"} image
          </Button>

          {preview && (
            <Button variant="outline" onClick={() => setPreview(null)}>
              <XIcon className="mr-2" size={16} color="currentColor" />
              Remove image
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostForm;
