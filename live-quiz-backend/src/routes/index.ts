import { Hono } from "hono";
import { userRouter } from "./user";

export const rootRouter = new Hono();

rootRouter.route('/user', userRouter)
