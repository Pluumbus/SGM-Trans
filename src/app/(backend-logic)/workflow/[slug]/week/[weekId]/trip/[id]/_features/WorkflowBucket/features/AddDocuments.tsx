"use client";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../api";
import { toast } from "@/components/ui/use-toast";

export const AddDocuments = () => {
  const { mutate: AddDocMutation, isPending } = useMutation({
    mutationKey: ["AddDocsToBucket"],
    mutationFn: async (Addfile: File) => await uploadFile(Addfile),
    onSuccess: () => {
      toast({ title: "Документ загружен" });
    },
  });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      AddDocMutation(event.target.files[0]);
    }
  };
  return (
    <div className="flex justify-center">
      <div className="flex justify-center items-center p-4 rounded-lg ">
        <label className="flex items-center px-6 py-3 bg-green-500 text-black text-md font-semibold  cursor-pointer hover:bg-green-600 transition duration-300 rounded-lg">
          <span className="mr-2">Загрузить документы</span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="*/*"
          />
        </label>
      </div>
    </div>
  );
};
