import { InteractiveCard } from "@/components/InteractiveCard";

const Page = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="mb-10">
        <span className="text-2xl font-semibold">
          Добро пожаловать на SGM-Trans
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InteractiveCard href="/client" label="Клиент" />
        <InteractiveCard href="/workflow/ru" label="Сотрудник" />
      </div>
    </div>
  );
};

export default Page;
