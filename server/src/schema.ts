
import { z } from 'zod';

// Enums
export const userRoleSchema = z.enum(['admin', 'operator', 'viewer']);
export const languageSchema = z.enum(['en', 'pl', 'de', 'uk', 'ru']);
export const themeSchema = z.enum(['light', 'dark']);
export const deviceTypeSchema = z.enum(['sensor', 'meter', 'gateway', 'controller']);
export const deviceStatusSchema = z.enum(['online', 'offline', 'maintenance', 'error']);
export const sensorTypeSchema = z.enum(['air_quality', 'energy', 'temperature', 'humidity', 'pressure']);
export const documentTypeSchema = z.enum(['pdf', 'docx', 'txt', 'png', 'jpg']);
export const exportFormatSchema = z.enum(['jpg', 'pdf']);
export const tileTypeSchema = z.enum(['energy_consumption', 'air_quality', 'device_status', 'network_map', 'power_stats', 'failure_analysis']);

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  role: userRoleSchema,
  language: languageSchema,
  theme: themeSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Device schema
export const deviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: deviceTypeSchema,
  status: deviceStatusSchema,
  location: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  last_seen: z.coerce.date().nullable(),
  metadata: z.record(z.string(), z.any()).nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Device = z.infer<typeof deviceSchema>;

