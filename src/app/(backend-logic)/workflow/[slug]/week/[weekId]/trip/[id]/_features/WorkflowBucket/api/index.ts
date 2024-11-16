"use client";
import { customTransliterateToEngl } from "@/components/CustomTranslit/CustomTranslitToEngl";
import { DocumentToViewType, DocumentType } from "./types";
import supabase from "@/utils/supabase/client";


export const uploadFile = async (file: File, weekId : string) => {
 const fName = customTransliterateToEngl(file.name)
  const { data, error } = await supabase.storage
    .from("workflow-documents")
    .upload(fName, file);

    const url = supabase.storage.from("workflow-documents").getPublicUrl(file.name);


    const {data:sData, error:weeksError} = await supabase.from("weeks").update({docs : {docUrl: url, originalName: file.name}}).eq("id",weekId)

console.log(sData, "weekId", weekId)
  if (error || weeksError) {
    throw new Error(error.message || weeksError.message);
  } 
  else {
    return data;
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
        created_at: doc.created_at,
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
