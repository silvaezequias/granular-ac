import { describe, expect, it } from "@jest/globals";
import { ARS } from "../src/ARS";

describe("`Resource-Action-Scope` Class", () => {
  const ars = new ARS("resource", {
    create: ["scope"],
    read: ["scope1", "scope2"],
    update: ["scope1", "scope2"],
    delete: ["scope1", "scope2"],
  } as const);

  describe("Constructor", () => {
    it("instance should contain correct resource", () => {
      expect(ars.resource).toBe("resource");
    });

    it("instance should contain correct actions", () => {
      expect(Object.keys(ars.actions)).toEqual([
        "create",
        "read",
        "update",
        "delete",
      ]);
    });

    it("actions should contain correct scopes", () => {
      expect(ars.actions.read).toEqual(["scope1", "scope2"]);
    });
  });

  describe("`build` method", () => {
    it("should return correct strings", () => {
      expect(ars.build("create")).toEqual(["create:resource"]);
      expect(ars.build("read")).toEqual(["read:resource"]);
      expect(ars.build("update")).toEqual(["update:resource"]);
      expect(ars.build("delete")).toEqual(["delete:resource"]);

      expect(ars.build("create", "scope")).toEqual(["create:resource:scope"]);

      expect(ars.build("read", "scope1")).toEqual(["read:resource:scope1"]);
      expect(ars.build("read", "scope2")).toEqual(["read:resource:scope2"]);

      expect(ars.build("update", "scope1")).toEqual(["update:resource:scope1"]);
      expect(ars.build("update", "scope2")).toEqual(["update:resource:scope2"]);

      expect(ars.build("delete", "scope1")).toEqual(["delete:resource:scope1"]);
      expect(ars.build("delete", "scope2")).toEqual(["delete:resource:scope2"]);
    });
  });

  describe("`verify` method", () => {
    it("should return true if all scopes are in list", () => {
      expect(ars.verify("create", undefined, ["create:resource"])).toBe(true);
      expect(ars.verify("read", "scope1", ["read:resource:scope1"])).toBe(true);
    });

    it("should return false if any scope is not in list", () => {
      expect(ars.verify("create", undefined, ["create:resource:scope"])).toBe(
        false
      );

      expect(ars.verify("read", "scope1", ["read:resource:scope2"])).toBe(
        false
      );
    });
  });

  describe("`row` method", () => {
    it("should return correct rows", () => {
      expect(ars.row()).toEqual([
        "create:resource:scope",
        "read:resource:scope1",
        "read:resource:scope2",
        "update:resource:scope1",
        "update:resource:scope2",
        "delete:resource:scope1",
        "delete:resource:scope2",
      ]);

      expect(ars.row("create")).toEqual(["create:resource:scope"]);

      expect(ars.row("read")).toEqual([
        "read:resource:scope1",
        "read:resource:scope2",
      ]);

      expect(ars.row("update")).toEqual([
        "update:resource:scope1",
        "update:resource:scope2",
      ]);

      expect(ars.row("delete")).toEqual([
        "delete:resource:scope1",
        "delete:resource:scope2",
      ]);
    });
  });
});