// Sensor schema
export const sensorSchema = z.object({
  id: z.number(),
  device_id: z.number(),
  type: sensorTypeSchema,
  name: z.string(),
  unit: z.string(),
  min_value: z.number().nullable(),
  max_value: z.number().nullable(),
  calibration_factor: z.number().default(1),
  is_active: z.boolean().default(true),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Sensor = z.infer<typeof sensorSchema>;

// Sensor reading schema
export const sensorReadingSchema = z.object({
  id: z.number(),
  sensor_id: z.number(),
  value: z.number(),
  raw_value: z.number().nullable(),
  quality_score: z.number().min(0).max(1).nullable(),
  timestamp: z.coerce.date(),
  created_at: z.coerce.date()
});

export type SensorReading = z.infer<typeof sensorReadingSchema>;

// Document schema
export const documentSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  filename: z.string(),
  original_filename: z.string(),
  file_type: documentTypeSchema,
  file_size: z.number(),
  file_path: z.string(),
  processed: z.boolean().default(false),
  summary: z.string().nullable(),
  extracted_text: z.string().nullable(),
  metadata: z.record(z.string(), z.any()).nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Document = z.infer<typeof documentSchema>;

// Chat conversation schema
export const chatConversationSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ChatConversation = z.infer<typeof chatConversationSchema>;

// Chat message schema
export const chatMessageSchema = z.object({
  id: z.number(),
  conversation_id: z.number(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  document_references: z.array(z.number()).nullable(),
  metadata: z.record(z.string(), z.any()).nullable(),
  created_at: z.coerce.date()
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

// Dashboard tile schema
export const dashboardTileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  type: tileTypeSchema,
  title: z.string(),
  position_x: z.number().int(),
  position_y: z.number().int(),
  width: z.number().int(),
  height: z.number().int(),
  config: z.record(z.string(), z.any()).nullable(),
  is_visible: z.boolean().default(true),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type DashboardTile = z.infer<typeof dashboardTileSchema>;

// Alert schema
export const alertSchema = z.object({
  id: z.number(),
  device_id: z.number().nullable(),
  sensor_id: z.number().nullable(),
  type: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string(),
  message: z.string(),
  acknowledged: z.boolean().default(false),
  acknowledged_by: z.number().nullable(),
  acknowledged_at: z.coerce.date().nullable(),
  resolved: z.boolean().default(false),
  resolved_at: z.coerce.date().nullable(),
  created_at: z.coerce.date()
});

export type Alert = z.infer<typeof alertSchema>;

// Input schemas for creating
export const createUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role: userRoleSchema,
  language: languageSchema.default('en'),
  theme: themeSchema.default('light')
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createDeviceInputSchema = z.object({
  name: z.string(),
  type: deviceTypeSchema,
  status: deviceStatusSchema.default('offline'),
  location: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type CreateDeviceInput = z.infer<typeof createDeviceInputSchema>;

export const createSensorInputSchema = z.object({
  device_id: z.number(),
  type: sensorTypeSchema,
  name: z.string(),
  unit: z.string(),
  min_value: z.number().nullable(),
  max_value: z.number().nullable(),
  calibration_factor: z.number().default(1),
  is_active: z.boolean().default(true)
});

export type CreateSensorInput = z.infer<typeof createSensorInputSchema>;

export const createSensorReadingInputSchema = z.object({
  sensor_id: z.number(),
  value: z.number(),
  raw_value: z.number().optional(),
  quality_score: z.number().min(0).max(1).optional(),
  timestamp: z.coerce.date().optional()
});

export type CreateSensorReadingInput = z.infer<typeof createSensorReadingInputSchema>;

export const uploadDocumentInputSchema = z.object({
  user_id: z.number(),
  filename: z.string(),
  original_filename: z.string(),
  file_type: documentTypeSchema,
  file_size: z.number(),
  file_path: z.string(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type UploadDocumentInput = z.infer<typeof uploadDocumentInputSchema>;

export const createChatConversationInputSchema = z.object({
  user_id: z.number(),
  title: z.string()
});

export type CreateChatConversationInput = z.infer<typeof createChatConversationInputSchema>;

export const createChatMessageInputSchema = z.object({
  conversation_id: z.number(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  document_references: z.array(z.number()).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type CreateChatMessageInput = z.infer<typeof createChatMessageInputSchema>;

export const createDashboardTileInputSchema = z.object({
  user_id: z.number(),
  type: tileTypeSchema,
  title: z.string(),
  position_x: z.number().int(),
  position_y: z.number().int(),
  width: z.number().int(),
  height: z.number().int(),
  config: z.record(z.string(), z.any()).optional(),
  is_visible: z.boolean().default(true)
});

export type CreateDashboardTileInput = z.infer<typeof createDashboardTileInputSchema>;

export const createAlertInputSchema = z.object({
  device_id: z.number().optional(),
  sensor_id: z.number().optional(),
  type: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string(),
  message: z.string()
});

export type CreateAlertInput = z.infer<typeof createAlertInputSchema>;

// Update schemas
export const updateUserInputSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  role: userRoleSchema.optional(),
  language: languageSchema.optional(),
  theme: themeSchema.optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const updateDeviceInputSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  status: deviceStatusSchema.optional(),
  location: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type UpdateDeviceInput = z.infer<typeof updateDeviceInputSchema>;

export const updateDashboardTileInputSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  position_x: z.number().int().optional(),
  position_y: z.number().int().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  config: z.record(z.string(), z.any()).optional(),
  is_visible: z.boolean().optional()
});

export type UpdateDashboardTileInput = z.infer<typeof updateDashboardTileInputSchema>;

// Query schemas
export const getSensorReadingsInputSchema = z.object({
  sensor_id: z.number(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  limit: z.number().int().positive().max(1000).default(100)
});

export type GetSensorReadingsInput = z.infer<typeof getSensorReadingsInputSchema>;

export const getDevicesInputSchema = z.object({
  type: deviceTypeSchema.optional(),
  status: deviceStatusSchema.optional(),
  limit: z.number().int().positive().max(1000).default(100)
});

export type GetDevicesInput = z.infer<typeof getDevicesInputSchema>;

export const chatQueryInputSchema = z.object({
  conversation_id: z.number(),
  message: z.string(),
  document_ids: z.array(z.number()).optional()
});

export type ChatQueryInput = z.infer<typeof chatQueryInputSchema>;

export const exportDashboardInputSchema = z.object({
  user_id: z.number(),
  format: exportFormatSchema,
  tile_ids: z.array(z.number()).optional()
});

export type ExportDashboardInput = z.infer<typeof exportDashboardInputSchema>;

// Response schemas
export const dashboardStatsSchema = z.object({
  total_devices: z.number(),
  online_devices: z.number(),
  offline_devices: z.number(),
  total_sensors: z.number(),
  active_alerts: z.number(),
  energy_consumption_today: z.number(),
  air_quality_average: z.number()
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

export const exportResultSchema = z.object({
  file_path: z.string(),
  file_size: z.number(),
  created_at: z.coerce.date()
});

export type ExportResult = z.infer<typeof exportResultSchema>;
