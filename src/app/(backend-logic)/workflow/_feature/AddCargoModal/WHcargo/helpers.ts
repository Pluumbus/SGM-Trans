import { UseFormSetValue } from "react-hook-form";
import { WHCargoType } from "./types";

export const prefillWHCargo = (
  setValue: UseFormSetValue<WHCargoType>,
  row: WHCargoType
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

  setValue("is_documents", row.is_documents || false);

  setValue("loading_scheme", row.loading_scheme || "");
  setValue("user_id", row.user_id || "");
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
  setValue("driver.id", row?.driver?.id || "");
  setValue("driver.value", row?.driver?.value || "");

  // Nested: client_bin
  setValue("client_bin.tempText", row.client_bin.tempText || "");
  setValue("client_bin.xin", row.client_bin.xin || "");
  setValue("client_bin.snts", row.client_bin.snts || []);
};
