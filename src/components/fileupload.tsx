"use client";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase.config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";
import { useRouter } from "next/navigation";

const FileUpload: React.FC = () => {
  const router = useRouter();
  const [uploadedPercentage, setUploadedPercentage] = useState<number>(0);
  const [isCreatingChatroom, setIsCreatingChatroom] = useState<boolean>(false);

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: async ({
      fileKey,
      fileName,
      downloadUrl,
    }: {
      fileKey: string;
      fileName: string;
      downloadUrl: string;
    }) => {
      try {
        setIsCreatingChatroom(true);
        const response = await axios.post("/api/create-chat", {
          fileKey,
          fileName,
          downloadUrl,
        });
        return response.data;
      } catch (error) {
        toast.error("Error sending data to server.");
      }
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const pdfFile = acceptedFiles[0];
      if (pdfFile.size > 10 * 1024 * 1024) {
        toast.error("File is too large: Cannot be greater than 10MB");
        return;
      }

      try {
        const data = await uploadPdf(pdfFile);

        if (!data.fileKey || !data.fileName) {
          toast.error("Oops, something went wrong. Please try again later.");
          return;
        }

        mutate(
          {
            fileKey: data.fileKey,
            fileName: data.fileName,
            downloadUrl: data.downloadUrl,
          },
          {
            onSuccess({ chatId }) {
              toast.success("Chat created!");
              router.push(`/chat/${chatId}`);
              setIsCreatingChatroom(false);
            },
            onError(error) {
              toast.error("Error creating chat.");
            },
          }
        );
      } catch (error) {
        toast.error("Upload failed.");
      }
    },
  });

  const uploadPdf = async (
    file: File
  ): Promise<{ fileName: string; fileKey: string; downloadUrl: string }> => {
    setUploadedPercentage(0);

    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "pdf_uploads/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadedPercentage(progress);
        },
        (error) => {
          toast.error("An error occurred while uploading PDF");
          setUploadedPercentage(0);
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const uploadedFileName = uploadTask.snapshot.ref.name;
            const fileKey = uploadTask.snapshot.ref.fullPath;
            setUploadedPercentage(0);
            resolve({ fileName: uploadedFileName, fileKey, downloadUrl });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  return (
    <div className="p-2 bg-transparent rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-transparent py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {isCreatingChatroom ? (
          <>
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              renAI is creating chatroom.....
            </p>
          </>
        ) : isPending ? (
          <>
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              renAI is analyzing document.....
            </p>
          </>
        ) : uploadedPercentage ? (
          <>
            <ReactLoading
              type={"bars"}
              color={"blue"}
              height={"20%"}
              width={uploadedPercentage.toString() + "10%"}
            />
            <p className="mt-2 text-sm text-slate-400">
              Uploading pdf document.....
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
