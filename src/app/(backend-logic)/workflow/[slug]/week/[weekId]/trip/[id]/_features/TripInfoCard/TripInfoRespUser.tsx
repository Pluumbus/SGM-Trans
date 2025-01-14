import { toast } from "@/components/ui/use-toast";
import { UsersList } from "@/lib/references/clerkUserType/types";
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { IoMdSettings } from "react-icons/io";
import { updateTripRespUser } from "../../../_api/requests";

export const TripInfoResponsibleUser = ({
  tripId,
  respUser,
  allUsers,
}: {
  tripId: number;
  respUser: string;
  allUsers: UsersList[];
}) => {
  const { mutate: setTripUserMutation } = useMutation({
    mutationKey: ["SetTripRespUser"],
    mutationFn: async (user_id: string) =>
      await updateTripRespUser(user_id, tripId),
    onSuccess() {
      toast({
        title: "Ответственный рейса успешно обновлён",
      });
    },
  });
  return (
    <div className="flex justify-between">
      <span>Ответственный:</span>
      <b>{respUser}</b>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" color="default">
            <IoMdSettings />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Select dropdown">
          {allUsers?.map((user) => (
            <DropdownItem
              key={user.id}
              onPress={() => {
                setTripUserMutation(user.id);
              }}
            >
              {user.userName}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
