"use client";
import { customTransliterateToEngl } from "@/components/CustomTranslit/CustomTranslitToEngl";
import supabase from "@/utils/supabase/client";
import { deleteFileFromDb, uploadFileToDb } from ".";

export const uploadFile = async (file: File, weekId: string) => {
  const fName = customTransliterateToEngl(file.name);
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("workflow-documents")
    .upload(fName, file);

  const url = supabase.storage.from("workflow-documents").getPublicUrl(fName);

  const { data, error } = await supabase.storage
    .from("workflow-documents")
    .list();

  if (error) {
    throw new Error(error.message);
  }

  const currentFileSelect = data?.filter((f) => f.name === fName)[0];

  await uploadFileToDb(
    file.name,
    url.data.publicUrl,
    weekId,
    currentFileSelect.created_at,
    currentFileSelect.id,
    fName
  );
};

export const deleteFile = async (path: string, weekId: string) => {
  console.log(path);
  await supabase.storage.from("workflow-documents").remove([path]);
  await deleteFileFromDb(weekId, path);
};
// export const getFileUrlList = async (): Promise<
//   DocumentToViewType[] | null
// > => {
//   const { data, error } = await supabase.storage
//     .from("workflow-documents")
//     .list();

//   let docsToView;
//   if (data) {
//     docsToView = data.map((doc) => {
//       const url = supabase.storage
//         .from("workflow-documents")
//         .getPublicUrl(doc.name);

//       const docData: DocumentToViewType = {
//         id: doc.id,
//         title: doc.name,
//         docType: doc.metadata.mimetype,
//         publicUrl: url.data.publicUrl,
//         created_at: doc.created_at,
//       };
//       return docData;
//     });
//   }
//   if (error) {
//     throw new Error(error.message);
//   } else {
//     return docsToView;
//   }
// };
