"use client";

import { useMutation } from "@tanstack/react-query";
import { getRequests } from "../_api";
import {
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { ReqListItem } from "./ReqListItem";
import { useReqItem } from "./Context";
import { ReqFullInfoCard } from "./ReqCard";
import { allCities, AllCitiesType } from "@/lib/references/cities/citiesRef";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDebounce } from "@/tool-kit/hooks";
import {
  ClientRequestStatus,
  ClientRequestTypeDTO,
} from "@/app/(client-logic)/client/types";
import { useUser } from "@clerk/nextjs";
import supabase from "@/utils/supabase/client";
import { CargoModal } from "../../workflow/_feature";
import { CargoModalMode } from "../../workflow/_feature/AddCargoModal/CargoModal";

type SortByType = 1 | 2 | 3;

export const ReqList = () => {
  const [requests, setRequests] = useState<ClientRequestTypeDTO[]>([]);
  const [initialReqs, setInitReqs] = useState<ClientRequestTypeDTO[]>([]);
  const [sortBy, setSortBy] = useState<SortByType>(1);
  const [filterBy, setFilterBy] = useState<AllCitiesType | null>(null);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["GetRequestsForLogist"],
    mutationFn: async () => await getRequests(),
    onSuccess: (data) => {
      setRequests(data);
      setInitReqs(data);
    },
  });

  useEffect(() => {
    mutate();
  }, []);
  const { user } = useUser();

  const { selectedReq, setSelectedReq, disclosure } = useReqItem();

  const { debounce } = useDebounce();

  const handleFilter = (e: string) => {
    debounce(() => {
      setRequests((prev) =>
        prev.filter((el) => e == el.unloading_point.city || e == el.departure)
      );
    }, 200);
  };
  const handleSort = (dataToSortFrom?: ClientRequestTypeDTO[]) => {
    switch (sortBy) {
      case 1:
        setRequests(
          (dataToSortFrom || initialReqs).filter(
            (e) => e.status === ClientRequestStatus.CREATED
          )
        );
        setSelectedReq(
          (dataToSortFrom || initialReqs).filter(
            (e) => e.status === ClientRequestStatus.CREATED
          )[0]
        );
        break;
      case 2:
        setRequests(
          (dataToSortFrom || initialReqs).filter(
            (e) => e.status === ClientRequestStatus.IN_REVIEW
          )
        );
        setSelectedReq(
          (dataToSortFrom || initialReqs).filter(
            (e) => e.status === ClientRequestStatus.IN_REVIEW
          )[0]
        );
        break;
      case 3:
        setRequests(
          (dataToSortFrom || initialReqs).filter(
            (e) => e.status === ClientRequestStatus.REJECTED
          )
        );
        setSelectedReq(
          (dataToSortFrom || initialReqs).filter(
            (e) => e.status === ClientRequestStatus.REJECTED
          )[0]
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleSort();
    }
  }, [sortBy, isSuccess, initialReqs]);

  useEffect(() => {
    if (!user?.id || !isSuccess) return;

    const channel = supabase
      .channel(`requests-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "requests",

          filter: `logist_id=in.(${user.id}, "")`,
        },
        (payload) => {
          const newReq = payload.new as ClientRequestTypeDTO;
          setInitReqs((prev) =>
            prev.map((e) => (e.id == newReq.id ? newReq : e))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "requests",

          filter: `logist_id=in.(${user.id}, "")`,
        },
        (payload) => {
          const newReq = payload.new as ClientRequestTypeDTO;
          setInitReqs((prev) => {
            const alreadyExists = prev.some((r) => r.id === newReq.id);
            return alreadyExists ? prev : [...prev, newReq];
          });
        }
      )

      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [user?.id, isSuccess]);

  if (isPending) {
    return <Spinner />;
  }
  return (
    <div className="w-full flex flex-col gap-4 mb-16 px-4">
      <div className="w-1/2">
        <Card shadow="none" className="border w-fit overflow-hidden">
          <CardBody className="flex items-center gap-2 overflow-hidden">
            <div className="grid grid-cols-2 gap-2 w-fit h-fit">
              <Tabs
                className="col-span-2 flex justify-center"
                variant="underlined"
                selectedKey={sortBy.toString()}
                onSelectionChange={(e) => {
                  setSortBy(Number(e) as SortByType);
                }}
              >
                <Tab key={1} title={<span>Все заявки</span>} />
                <Tab key={2} title={<span>Заявки с которыми работаю Я</span>} />
                <Tab key={3} title={<span>Отклонненые заявки</span>} />
              </Tabs>

              <Autocomplete
                label={<span>Выберите&nbsp;город</span>}
                variant="underlined"
                className="col-span-2"
                selectedKey={filterBy}
                onSelectionChange={(city) => {
                  setFilterBy(city as string);
                  if (city) handleFilter(city as string);
                  else handleSort();
                }}
              >
                {allCities.map((city) => (
                  <AutocompleteItem key={city} textValue={city}>
                    {city}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="flex gap-4 w-full ">
        <div className="flex flex-col gap-4 w-1/2">
          {requests.map((req) => (
            <div className="w-full" key={req.id}>
              <ReqListItem info={req} />
            </div>
          ))}
          <EmptyReqsCard
            requests={requests}
            sort={[sortBy, setSortBy]}
            filter={filterBy}
            initialReqs={initialReqs}
            user={user}
          />
        </div>

        <div className="w-1/2">{selectedReq?.id && <ReqFullInfoCard />}</div>
      </div>
      <CargoModal
        disclosure={disclosure}
        prefilledData={selectedReq}
        mode={CargoModalMode.FROM_REQUEST}
      />
    </div>
  );
};

const EmptyReqsCard = ({
  requests,
  sort,
  initialReqs,
  user,
  filter,
}: {
  requests: ClientRequestTypeDTO[];
  sort: [SortByType, Dispatch<SetStateAction<SortByType>>];
  initialReqs: ClientRequestTypeDTO[];
  filter: AllCitiesType | null;
  user: ReturnType<typeof useUser>["user"];
}) => {
  const [sortBy, setSortBy] = sort;

  if (requests.length == 0) {
    const ReqInReview = () => {
      return (
        <div
          className="flex gap-1 hover:text-gray-600 cursor-pointer"
          onClick={() => {
            setSortBy(2);
          }}
        >
          <span className="font-semibold">{user?.firstName},</span>
          <span>у вас осталось</span>
          <span className="font-semibold">
            {
              initialReqs.filter(
                (e) => e.status === ClientRequestStatus.IN_REVIEW
              ).length
            }
          </span>
          <span>заявки(ок) в рассмотрении</span>
        </div>
      );
    };
    switch (sortBy) {
      case 1:
        return (
          <Card shadow="none" className="border">
            <CardHeader>Свободных заявок не осталось</CardHeader>
            <CardBody className="text-lg ">
              <ReqInReview />
            </CardBody>
          </Card>
        );

      case 2:
        if (filter) {
          return (
            <Card shadow="none" className="border">
              <CardBody className="text-lg ">
                <div className="flex gap-1">
                  <span>Заявок которые направляются</span>
                  <span className="font-semibold">В</span>
                  <span>или</span>
                  <span className="font-semibold">ИЗ</span>
                  <span>выбранного города </span>
                  <span className="font-semibold">нет</span>
                </div>
              </CardBody>
            </Card>
          );
        } else {
          return (
            <Card shadow="none" className="border">
              <CardHeader>Хорошая работа</CardHeader>
              <CardBody className="text-lg ">
                <div
                  className="flex gap-1 hover:text-gray-600 cursor-pointer"
                  onClick={() => {
                    setSortBy(1);
                  }}
                >
                  <span>Обратите внимание что осталось: </span>
                  <span className="font-semibold">
                    {
                      initialReqs.filter(
                        (e) => e.status === ClientRequestStatus.CREATED
                      ).length
                    }
                  </span>
                  <span>свободных заявок</span>
                </div>
              </CardBody>
            </Card>
          );
        }
      case 3:
        return (
          <Card shadow="none" className="border">
            <CardHeader>
              <span>
                Отклоненных заявок <span className="font-semibold">нет</span>
              </span>
            </CardHeader>
            <CardBody className="text-lg ">
              <ReqInReview />
            </CardBody>
          </Card>
        );
      default:
        break;
    }
  }
};
