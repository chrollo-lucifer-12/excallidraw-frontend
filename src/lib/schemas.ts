import { z } from "zod";

export const whiteBoardSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Whiteboard name should be atleast 3 characters long" }),
});
