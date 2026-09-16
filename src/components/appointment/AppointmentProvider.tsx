"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_DOCTOR_ID,
  getDoctor,
  isDoctorId,
  type ClinicDoctor,
  type DoctorId,
} from "@/lib/doctors";
import { AppointmentModal } from "./AppointmentModal";

/**
 * Single shared source of truth for the selected doctor.
 *
 * • `activeDoctorId` — the doctor currently shown by the homepage slider.
 *   Slider navigation AND the popup's in-dialog doctor switcher both update
 *   it, so the slider and the popup can never drift out of sync.
 * • `openAppointmentModal({ doctorId?, service? })` — opens the popup with an
 *   explicit doctor (falls back to the currently active one) and optionally
 *   pre-selects a service from that doctor's own option list.
 * • The popup always renders image / name / specialty / department / service
 *   options from ONE ClinicDoctor object — identities can never mix.
 */

export type OpenAppointmentOptions = {
  doctorId?: string;
  /** Canonical English service value to pre-select (if valid for the doctor). */
  service?: string;
};

type AppointmentContextValue = {
  activeDoctorId: DoctorId;
  activeDoctor: ClinicDoctor;
  setActiveDoctor: (id: DoctorId) => void;
  isOpen: boolean;
  /** Accepts a doctor id string ("himanshu-arora") or { doctorId?, service? }. */
  openAppointmentModal: (
    options?: OpenAppointmentOptions | DoctorId | string
  ) => void;
  closeAppointmentModal: () => void;
};

const AppointmentContext = createContext<AppointmentContextValue>({
  activeDoctorId: DEFAULT_DOCTOR_ID,
  activeDoctor: getDoctor(DEFAULT_DOCTOR_ID),
  setActiveDoctor: () => {},
  isOpen: false,
  openAppointmentModal: () => {},
  closeAppointmentModal: () => {},
});

/** Legacy service-card titles → canonical form values (stable across languages). */
function normalizeServiceValue(value: string): string {
  return value === "Comprehensive Eye Examination" ? "Eye Examination" : value;
}

export function AppointmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeDoctorId, setActiveDoctorId] =
    useState<DoctorId>(DEFAULT_DOCTOR_ID);
  const [isOpen, setIsOpen] = useState(false);
  const [modalDoctorId, setModalDoctorId] =
    useState<DoctorId>(DEFAULT_DOCTOR_ID);
  const [prefillService, setPrefillService] = useState<string | null>(null);

  const setActiveDoctor = useCallback((id: DoctorId) => {
    setActiveDoctorId(id);
  }, []);

  const openAppointmentModal = useCallback(
    (options?: OpenAppointmentOptions | DoctorId | string) => {
      // Accept the short form openAppointmentModal("himanshu-arora") as well
      // as the full options object.
      const normalized: OpenAppointmentOptions =
        typeof options === "string" ? { doctorId: options } : (options ?? {});

      const requested = normalized.doctorId;

      if (
        process.env.NODE_ENV !== "production" &&
        requested !== undefined &&
        !isDoctorId(requested)
      ) {
        // Dev-only diagnostic: an unknown id silently falls back to the
        // default doctor below; production stays log-free.
        console.error(
          `[vishvaas] openAppointmentModal: unknown doctorId "${requested}" — using the default doctor instead.`
        );
      }

      // Doctor-specific CTAs pass an explicit id. Global CTAs (header,
      // mobile sticky bar, contact, hero) have no doctor context and open
      // with the clinic's default doctor — the in-popup switcher is always
      // visible so the visitor can change this in one tap.
      const doctor = getDoctor(
        requested && isDoctorId(requested) ? requested : DEFAULT_DOCTOR_ID
      );

      let service: string | null = null;
      if (normalized.service) {
        const mapped = normalizeServiceValue(normalized.service);
        if (doctor.serviceOptions.includes(mapped)) service = mapped;
      }

      // Keep everything in lock-step: the slider follows, the popup shows
      // exactly this doctor, and only a doctor-specific field (service) is
      // seeded — patient-entered fields stay untouched.
      setActiveDoctorId(doctor.id);
      setModalDoctorId(doctor.id);
      setPrefillService(service);
      setIsOpen(true);
    },
    []
  );

  const closeAppointmentModal = useCallback(() => {
    setIsOpen(false);
    setPrefillService(null);
  }, []);

  /**
   * Switching doctor INSIDE the popup updates the shared active doctor too,
   * so the homepage slider follows along. The form itself clears only the
   * doctor-specific service selection (see AppointmentForm).
   */
  const switchModalDoctor = useCallback((id: DoctorId) => {
    setModalDoctorId(id);
    setActiveDoctorId(id);
    setPrefillService(null);
  }, []);

  const value = useMemo<AppointmentContextValue>(
    () => ({
      activeDoctorId,
      activeDoctor: getDoctor(activeDoctorId),
      setActiveDoctor,
      isOpen,
      openAppointmentModal,
      closeAppointmentModal,
    }),
    [activeDoctorId, setActiveDoctor, isOpen, openAppointmentModal, closeAppointmentModal]
  );

  return (
    <AppointmentContext.Provider value={value}>
      {children}
      {isOpen && (
        <AppointmentModal
          doctor={getDoctor(modalDoctorId)}
          prefillService={prefillService}
          onSwitchDoctor={switchModalDoctor}
          onClose={closeAppointmentModal}
        />
      )}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  return useContext(AppointmentContext);
}
