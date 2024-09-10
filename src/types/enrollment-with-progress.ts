import { Enrollment } from "@prisma/client";

export type EnrollementWithProgress = Enrollment & {
  progress: number; // This may need to be computed or fetched
  certificate: string; // This may need to be fetched or computed
  validity: string; // This may need to be computed or fetched
};
