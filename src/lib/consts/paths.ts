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
};
