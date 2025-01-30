export type LeadType = {
  id: string;
  name: string;
  title: string;
  date_create: string;
  status_id: string;
  phone?: {
    id?: string;
    value_type?: string;
    value?: string;
    type_id?: string;
  };
  email?: {
    id?: string;
    value_type?: string;
    value?: string;
    type_id?: string;
  };
};

export const leadsMockData: LeadType[] = [
  {
    id: "1",
    name: "Иван Иванов",
    title: "Менеджер по продажам",
    date_create: "2025-01-30T10:00:00Z",
    status_id: "active",
    phone: {
      id: "101",
      value_type: "mobile",
      value: "+79001234567",
      type_id: "1",
    },
    email: {
      id: "201",
      value_type: "work",
      value: "ivan.ivanov@example.com",
      type_id: "1",
    },
  },
  {
    id: "2",
    name: "Елена Смирнова",
    title: "Маркетолог",
    date_create: "2025-01-29T14:30:00Z",
    status_id: "pending",
    phone: {
      id: "102",
      value_type: "home",
      value: "+79161234567",
      type_id: "2",
    },
    email: {
      id: "202",
      value_type: "personal",
      value: "elena.smirnova@gmail.com",
      type_id: "2",
    },
  },
  {
    id: "3",
    name: "Петр Васильев",
    title: "Разработчик",
    date_create: "2025-01-28T09:15:00Z",
    status_id: "completed",
    phone: {
      id: "103",
      value_type: "work",
      value: "+79271234567",
      type_id: "1",
    },
  },
  {
    id: "4",
    name: "Ольга Кузнецова",
    title: "Дизайнер",
    date_create: "2025-01-27T11:45:00Z",
    status_id: "active",
    email: {
      id: "203",
      value_type: "work",
      value: "olga.kuznetsova@company.com",
      type_id: "1",
    },
  },
  {
    id: "5",
    name: "Сергей Сидоров",
    title: "Аналитик",
    date_create: "2025-01-26T13:20:00Z",
    status_id: "inactive",
    phone: {
      id: "104",
      value_type: "mobile",
      value: "+79301234567",
      type_id: "3",
    },
    email: {
      id: "204",
      value_type: "personal",
      value: "sergey.sid@gmail.com",
      type_id: "3",
    },
  },
];

export default leadsMockData;
