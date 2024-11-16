import { Input, ScrollShadow } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getFileUrlList } from "../api";
import { useEffect, useState } from "react";
import { DocumentToViewType } from "../api/types";
import supabase from "@/utils/supabase/client";
import { DeleteDocuments } from "./DeleteDocuments";
import {
  customTransliterateToEngl,
  reverseTransliterate,
} from "@/components/CustomTranslit/CustomTranslitToEngl";
import { customTransliterateToRus } from "@/components/CustomTranslit/CustomTranslitToRus";
import { SgmSpinner } from "@/components/ui/SgmSpinner";
import { getUserList } from "@/lib/references/clerkUserType/getUserList";

export const DocumentsList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["GetAllFiles"],
    queryFn: async () => getFileUrlList(),
  });
  const [files, setFiles] = useState<DocumentToViewType[]>(data);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (data) setFiles(data);
  }, [data]);

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
  const handleSetFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  const filteredFiles = files?.filter((item) =>
    item.title.toLowerCase().includes(filter.toLowerCase())
  );

  console.log(files);
  return (
    <div className="flex justify-center flex-col">
      <Input placeholder="Поиск по названию" onChange={handleSetFilter} />
      {isLoading && <SgmSpinner />}
      <ScrollShadow className="h-[20rem]" hideScrollBar>
        {filteredFiles?.map((f) => (
          <div className="flex flex-col border-b-1 " key={f.id}>
            <span>
              Название : {reverseTransliterate(f.title.split(".")[0] + ".")}
              {f.title.split(".")[1]}
            </span>
            <span>
              Добавлено : <b>{new Date(f.created_at).toLocaleDateString()}</b>
            </span>
            <span className="flex justify-between mb-1">
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
