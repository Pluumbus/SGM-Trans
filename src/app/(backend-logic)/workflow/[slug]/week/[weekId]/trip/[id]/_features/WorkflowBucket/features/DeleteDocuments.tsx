import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { deleteFile } from "../api";
import { DocumentToViewType } from "../api/types";

export const DeleteDocuments = ({ file }: { file: DocumentToViewType }) => {
  const { mutate: DeleteDocMutation } = useMutation({
    mutationKey: ["DeleteDoc"],
    mutationFn: async () => await deleteFile(file.title),
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