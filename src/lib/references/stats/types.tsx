export type StatsUserList = {
  user_id: string;
  value: number[];
  userName: string;
  avatar: string;
  role: string;
  created_at: Date[];
  prizeSum?: any;
  leadUserSum?: number;
  currentWeek?: { start: string; end: string };
};
