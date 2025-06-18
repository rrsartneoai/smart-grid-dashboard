
import {
  serial,
  text,
  pgTable,
  timestamp,
  numeric,
  integer,
  boolean,
  jsonb,
  real,
  pgEnum
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRole = pgEnum('user_role', ['admin', 'operator', 'viewer']);
export const language = pgEnum('language', ['en', 'pl', 'de', 'uk', 'ru']);
export const theme = pgEnum('theme', ['light', 'dark']);
export const deviceType = pgEnum('device_type', ['sensor', 'meter', 'gateway', 'controller']);
export const deviceStatus = pgEnum('device_status', ['online', 'offline', 'maintenance', 'error']);
export const sensorType = pgEnum('sensor_type', ['air_quality', 'energy', 'temperature', 'humidity', 'pressure']);
export const documentType = pgEnum('document_type', ['pdf', 'docx', 'txt', 'png', 'jpg']);
export const tileType = pgEnum('tile_type', ['energy_consumption', 'air_quality', 'device_status', 'network_map', 'power_stats', 'failure_analysis']);
export const alertSeverity = pgEnum('alert_severity', ['low', 'medium', 'high', 'critical']);
export const messageRole = pgEnum('message_role', ['user', 'assistant']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRole('role').notNull(),
  language: language('language').notNull().default('en'),
  theme: theme('theme').notNull().default('light'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Devices table
export const devicesTable = pgTable('devices', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: deviceType('type').notNull(),
  status: deviceStatus('status').notNull().default('offline'),
  location: text('location'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  last_seen: timestamp('last_seen'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Sensors table
export const sensorsTable = pgTable('sensors', {
  id: serial('id').primaryKey(),
  device_id: integer('device_id').references(() => devicesTable.id).notNull(),
  type: sensorType('type').notNull(),
  name: text('name').notNull(),
  unit: text('unit').notNull(),
  min_value: real('min_value'),
  max_value: real('max_value'),
  calibration_factor: real('calibration_factor').notNull().default(1),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Sensor readings table
export const sensorReadingsTable = pgTable('sensor_readings', {
  id: serial('id').primaryKey(),
  sensor_id: integer('sensor_id').references(() => sensorsTable.id).notNull(),
  value: real('value').notNull(),
  raw_value: real('raw_value'),
  quality_score: real('quality_score'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Documents table
export const documentsTable = pgTable('documents', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  filename: text('filename').notNull(),
  original_filename: text('original_filename').notNull(),
  file_type: documentType('file_type').notNull(),
  file_size: integer('file_size').notNull(),
  file_path: text('file_path').notNull(),
  processed: boolean('processed').notNull().default(false),
  summary: text('summary'),
  extracted_text: text('extracted_text'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Chat conversations table
export const chatConversationsTable = pgTable('chat_conversations', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  title: text('title').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Chat messages table
export const chatMessagesTable = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  conversation_id: integer('conversation_id').references(() => chatConversationsTable.id).notNull(),
  role: messageRole('role').notNull(),
  content: text('content').notNull(),
  document_references: jsonb('document_references'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Dashboard tiles table
export const dashboardTilesTable = pgTable('dashboard_tiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  type: tileType('type').notNull(),
  title: text('title').notNull(),
  position_x: integer('position_x').notNull(),
  position_y: integer('position_y').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  config: jsonb('config'),
  is_visible: boolean('is_visible').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Alerts table
export const alertsTable = pgTable('alerts', {
  id: serial('id').primaryKey(),
  device_id: integer('device_id').references(() => devicesTable.id),
  sensor_id: integer('sensor_id').references(() => sensorsTable.id),
  type: text('type').notNull(),
  severity: alertSeverity('severity').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  acknowledged: boolean('acknowledged').notNull().default(false),
  acknowledged_by: integer('acknowledged_by').references(() => usersTable.id),
  acknowledged_at: timestamp('acknowledged_at'),
  resolved: boolean('resolved').notNull().default(false),
  resolved_at: timestamp('resolved_at'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  documents: many(documentsTable),
  chatConversations: many(chatConversationsTable),
  dashboardTiles: many(dashboardTilesTable),
  acknowledgedAlerts: many(alertsTable)
}));

export const devicesRelations = relations(devicesTable, ({ many }) => ({
  sensors: many(sensorsTable),
  alerts: many(alertsTable)
}));

export const sensorsRelations = relations(sensorsTable, ({ one, many }) => ({
  device: one(devicesTable, {
    fields: [sensorsTable.device_id],
    references: [devicesTable.id]
  }),
  readings: many(sensorReadingsTable),
  alerts: many(alertsTable)
}));

export const sensorReadingsRelations = relations(sensorReadingsTable, ({ one }) => ({
  sensor: one(sensorsTable, {
    fields: [sensorReadingsTable.sensor_id],
    references: [sensorsTable.id]
  })
}));

export const documentsRelations = relations(documentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [documentsTable.user_id],
    references: [usersTable.id]
  })
}));

export const chatConversationsRelations = relations(chatConversationsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [chatConversationsTable.user_id],
    references: [usersTable.id]
  }),
  messages: many(chatMessagesTable)
}));

export const chatMessagesRelations = relations(chatMessagesTable, ({ one }) => ({
  conversation: one(chatConversationsTable, {
    fields: [chatMessagesTable.conversation_id],
    references: [chatConversationsTable.id]
  })
}));

export const dashboardTilesRelations = relations(dashboardTilesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [dashboardTilesTable.user_id],
    references: [usersTable.id]
  })
}));

export const alertsRelations = relations(alertsTable, ({ one }) => ({
  device: one(devicesTable, {
    fields: [alertsTable.device_id],
    references: [devicesTable.id]
  }),
  sensor: one(sensorsTable, {
    fields: [alertsTable.sensor_id],
    references: [sensorsTable.id]
  }),
  acknowledgedBy: one(usersTable, {
    fields: [alertsTable.acknowledged_by],
    references: [usersTable.id]
  })
}));

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  devices: devicesTable,
  sensors: sensorsTable,
  sensorReadings: sensorReadingsTable,
  documents: documentsTable,
  chatConversations: chatConversationsTable,
  chatMessages: chatMessagesTable,
  dashboardTiles: dashboardTilesTable,
  alerts: alertsTable
};
