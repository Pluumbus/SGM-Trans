import { Button, ModalFooter } from "@nextui-org/react";

export const Footer = ({
  onOpenChangeCargo,
  isPending,
}: {
  onOpenChangeCargo: () => any;
  isPending: boolean;
}) => {
  return (
    <ModalFooter>
      <Button
        variant="light"
        color="danger"
        onPress={() => {
          onOpenChangeCargo();
        }}
      >
        Отмена
      </Button>
      <Button
        variant="flat"
        color="success"
        type="submit"
        isLoading={isPending}
      >
        Добавить груз
      </Button>
    </ModalFooter>
  );
};
