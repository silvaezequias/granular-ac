import { describe, expect, it } from "@jest/globals";
import { ARS } from "../src/ARS";

describe("`Action-Resource-Scope` Class", () => {
  const ars = new ARS("resource", {
    create: ["scope"],
    read: ["scope1", "scope2"],
    update: ["scope1", "scope2"],
    delete: ["scope1", "scope2"],
  } as const);

  const arsPermissions = ars.build();

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
    it("should return correct permissions for each action", () => {
      expect(arsPermissions.create._this).toEqual("create:resource");
      expect(arsPermissions.read._this).toEqual("read:resource");
      expect(arsPermissions.update._this).toEqual("update:resource");
      expect(arsPermissions.delete._this).toEqual("delete:resource");

      expect(arsPermissions.create.scope).toEqual("create:resource:scope");

      expect(arsPermissions.read.scope1).toEqual("read:resource:scope1");
      expect(arsPermissions.read.scope2).toEqual("read:resource:scope2");

      expect(arsPermissions.update.scope1).toEqual("update:resource:scope1");
      expect(arsPermissions.update.scope2).toEqual("update:resource:scope2");

      expect(arsPermissions.delete.scope1).toEqual("delete:resource:scope1");
      expect(arsPermissions.delete.scope2).toEqual("delete:resource:scope2");
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
