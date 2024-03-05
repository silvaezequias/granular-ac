/**
 * Represents the format of a string denoting a resource.
 */
type StringRFormat = `<resource>`;

/**
 * Represents the format of a string denoting an action with a resource.
 */
type StringARFormat = `<action>:${StringRFormat}:`;

/**
 * Represents the format of a string denoting an action with a resource and a scope.
 */
type StringARSFormat = `${StringARFormat}:<scope>`;

/**
 * Represents the actions available for a specific resource.
 */
interface Action {
  [key: string]: [string, ...string[]];
}

/**
 * Represents the scope associated with a specific action.
 */
type Scope<A extends Action, K extends keyof A> = A[K][number];

/**
 * Class for managing granular access control based on actions, resources, and scopes.
 */
export class ARS<A extends Action> {
  /**
   * Creates an instance of ARS.
   * @param resource - The resource for which access control is managed.
   * @param actions - The actions available for the specified resource.
   */
  constructor(public resource: string, public actions: A) {}

  /**
   * Builds a permission string based on the provided action and scope.
   * @param action - The action to be performed on the resource.
   * @param scope - The scope in which the action is performed (optional).
   * @returns A permission string representing the action and scope.
   */
  private buildString<K extends keyof A, S extends Scope<A, K>>(
    action: K,
    scope?: S
  ): S extends undefined ? StringARFormat : StringARSFormat {
    const body: string[] = [action as string, this.resource];

    scope && body.push(scope);

    return body.join(":") as typeof scope extends undefined
      ? StringARFormat
      : StringARSFormat;
  }

  /**
   * Builds permission strings for the specified action and scopes.
   * @param action - The action for which permissions are generated.
   * @param scopes - The scopes for which permissions are generated (optional).
   * @returns An array of permission strings.
   */
  public build<K extends keyof A>(
    action: K,
    scopes?: Scope<A, K> | Scope<A, K>[]
  ) {
    if (scopes) {
      return (Array.isArray(scopes) ? scopes : [scopes]).map((scope) =>
        this.buildString(action, scope)
      );
    } else {
      return [this.buildString(action) as StringARFormat];
    }
  }

  /**
   * Generates a list of permission strings for all actions and scopes.
   * @param action - The specific action for which permissions are generated (optional).
   * @returns An array of permission strings.
   */
  public row(action?: keyof A) {
    const row: StringARSFormat[] = [];
    const actions: [string, string[]][] = [];

    if (action) {
      actions.push([action as string, this.actions[action]]);
    } else {
      actions.push(...Object.entries(this.actions));
    }

    actions.forEach(([action, scopes]) => {
      scopes.forEach((scope) => {
        row.push(this.buildString(action, scope));
      });
    });

    return row;
  }

  /**
   * Verifies whether a list of permissions includes the specified action and scopes.
   * @param action - The action to be verified.
   * @param scopes - The scopes associated with the action.
   * @param list - The list of permissions to be checked.
   * @returns A boolean indicating whether the permissions are verified.
   */
  public verify<K extends keyof A>(
    action: K,
    scopes: Scope<A, K> | Scope<A, K>[] | undefined,
    list: string[]
  ): boolean {
    const scopesArray = (Array.isArray(scopes) ? scopes : [scopes]).map(
      (scope) => this.buildString(action, scope)
    );

    return scopesArray.every((scope) => list.includes(scope));
  }
}
