import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const sendTelegramMessage = async (chatId: number, text: string) => {
  if (!botToken) return;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
};

const formatDate = (date: string) =>
  new Date(date).toLocaleString("uk-UA", {
    dateStyle: "medium",
    timeStyle: "short",
  });

Deno.serve(async () => {
  if (!botToken || !supabaseUrl || !serviceRoleKey) {
    return new Response("Missing Telegram or Supabase env vars", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const now = new Date();

  const oneHourStart = new Date(now.getTime() + 60 * 60 * 1000);
  const oneHourEnd = new Date(now.getTime() + 65 * 60 * 1000);
  const dayStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000);

  const { data: upcomingHour } = await supabase
    .from("appointments")
    .select("id, start_time, service_type, profiles:master_id(telegram_id, full_name)")
    .gte("start_time", oneHourStart.toISOString())
    .lt("start_time", oneHourEnd.toISOString());

  const { data: upcomingDay } = await supabase
    .from("appointments")
    .select("id, start_time, service_type, profiles:master_id(telegram_id, full_name)")
    .gte("start_time", dayStart.toISOString())
    .lt("start_time", dayEnd.toISOString());

  for (const appointment of upcomingHour ?? []) {
    const master = appointment.profiles;
    if (master?.telegram_id) {
      await sendTelegramMessage(
        Number(master.telegram_id),
        `Нагадування: запис через 1 годину (${appointment.service_type}) о ${formatDate(
          appointment.start_time
        )}.`
      );
    }
  }

  for (const appointment of upcomingDay ?? []) {
    const master = appointment.profiles;
    if (master?.telegram_id) {
      await sendTelegramMessage(
        Number(master.telegram_id),
        `Завтра заплановано запис (${appointment.service_type}) о ${formatDate(
          appointment.start_time
        )}.`
      );
    }
  }

  return new Response(
    JSON.stringify({
      sentHour: upcomingHour?.length ?? 0,
      sentDay: upcomingDay?.length ?? 0,
      note: "Клієнтські нагадування потребують telegram_id у таблиці clients.",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
