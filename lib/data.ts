import scenariosData from "@/data/seed/scenarios.json";
import eventsData from "@/data/seed/events.json";
import eventImpactsData from "@/data/seed/event_impacts.json";
import companiesData from "@/data/seed/companies.json";

export type Scenario = (typeof scenariosData)[number];
export type Event = (typeof eventsData)[number];
export type EventImpacts = Record<string, { return1d: number; return1w: number; return1m: number }>;
export type Company = (typeof companiesData)[number];

export const scenarios: Scenario[] = scenariosData as Scenario[];
export const events: Event[] = eventsData as Event[];
export const eventImpacts: EventImpacts = eventImpactsData as EventImpacts;
export const companies: Company[] = companiesData as Company[];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function getCompanyByTicker(ticker: string): Company | undefined {
  return companies.find((c) => c.ticker === ticker);
}

export function getEventImpacts(eventId: string) {
  return eventImpacts[eventId];
}

export function getEventsForTicker(ticker: string): Event[] {
  return events.filter((e) => e.ticker === ticker);
}

export function getEventsForScenario(scenarioId: string): Event[] {
  return events.filter((e) => e.scenarioId === scenarioId);
}

export function getEventsWithImpacts() {
  return events.map((evt) => ({
    ...evt,
    impacts: eventImpacts[evt.id],
    company: getCompanyByTicker(evt.ticker),
    scenario: getScenarioById(evt.scenarioId),
  }));
}
