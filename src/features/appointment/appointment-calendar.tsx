"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { DatesSetArg } from "@fullcalendar/core";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";

import { getAppointmentCalendarEvents } from "./appointment.actions";
import type { AppointmentStatusValue } from "./appointment.query";

interface AppointmentCalendarProps {
  search: string;
  professionalId: string;
  serviceId: string;
  status: AppointmentStatusValue | "";
}

interface CalendarRange {
  from: string;
  toExclusive: string;
}

const statusLabels: Record<AppointmentStatusValue, string> = {
  SCHEDULED: "Agendado",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  NO_SHOW: "Não compareceu",
};

export function AppointmentCalendar({
  search,
  professionalId,
  serviceId,
  status,
}: AppointmentCalendarProps) {
  const [range, setRange] = useState<CalendarRange>();

  const appointmentsQuery = useQuery({
    queryKey: [
      "appointments",
      "calendar",
      range?.from,
      range?.toExclusive,
      search,
      professionalId,
      serviceId,
      status,
    ],
    queryFn: () => {
      if (!range) {
        throw new Error("O intervalo do calendário ainda não está disponível.");
      }

      return getAppointmentCalendarEvents({
        from: range.from,
        toExclusive: range.toExclusive,
        search,
        ...(professionalId ? { professionalId } : {}),
        ...(serviceId ? { serviceId } : {}),
        ...(status ? { status } : {}),
      });
    },
    enabled: range !== undefined,
  });

  function handleDatesSet(dates: DatesSetArg) {
    const nextRange = {
      from: dates.start.toISOString(),
      toExclusive: dates.end.toISOString(),
    };

    setRange((currentRange) =>
      currentRange?.from === nextRange.from &&
      currentRange.toExclusive === nextRange.toExclusive
        ? currentRange
        : nextRange,
    );
  }

  const events =
    appointmentsQuery.data?.map((appointment) => ({
      id: appointment.id,
      title: `${appointment.client.name} · ${appointment.service.name} · ${statusLabels[appointment.status]}`,
      start: appointment.startAt.toISOString(),
      end: appointment.endAt.toISOString(),
    })) ?? [];

  return (
    <div className="space-y-3">
      {appointmentsQuery.isPending ? (
        <p className="text-sm text-muted-foreground" role="status">
          Carregando agendamentos...
        </p>
      ) : null}

      {appointmentsQuery.isError ? (
        <ErrorState
          title="Não foi possível carregar os agendamentos."
          description="Tente novamente. Se o problema persistir, verifique sua conexão."
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void appointmentsQuery.refetch();
              }}
            >
              Tentar novamente
            </Button>
          }
        />
      ) : null}

      {appointmentsQuery.isSuccess && events.length === 0 ? (
        <p className="text-sm text-muted-foreground" role="status">
          Nenhum agendamento neste período.
        </p>
      ) : null}

      <div className="rounded-lg border bg-card p-3">
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth",
          }}
          locale={ptBrLocale}
          buttonText={{ today: "Hoje", day: "Dia", week: "Semana", month: "Mês" }}
          events={events}
          datesSet={handleDatesSet}
          height="auto"
          nowIndicator
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </div>
    </div>
  );
}
