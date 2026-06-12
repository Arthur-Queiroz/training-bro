import { describe, it, expect, vi, afterEach } from "vitest";
import {
  ok,
  err,
  unauthorized,
  notFound,
  handleError,
} from "@/lib/api-response";
import { NotFoundError, ValidationError } from "@/lib/errors";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ok / err / unauthorized / notFound", () => {
  it("ok envelopa os dados com status 200 por padrão", async () => {
    const res = ok({ id: "1" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, data: { id: "1" } });
  });

  it("ok aceita status custom (201)", () => {
    expect(ok({}, 201).status).toBe(201);
  });

  it("err retorna 400 com a mensagem", async () => {
    const res = err("mensagem");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "mensagem" });
  });

  it("unauthorized retorna 401 e notFound retorna 404", () => {
    expect(unauthorized().status).toBe(401);
    expect(notFound().status).toBe(404);
  });
});

describe("handleError", () => {
  it("ValidationError vira 400 com a mensagem do erro", async () => {
    const res = handleError(new ValidationError("Nome é obrigatório"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: "Nome é obrigatório",
    });
  });

  it("NotFoundError vira 404 com a mensagem do erro", async () => {
    const res = handleError(new NotFoundError("Treino não encontrado"));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      ok: false,
      error: "Treino não encontrado",
    });
  });

  it("erro inesperado vira 500 genérico SEM vazar detalhes internos", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = handleError(
      new Error("connect ECONNREFUSED db.supabase.co:5432"),
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ ok: false, error: "Erro interno do servidor" });
    expect(JSON.stringify(body)).not.toContain("ECONNREFUSED");
  });

  it("valor não-Error também vira 500 genérico", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = handleError("string solta");
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      ok: false,
      error: "Erro interno do servidor",
    });
  });
});
