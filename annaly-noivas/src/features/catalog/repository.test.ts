import { describe, expect, it } from "vitest";
import { fetchDress, fetchDresses } from "./repository";

describe("repository", () => {
  it("lista vestidos", async () => {
    expect((await fetchDresses(0)).length).toBeGreaterThan(0);
  });
  it("encontra por slug e retorna undefined se não existir", async () => {
    expect((await fetchDress("aurora", 0))?.name).toBe("Aurora");
    expect(await fetchDress("nao-existe", 0)).toBeUndefined();
  });
});
