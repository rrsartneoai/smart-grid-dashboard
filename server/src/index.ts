
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';
import {
  createUserInputSchema,
  updateUserInputSchema,
  createDeviceInputSchema,
  updateDeviceInputSchema,
  getDevicesInputSchema,
  createSensorInputSchema,
  createSensorReadingInputSchema,
  getSensorReadingsInputSchema,
  uploadDocumentInputSchema,
  createChatConversationInputSchema,
  createChatMessageInputSchema,
  chatQueryInputSchema,
  createDashboardTileInputSchema,
  updateDashboardTileInputSchema,
  createAlertInputSchema,
  exportDashboardInputSchema
} from './schema';
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { updateUser } from './handlers/update_user';
import { createDevice } from './handlers/create_device';
import { getDevices } from './handlers/get_devices';
import { updateDevice } from './handlers/update_device';
import { createSensor } from './handlers/create_sensor';
import { getSensors } from './handlers/get_sensors';
import { createSensorReading } from './handlers/create_sensor_reading';
import { getSensorReadings } from './handlers/get_sensor_readings';
import { uploadDocument } from './handlers/upload_document';
import { getDocuments } from './handlers/get_documents';
import { processDocument } from './handlers/process_document';
import { createChatConversation } from './handlers/create_chat_conversation';
import { getChatConversations } from './handlers/get_chat_conversations';
import { createChatMessage } from './handlers/create_chat_message';
import { getChatMessages } from './handlers/get_chat_messages';
import { chatQuery } from './handlers/chat_query';
import { createDashboardTile } from './handlers/create_dashboard_tile';
import { getDashboardTiles } from './handlers/get_dashboard_tiles';
import { updateDashboardTile } from './handlers/update_dashboard_tile';
import { deleteDashboardTile } from './handlers/delete_dashboard_tile';
import { createAlert } from './handlers/create_alert';
import { getAlerts } from './handlers/get_alerts';
import { acknowledgeAlert } from './handlers/acknowledge_alert';
import { resolveAlert } from './handlers/resolve_alert';
import { getDashboardStats } from './handlers/get_dashboard_stats';
import { exportDashboard } from './handlers/export_dashboard';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  getUsers: publicProcedure
    .query(() => getUsers()),
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),

  // Device management
  createDevice: publicProcedure
    .input(createDeviceInputSchema)
    .mutation(({ input }) => createDevice(input)),
  getDevices: publicProcedure
    .input(getDevicesInputSchema.optional())
    .query(({ input }) => getDevices(input)),
  updateDevice: publicProcedure
    .input(updateDeviceInputSchema)
    .mutation(({ input }) => updateDevice(input)),

  // Sensor management
  createSensor: publicProcedure
    .input(createSensorInputSchema)
    .mutation(({ input }) => createSensor(input)),
  getSensors: publicProcedure
    .input(z.number().optional())
    .query(({ input }) => getSensors(input)),

  // Sensor readings
  createSensorReading: publicProcedure
    .input(createSensorReadingInputSchema)
    .mutation(({ input }) => createSensorReading(input)),
  getSensorReadings: publicProcedure
    .input(getSensorReadingsInputSchema)
    .query(({ input }) => getSensorReadings(input)),

  // Document management
  uploadDocument: publicProcedure
    .input(uploadDocumentInputSchema)
    .mutation(({ input }) => uploadDocument(input)),
  getDocuments: publicProcedure
    .input(z.number())
    .query(({ input }) => getDocuments(input)),
  processDocument: publicProcedure
    .input(z.number())
    .mutation(({ input }) => processDocument(input)),

  // Chat functionality
  createChatConversation: publicProcedure
    .input(createChatConversationInputSchema)
    .mutation(({ input }) => createChatConversation(input)),
  getChatConversations: publicProcedure
    .input(z.number())
    .query(({ input }) => getChatConversations(input)),
  createChatMessage: publicProcedure
    .input(createChatMessageInputSchema)
    .mutation(({ input }) => createChatMessage(input)),
  getChatMessages: publicProcedure
    .input(z.number())
    .query(({ input }) => getChatMessages(input)),
  chatQuery: publicProcedure
    .input(chatQueryInputSchema)
    .mutation(({ input }) => chatQuery(input)),

  // Dashboard tiles
  createDashboardTile: publicProcedure
    .input(createDashboardTileInputSchema)
    .mutation(({ input }) => createDashboardTile(input)),
  getDashboardTiles: publicProcedure
    .input(z.number())
    .query(({ input }) => getDashboardTiles(input)),
  updateDashboardTile: publicProcedure
    .input(updateDashboardTileInputSchema)
    .mutation(({ input }) => updateDashboardTile(input)),
  deleteDashboardTile: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteDashboardTile(input)),

  // Alerts
  createAlert: publicProcedure
    .input(createAlertInputSchema)
    .mutation(({ input }) => createAlert(input)),
  getAlerts: publicProcedure
    .input(z.number().optional())
    .query(({ input }) => getAlerts(input)),
  acknowledgeAlert: publicProcedure
    .input(z.object({ alertId: z.number(), userId: z.number() }))
    .mutation(({ input }) => acknowledgeAlert(input.alertId, input.userId)),
  resolveAlert: publicProcedure
    .input(z.number())
    .mutation(({ input }) => resolveAlert(input)),

  // Dashboard stats and export
  getDashboardStats: publicProcedure
    .query(() => getDashboardStats()),
  exportDashboard: publicProcedure
    .input(exportDashboardInputSchema)
    .mutation(({ input }) => exportDashboard(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Smart Grid Dashboard TRPC server listening at port: ${port}`);
}

start();
