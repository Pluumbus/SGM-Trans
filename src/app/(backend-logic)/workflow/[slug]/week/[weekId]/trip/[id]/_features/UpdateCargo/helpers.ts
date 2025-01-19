import { CargoType } from "@/app/(backend-logic)/workflow/_feature/types";
import { UseFormSetValue } from "react-hook-form";

export const prefillForm = (
  setValue: UseFormSetValue<CargoType>,
  row: CargoType
) => {
  setValue("id", row.id);
  setValue("trip_id", row.trip_id);
  setValue("created_at", row.created_at || "");
  setValue("receipt_address", row.receipt_address || "");
  setValue("weight", row.weight || "");
  setValue("volume", row.volume || "");
  setValue("is_unpalletizing", row.is_unpalletizing || false);
  setValue("comments", row.comments || "");
  setValue("cargo_name", row.cargo_name || "");
  setValue("transportation_manager", row.transportation_manager || 0);
  setValue("is_documents", row.is_documents || false);

  setValue("loading_scheme", row.loading_scheme || "");
  setValue("user_id", row.user_id || "");
  setValue("paid_amount", row.paid_amount || 0);
  setValue("request_id", row.request_id);
  setValue("is_deleted", row.is_deleted || false);
  setValue("wh_id", row.wh_id);
  setValue("status", row.status ? new Date(row.status).toISOString() : null);

  // Nested: unloading_point
  setValue("unloading_point.city", row.unloading_point.city || "");
  setValue(
    "unloading_point.withDelivery",
    row.unloading_point.withDelivery || false
  );
  setValue(
    "unloading_point.deliveryAddress",
    row.unloading_point.deliveryAddress || ""
  );

  // Nested: quantity
  setValue("quantity.value", row.quantity.value || "");
  setValue("quantity.type", row.quantity.type || "");

  // Nested: driver
  setValue("driver.id", row.driver.id || "");
  setValue("driver.value", row.driver.value || "");

  // Nested: amount
  //   setValue("amount.value", row.amount.value);
  setValue("amount.type", row.amount.type || null);

  console.log("row", row);

  // Nested: client_bin
  setValue("client_bin.tempText", row.client_bin.tempText || "");
  setValue("client_bin.xin", row.client_bin.xin || "");
  setValue("client_bin.snts", row.client_bin.snts || []);

  // Nested: act_details
  setValue("act_details.is_ready", row.act_details.is_ready || false);
  setValue("act_details.user_id", row.act_details.user_id || "");
  setValue("act_details.amount", row.act_details.amount || 0);
  setValue(
    "act_details.date_of_act_printed",
    row.act_details.date_of_act_printed || ""
  );
};
