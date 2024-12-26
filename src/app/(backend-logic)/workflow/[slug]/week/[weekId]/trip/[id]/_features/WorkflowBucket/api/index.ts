"use server";
import getSupabaseServer from "@/utils/supabase/server";

export const uploadFileToDb = async (
  fileName: string,
  url: string,
  weekId: string,
  fCreated_at: string,
  fileId: string,
  path: string,
) => {
  const supabase = await getSupabaseServer();

  const { data: oldData, error: oldError } = await supabase
    .from("weeks")
    .select("docs")
    .eq("id", Number(weekId))
    .single();

  if (oldError) {
    throw new Error(oldError.message);
  }

  const currentDocs = oldData?.docs?.doc || [];

  const updatedDocs = [
    ...currentDocs,
    {
      id: fileId,
      docUrl: url,
      comments: "",
      pathName: path,
      created_at: fCreated_at,
      originalName: fileName,
    },
  ];

  const { data, error } = await supabase
    .from("weeks")
    .update({
      docs: { doc: updatedDocs },
    })
    .eq("id", Number(weekId));

  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
};

export const getDocsFromWeek = async (weekId: string) => {
  const supabase = await getSupabaseServer();

  const { data, error } = await supabase
    .from("weeks")
    .select("docs")
    .eq("id", Number(weekId))
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data?.docs?.doc || [];
};

export const deleteFileFromDb = async (weekId: string, path: string) => {
  const supabase = await getSupabaseServer();

  const { data: oldData, error: fetchError } = await supabase
    .from("weeks")
    .select("docs")
    .eq("id", Number(weekId))
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const currentDocs = oldData?.docs?.doc || [];

  const updatedDocs = currentDocs.filter(
    (doc: { pathName: string }) => !doc.pathName.includes(path),
  );

  const { error: updateError } = await supabase
    .from("weeks")
    .update({ docs: { doc: updatedDocs } })
    .eq("id", Number(weekId));

  if (updateError) {
    throw new Error(updateError.message);
  }

  // return { success: true };
};
