"use client";
import { DocumentToViewType, DocumentType } from "./types";
import supabase from "@/utils/supabase/client";
import cyrillicToLatin from "cyrillic-to-latin";
import { transliterate as tr } from 'transliterate';


export const uploadFile = async (file: File): Promise<DocumentType | null> => {
 const trFileName = tr(file.name)
console.log(trFileName)
  const { data, error } = await supabase.storage
    .from("workflow-documents")
    .upload(trFileName, file);


  const { data: publicUrl } = supabase.storage
    .from("workflow-documents")
    .getPublicUrl(trFileName);

  const docData: DocumentType = {
    id: data?.id,
    title: trFileName,
    buckerUrl: publicUrl.publicUrl,
    docType: file.type,
    fullPath: data?.fullPath,
    path: data?.path,
  };

  if (error) {
    throw new Error(error.message);
  } else {
    return docData;
  }
};

export const getFileUrlList = async (): Promise<DocumentToViewType[] | null> => {
  const {data, error} = await supabase.storage.from("workflow-documents").list();
  
  let docsToView ;
  if(data) {
      docsToView = data.map((doc) => {
      const url = supabase.storage.from("workflow-documents").getPublicUrl(doc.name);
      const docData : DocumentToViewType = {
        id:doc.id,
        title:doc.name,
        docType:doc.metadata.mimetype,
        publicUrl:url.data.publicUrl,
        created_at: doc.created_at
      }
      return docData
    })
  } 
  if(error) {
    throw new Error(error.message)
  } else { 
    return docsToView;
  }
}

export const deleteFile = async (path : string) => {
await supabase.storage
    .from("workflow-documents")
    .remove([path]);
}
