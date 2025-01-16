import { WeekTableType } from "@/app/(backend-logic)/workflow/[slug]/week/[weekId]/trip/_api/types";

const WORKFLOW = "/workflow" as const;
const CLIENT = "/client" as const;

export const PATHS = {
  home: "/",
  client: `${CLIENT}`,
  requests: `${CLIENT}/requests`,
  profile: `/profile`,
  workflow_ru: `${WORKFLOW}/ru`,
  workflow_kz: `${WORKFLOW}/kz`,
  cashbox: `${WORKFLOW}/cashbox`,
  cars_drivers: `/cars&drivers`,
  sgm_mechanic: `/sgm-mechanic`,
  statistics: `/statistics`,
  requestsForLogist: `/requests`,
};

export const getPath = ({
  params,
  path = "Single Trip",
}: {
  params: {
    slug: WeekTableType;
    weekId: number;
    id: number;
  };
  path?: "Single Trip";
}) => `${WORKFLOW}/${params.slug}/week/${params.weekId}/trip/${params.id}`;
