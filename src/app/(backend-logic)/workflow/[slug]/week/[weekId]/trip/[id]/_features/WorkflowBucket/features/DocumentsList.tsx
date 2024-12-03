import { Input, ScrollShadow } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SupaDoc } from "../api/types";
import { DeleteDocuments } from "./DeleteDocuments";
import { SgmSpinner } from "@/components/ui/SgmSpinner";
import { getDocsFromWeek } from "../api";
import supabase from "@/utils/supabase/client";
import { WeekType } from "@/app/(backend-logic)/workflow/_feature/types";

export const DocumentsList = ({ weekId }: { weekId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["GetAllFiles"],
    queryFn: async () => getDocsFromWeek(weekId),
  });
  const [files, setFiles] = useState<SupaDoc[]>(data);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (data) setFiles(data);
  }, [data]);

  useEffect(() => {
    const cn = supabase
      .channel(`workflow-bucket-${weekId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "weeks",
        },
        (payload) => {
          const newDoc = payload.new as WeekType;
          setFiles(newDoc.docs.doc);
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
    item.originalName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex justify-center flex-col">
      <Input placeholder="Поиск по названию" onChange={handleSetFilter} />
      {isLoading && <SgmSpinner />}
      <ScrollShadow className="h-[20rem]" hideScrollBar>
        {filteredFiles?.map((f) => (
          <div className="flex flex-col border-b-1 " key={f.id}>
            <span>Название : {f.originalName}</span>
            <span>
              Добавлено : <b>{new Date(f.created_at).toLocaleDateString()}</b>
            </span>
            <span className="flex justify-between mb-1">
              <a
                href={f.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={f.pathName}
                className="underline text-blue-600 hover:text-blue-800"
              >
                Скачать
              </a>
              <DeleteDocuments
                pathName={f.pathName}
                originalName={f.originalName}
                weekId={weekId}
              />
            </span>
          </div>
        ))}
      </ScrollShadow>
    </div>
  );
};
