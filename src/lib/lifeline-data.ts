import type {
  LifelineLegendItem,
  LifelineMarker,
} from "@/components/lifeline/types"

export const LIFELINE_CURRENT_YEAR = 2026

export type LifelineMilestone = Omit<LifelineMarker, "year">
export type LifelineMilestones = Record<number, LifelineMilestone>

export interface LifelineBirthday {
  month: number
  day: number
}

export interface LifelineRecord {
  slug: string
  name: string
  birthYear: number
  birthday?: LifelineBirthday
  /** Last year on the timeline. Omit for living people. */
  endYear?: number
  description: string
  /** People-legend labels; defaults to Mentors / Met in person. */
  legend?: LifelineLegendItem[]
  markers: LifelineMarker[]
}

interface DefineLifelineInput {
  slug: string
  name: string
  birthYear: number
  birthday?: LifelineBirthday
  endYear?: number
  description: string
  legend?: LifelineLegendItem[]
  milestones: LifelineMilestones
}

export function defineLifeline(input: DefineLifelineInput): LifelineRecord {
  const { milestones, ...record } = input
  const lastYear = input.endYear ?? LIFELINE_CURRENT_YEAR
  const markers: LifelineMarker[] = []
  const today = new Date()

  for (let year = input.birthYear; year <= lastYear; year++) {
    const milestone = milestones[year]
    const birthdayPending =
      year === LIFELINE_CURRENT_YEAR &&
      input.birthday &&
      (today.getMonth() + 1 < input.birthday.month ||
        (today.getMonth() + 1 === input.birthday.month &&
          today.getDate() < input.birthday.day))
    const age = birthdayPending ? year - input.birthYear - 1 : undefined

    markers.push(
      milestone
        ? { year, ...(age !== undefined && { age }), ...milestone }
        : {
            id: `year-${year}`,
            year,
            events: [],
            ...(age !== undefined && { age }),
          },
    )
  }

  return { ...record, markers }
}
