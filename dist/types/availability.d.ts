/**
 * Availability states. Each source declares exactly one state.
 */
export type AvailabilityState = 'available' | 'not_found' | 'unlinked' | 'error';
export interface Availability {
    ethos: AvailabilityState;
    talent: AvailabilityState;
}
//# sourceMappingURL=availability.d.ts.map