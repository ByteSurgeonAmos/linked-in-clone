interface PostData {
  postInput: string;
  image?: File;
}

export const createPostAction = async ({ postInput, image }: PostData) => {
  console.log(image);

  if (!postInput) {
    throw new Error("Post input is required");
  }

  try {
    const postData = {
      postInput,
      imageFile: image,
      // Add other fields as needed
    };
    console.log(postData);

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    // Handle successful response

    const data = await response.json();
    console.log("Post created successfully:", data);
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
};
