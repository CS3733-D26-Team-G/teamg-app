export interface ActivityItem {
  id: number;
  time: string;
  user: string;
  action: string;
}

export interface ActivityGroup {
  date: string;
  items: ActivityItem[];
}

export const activityData: ActivityGroup[] = [
  {
    date: "Today",
    items: [
      {
        id: 1,
        time: "9:30 am",
        user: "Colin Truong",
        action: "viewed Isaac's Documentation",
      },
      {
        id: 2,
        time: "11:00 am",
        user: "Sarah Chen",
        action: "updated the API routes",
      },
    ],
  },
  {
    date: "Yesterday",
    items: [
      {
        id: 3,
        time: "4:15 pm",
        user: "Alex Rivera",
        action: "merged a Pull Request",
      },
    ],
  },
];
