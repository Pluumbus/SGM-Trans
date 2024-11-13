import { ScrollShadow } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getFileUrlList } from "../api";
import { useEffect, useState } from "react";
import { DocumentToViewType } from "../api/types";
import supabase from "@/utils/supabase/client";
import { DeleteDocuments } from "./DeleteDocuments";

export const DocumentsList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["GetAllFiles"],
    queryFn: async () => getFileUrlList(),
  });
  const [files, setFiles] = useState<DocumentToViewType[]>(data);

  useEffect(() => {
    if (data) setFiles(data);
  }, [data]);
  // console.log("Data in page", data);

  useEffect(() => {
    const cn = supabase
      .channel(`workflow-bucket`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "storage",
          table: "objects",
        },
        (payload) => {
          const newDoc = payload.new;
          console.log(newDoc);

          // if (payload.eventType == "INSERT")
          //   setFiles((prev) => [...prev, newDoc]);
        }
      )
      .subscribe();

    return () => {
      cn.unsubscribe();
    };
  }, []);

  return (
    <div className="flex justify-center">
      <ScrollShadow>
        {files?.map((f) => (
          <div className="flex flex-col border-b-1 " key={f.id}>
            <span>Название : {f.title}</span>
            <span>
              Добавлено : <b>{new Date(f.created_at).toLocaleDateString()}</b>
            </span>
            <span className="flex justify-between">
              <a
                href={f.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={f.title}
                className="underline text-blue-600 hover:text-blue-800"
              >
                Скачать
              </a>
              <DeleteDocuments file={f} />
            </span>
          </div>
        ))}
      </ScrollShadow>
    </div>
  );
};
