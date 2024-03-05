type StringRFormat = `<resource>`;
type StringARFormat = `<action>:${StringRFormat}:`;
type StringARSFormat = `${StringARFormat}:<scope>`;

interface Action {
  [key: string]: [string, ...string[]];
}

type Scope<A extends Action, K extends keyof A> = A[K][number];

export class ARS<A extends Action> {
  constructor(public resource: string, public actions: A) {}

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
