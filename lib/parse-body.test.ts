import { describe, it, expect } from "vitest";
import {
  readJsonObject,
  asString,
  asNumber,
  asOptionalString,
  asOptionalNumber,
  asNullableString,
  asOptionalStringArray,
} from "@/lib/parse-body";
import { ValidationError } from "@/lib/errors";

function jsonRequest(body: string): Request {
  return new Request("http://test.local", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

describe("readJsonObject", () => {
  it("retorna o objeto quando o corpo é um JSON de objeto", async () => {
    const body = await readJsonObject(jsonRequest('{"name":"Treino A"}'));
    expect(body).toEqual({ name: "Treino A" });
  });

  it("rejeita JSON inválido", async () => {
    await expect(readJsonObject(jsonRequest("not json"))).rejects.toThrow(
      ValidationError,
    );
  });

  it.each([
    ["null", "null"],
    ["array", "[1,2]"],
    ["string", '"texto"'],
    ["número", "42"],
  ])("rejeita corpo que não é objeto (%s)", async (_label, raw) => {
    await expect(readJsonObject(jsonRequest(raw))).rejects.toThrow(
      ValidationError,
    );
  });
});

describe("asString", () => {
  it("aceita string", () => {
    expect(asString("abc")).toBe("abc");
  });

  it.each([undefined, null, 1, true, {}, []])("rejeita %s", (value) => {
    expect(() => asString(value)).toThrow(ValidationError);
  });
});

describe("asNumber", () => {
  it("aceita número", () => {
    expect(asNumber(3)).toBe(3);
  });

  it("converte string numérica", () => {
    expect(asNumber("12")).toBe(12);
  });

  it.each([undefined, null, "abc", NaN, Infinity, {}, true])(
    "rejeita %s",
    (value) => {
      expect(() => asNumber(value)).toThrow(ValidationError);
    },
  );
});

describe("asOptionalString", () => {
  it("undefined e null viram undefined (campo omitido)", () => {
    expect(asOptionalString(undefined)).toBeUndefined();
    expect(asOptionalString(null)).toBeUndefined();
  });

  it("string passa, outro tipo rejeita", () => {
    expect(asOptionalString("x")).toBe("x");
    expect(() => asOptionalString(5)).toThrow(ValidationError);
  });
});

describe("asOptionalNumber", () => {
  it("undefined e null viram undefined", () => {
    expect(asOptionalNumber(undefined)).toBeUndefined();
    expect(asOptionalNumber(null)).toBeUndefined();
  });

  it("número passa, não-numérico rejeita", () => {
    expect(asOptionalNumber(7)).toBe(7);
    expect(() => asOptionalNumber("abc")).toThrow(ValidationError);
  });
});

describe("asNullableString", () => {
  it("distingue omitido (undefined) de limpeza explícita (null)", () => {
    expect(asNullableString(undefined)).toBeUndefined();
    expect(asNullableString(null)).toBeNull();
  });

  it("string passa, outro tipo rejeita", () => {
    expect(asNullableString("url")).toBe("url");
    expect(() => asNullableString(123)).toThrow(ValidationError);
  });
});

describe("asOptionalStringArray", () => {
  it("undefined e null viram undefined", () => {
    expect(asOptionalStringArray(undefined)).toBeUndefined();
    expect(asOptionalStringArray(null)).toBeUndefined();
  });

  it("aceita lista de strings (inclusive vazia)", () => {
    expect(asOptionalStringArray([])).toEqual([]);
    expect(asOptionalStringArray(["Peito", "Costas"])).toEqual([
      "Peito",
      "Costas",
    ]);
  });

  it("rejeita lista com itens não-string e não-listas", () => {
    expect(() => asOptionalStringArray(["ok", 1])).toThrow(ValidationError);
    expect(() => asOptionalStringArray("Peito")).toThrow(ValidationError);
  });
});
