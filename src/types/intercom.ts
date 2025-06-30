// src/types/intercom.ts

// Tipos base do Intercom Canvas Kit
export interface IntercomConversation {
  id?: string;
  created_at?: number;
  updated_at?: number;
  admin_assignee_id?: string;
  source?: {
    type?: string;
    id?: string;
  };
  contact?: IntercomContact;
}

export interface IntercomAdmin {
  id?: string;
  name?: string;
  email?: string;
  type?: string;
  avatar?: {
    type?: string;
    image_url?: string;
  };
}

export interface IntercomContact {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
}

// Payload recebido no endpoint initialize
export interface IntercomInitializeRequest {
  conversation?: IntercomConversation;
  admin?: IntercomAdmin;
  contact?: IntercomContact;
  context?: {
    location?: string;
  };
}

// Payload recebido no endpoint submit
export interface IntercomSubmitRequest {
  component_id?: string;
  conversation?: IntercomConversation;
  admin?: IntercomAdmin;
  contact?: IntercomContact;
  user?: IntercomContact; // Às vezes o contact vem como user
  input_values?: Record<string, unknown>;
  current_canvas?: unknown;
}

// Metadados para envio para a Digibee
export interface EscalationMetadata {
  conversation_id: string;
  admin_assignee_id: string;
  client: {
    id: string;
    email: string;
    name: string;
  };
  clicked_by: {
    admin_id: string;
    admin_email: string;
    admin_name: string;
    click_timestamp: string;
  };
  action_details: {
    component_id: string;
    source: string;
    app_version: string;
  };
}

// Payload para a API da Digibee
export interface DigibeeEscalationPayload {
  msg: string;
  metadata: EscalationMetadata;
}

// Estrutura de componentes Canvas
export interface CanvasComponent {
  type: string;
  id: string;
  text?: string;
  style?: "header" | "body" | "error" | "muted";
  align?: "left" | "center" | "right";
  label?: string;
  action?: {
    type: "submit" | "url";
    url?: string;
  };
  size?: "xs" | "s" | "m" | "l" | "xl";
  items?: Array<{
    type: string;
    id: string;
    title?: string;
    subtitle?: string;
  }>;
}

// Resposta Canvas
export interface CanvasResponse {
  canvas: {
    content: {
      components: CanvasComponent[];
    };
  };
}

// Histórico de ações
export interface ActionHistoryItem {
  action: string;
  status: "success" | "error";
  message: string;
  timestamp: string;
  clicked_by?: {
    admin_id: string;
    admin_email: string;
    admin_name: string;
  };
}
