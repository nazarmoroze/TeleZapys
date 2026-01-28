import QuickActions from "@/components/dashboard/home/QuickActions";
import ScheduleList, {
  ScheduleItem,
} from "@/components/dashboard/home/ScheduleList";
import WeeklyOverview from "@/components/dashboard/home/WeeklyOverview";

const scheduleItems: ScheduleItem[] = [
  {
    time: "10:00",
    end: "11:30",
    title: "Манікюр Гель",
    client: "Марія К.",
    price: "800 ₴",
    status: "active",
  },
  {
    time: "12:30",
    end: "13:30",
    title: "Педикюр SPA",
    client: "Олена В.",
    price: "950 ₴",
    status: "canceled",
  },
  {
    time: "14:00",
    end: "14:45",
    title: "Консультація",
    client: "Новий клієнт",
    price: "0 ₴",
    status: "active",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 pb-4">
      <QuickActions />
      <WeeklyOverview />
      <ScheduleList items={scheduleItems} />
    </div>
  );
}
