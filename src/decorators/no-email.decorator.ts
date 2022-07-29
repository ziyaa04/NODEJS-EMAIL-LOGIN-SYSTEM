import { SetMetadata } from "@nestjs/common";

export const NoEmail = () => SetMetadata("no-email", true);
