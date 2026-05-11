// Cliente mínimo da API Asaas (v3).
// Doc: https://docs.asaas.com/reference/comece-por-aqui
//
// Usado em server actions e webhook handlers — NUNCA importar do client.
// A API key vai no header `access_token`.

const API_URL = process.env.ASAAS_API_URL ?? "https://sandbox.asaas.com/api/v3";

function apiKey() {
  const key = process.env.ASAAS_API_KEY;
  if (!key) {
    throw new Error(
      "ASAAS_API_KEY não configurada. Defina em .env.local antes de usar o checkout.",
    );
  }
  return key;
}

type AsaasErrorBody = {
  errors?: { code?: string; description?: string }[];
};

async function request<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, headers, ...rest } = init;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      access_token: apiKey(),
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : (init.body as BodyInit | undefined),
    cache: "no-store",
  });

  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as AsaasErrorBody;
      detail = body.errors?.map((e) => e.description).filter(Boolean).join(" | ") ?? "";
    } catch {
      // resposta sem JSON; ignora
    }
    throw new Error(
      `Asaas ${res.status} em ${path}${detail ? `: ${detail}` : ""}`,
    );
  }

  return (await res.json()) as T;
}

// =========================
// Customers
// =========================
export type AsaasCustomer = {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
};

export type AsaasCustomerInput = {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
};

// Cria cliente OU retorna existente (Asaas trata cpfCnpj como chave natural).
export async function upsertCustomer(input: AsaasCustomerInput): Promise<AsaasCustomer> {
  // 1) tenta achar por cpfCnpj
  const list = await request<{ data: AsaasCustomer[] }>(
    `/customers?cpfCnpj=${encodeURIComponent(input.cpfCnpj)}&limit=1`,
  );
  if (list.data && list.data.length > 0) {
    return list.data[0];
  }
  // 2) cria
  return await request<AsaasCustomer>("/customers", {
    method: "POST",
    json: input,
  });
}

// =========================
// Payments
// =========================
// billingType UNDEFINED = link de pagamento onde o cliente escolhe Pix/Cartão/Boleto.
export type AsaasBillingType = "UNDEFINED" | "PIX" | "CREDIT_CARD" | "BOLETO";

export type AsaasPayment = {
  id: string;
  customer: string;
  value: number;
  status: string;
  billingType: AsaasBillingType;
  invoiceUrl: string;
  dueDate: string;
};

export type CreatePaymentInput = {
  customerId: string;
  amountCents: number;
  description: string;
  externalReference: string; // nosso orders.id pra correlacionar no webhook
  dueDate?: string; // YYYY-MM-DD; default = hoje + 3 dias
  successUrl?: string; // pra onde Asaas redireciona após o pagamento
};

export async function createPayment(input: CreatePaymentInput): Promise<AsaasPayment> {
  const due = input.dueDate ?? defaultDueDate();
  return await request<AsaasPayment>("/payments", {
    method: "POST",
    json: {
      customer: input.customerId,
      billingType: "UNDEFINED",
      value: input.amountCents / 100,
      dueDate: due,
      description: input.description,
      externalReference: input.externalReference,
      ...(input.successUrl
        ? { callback: { successUrl: input.successUrl, autoRedirect: true } }
        : {}),
    },
  });
}

function defaultDueDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
}
