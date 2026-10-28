/**
 * @vitest-environment jsdom
 */

import { useEffect, useRef } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AppointmentListItem } from "./appointment.query";
import { AppointmentCalendar } from "./appointment-calendar";
import { AppointmentForm } from "./appointment-form";

const { getAppointmentCalendarEvents } = vi.hoisted(() => ({
  getAppointmentCalendarEvents: vi.fn(),
}));

vi.mock("./appointment.actions", () => ({
  getAppointmentCalendarEvents,
}));

vi.mock("@fullcalendar/react", () => ({
  default: function CalendarMock({
    datesSet,
    events,
    select,
    eventClick,
  }: {
    datesSet: (range: { start: Date; end: Date }) => void;
    events: Array<{ id: string; title: string }>;
    select: (selection: { start: Date; end: Date; allDay: boolean }) => void;
    eventClick: (event: { event: { id: string } }) => void;
  }) {
    const initialized = useRef(false);

    useEffect(() => {
      if (!initialized.current) {
        initialized.current = true;
        datesSet({
          start: new Date("2032-04-04T00:00:00.000Z"),
          end: new Date("2032-04-11T00:00:00.000Z"),
        });
      }
    }, [datesSet]);

    return (
      <div>
        <button
          type="button"
          onClick={() =>
            select({
              start: new Date("2032-04-05T13:30:00.000Z"),
              end: new Date("2032-04-05T14:00:00.000Z"),
              allDay: false,
            })
          }
        >
          Selecionar horário
        </button>
        <button
          type="button"
          onClick={() =>
            select({
              start: new Date("2032-04-05T00:00:00.000Z"),
              end: new Date("2032-04-06T00:00:00.000Z"),
              allDay: true,
            })
          }
        >
          Selecionar dia inteiro
        </button>
        {events.map((event) => (
          <button
            type="button"
            key={event.id}
            onClick={() => eventClick({ event: { id: event.id } })}
          >
            {event.title}
          </button>
        ))}
      </div>
    );
  },
}));

const appointment: AppointmentListItem = {
  id: "appointment-1",
  startAt: new Date("2032-04-05T13:00:00.000Z"),
  endAt: new Date("2032-04-05T14:00:00.000Z"),
  status: "CONFIRMED",
  origin: "PHONE",
  notes: "Trazer referência do corte.",
  hasAttendance: false,
  client: { id: "client-1", name: "Ana Cliente" },
  professional: { id: "professional-1", name: "Bruno Profissional" },
  service: { id: "service-1", name: "Corte", duration: 60 },
};

function renderCalendar(onSelectSlot = vi.fn()) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return {
    onSelectSlot,
    ...render(
      <QueryClientProvider client={queryClient}>
        <AppointmentCalendar
          search=""
          professionalId=""
          serviceId=""
          status=""
          onSelectSlot={onSelectSlot}
        />
      </QueryClientProvider>,
    ),
  };
}

function toLocalDateTimeValue(value: Date): string {
  const localDate = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

describe("Appointment calendar interactions", () => {
  beforeEach(() => {
    getAppointmentCalendarEvents.mockReset();
    getAppointmentCalendarEvents.mockResolvedValue([appointment]);
  });

  it("opens the existing creation flow with a selected timed slot", async () => {
    const onSelectSlot = vi.fn();
    renderCalendar(onSelectSlot);

    fireEvent.click(screen.getByRole("button", { name: "Selecionar horário" }));

    expect(onSelectSlot).toHaveBeenCalledWith({
      startAt: new Date("2032-04-05T13:30:00.000Z"),
      endAt: new Date("2032-04-05T14:00:00.000Z"),
    });

    fireEvent.click(screen.getByRole("button", { name: "Selecionar dia inteiro" }));
    expect(onSelectSlot).toHaveBeenCalledTimes(1);
  });

  it("shows appointment details when an event is clicked", async () => {
    renderCalendar();

    fireEvent.click(await screen.findByRole("button", { name: /Ana Cliente/ }));

    expect(await screen.findByText("Detalhes do agendamento")).toBeTruthy();
    expect(screen.getByText("Bruno Profissional")).toBeTruthy();
    expect(screen.getByText("Confirmado")).toBeTruthy();
    expect(screen.getByText("Telefone")).toBeTruthy();
    expect(screen.getByText("Trazer referência do corte.")).toBeTruthy();
  });

  it("prefills the existing Appointment form with local slot times", () => {
    const startAt = new Date("2032-04-05T13:30:00.000Z");
    const endAt = new Date("2032-04-05T14:00:00.000Z");

    render(
      <AppointmentForm
        initialStartAt={startAt}
        initialEndAt={endAt}
        clients={[appointment.client]}
        professionals={[
          {
            id: appointment.professional.id,
            name: appointment.professional.name,
            serviceIds: [appointment.service.id],
          },
        ]}
        services={[
          {
            ...appointment.service,
            active: true,
          },
        ]}
        canChooseProfessional
        isPending={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      document.querySelector<HTMLInputElement>('input[name="startAt"]')?.value,
    ).toBe(toLocalDateTimeValue(startAt));
    expect(
      document.querySelector<HTMLInputElement>('input[name="endAt"]')?.value,
    ).toBe(toLocalDateTimeValue(endAt));
  });
});
