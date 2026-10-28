"use client";

import axios from "axios";

export const handleUploadWithCloudinary = async (
  file: File,
  opts: { maxWidth?: number; maxMB?: number } = {},
): Promise<string> => {
  if (!(file instanceof File)) {
    throw new Error("No image selected");
  }

  const { maxWidth = 1920, maxMB = 10 } = opts;

  if (file.size > maxMB * 1024 * 1024) {
    throw new Error(`Image must be under ${maxMB}MB`);
  }

  const token = localStorage.getItem("token");

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/cloudinary-signature`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const { signature, timestamp, apiKey, cloudName, folder } = data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const uploadData = await uploadRes.json();

  if (!uploadRes.ok || !uploadData.secure_url) {
    throw new Error(uploadData?.error?.message || "Image upload failed");
  }

  return uploadData.secure_url.replace(
    "/upload/",
    `/upload/c_limit,w_${maxWidth},q_auto,f_auto/`,
  );
};
