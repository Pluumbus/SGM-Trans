import { z } from "zod";

export const clientRequestSchema = z.object({
  weight: z
    .string()
    .min(0.001, "Вес должен быть больше 1 кг")
    .max(1000, "Вес слишком большой"),
  quantity: z.object({
    value: z.string().min(1, "Количество должно быть больше 0"),
    type: z.string().optional(),
  }),
  volume: z
    .string()
    .min(0.1, "Объем должен быть больше 0.1 куб.м.")
    .max(100, "Объем слишком большой"),
  unloading_point: z.object({
    city: z.string().min(2, "Город выгрузки обязателен"),
    withDelivery: z.boolean().optional(),
    deliveryAddress: z.string().optional(),
  }),
  client_bin: z.object({
    snts: z.array(z.string()).optional(),
    tempText: z.string().min(1, "Название компании обязательно"),
    xin: z.string().min(1, "БИН/ИИН компании обязателен"),
  }),
  departure: z.string().min(1, "Город забора груза обязателен"),
  comments: z.string().optional(),
  cargo_name: z.string().min(1, "Наименование груза обязательно"),
  phone_number: z.string().min(1, "Телефон для обратной связи обязателен"),
});
