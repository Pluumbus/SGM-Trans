import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { deleteFile } from "../api/request";

export const DeleteDocuments = ({
  pathName,
  originalName,
  weekId,
}: {
  pathName: string;
  originalName: string;
  weekId: string;
}) => {
  const { mutate: DeleteDocMutation } = useMutation({
    mutationKey: ["DeleteDoc"],
    mutationFn: async () => await deleteFile(pathName, weekId),
    onSuccess: () => {
      toast({ title: `Документ ${originalName} удалён` });
    },
  });
  const handleDeleteDoc = () => {
    DeleteDocMutation();
  };
  return (
    <div>
      <Button size="sm" color="danger" onPress={handleDeleteDoc}>
        Удалить
      </Button>
    </div>
  );
};
