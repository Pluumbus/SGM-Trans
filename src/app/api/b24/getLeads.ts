import { callBitrixApi } from "@/utils/bitrix";

export async function GET() {
  try {
    const leads = await callBitrixApi("crm.lead.list", {
      select: ["ID", "TITLE", "NAME", "EMAIL"],
    });
    return new Response(JSON.stringify(leads), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return new Response(JSON.stringify({ error: "Error fetching leads" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
