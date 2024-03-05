Claro, vou corrigir a inconsistência na nomenclatura. Farei a alteração de "ARS" para "RAS" para manter a consistência em todo o documento.

Aqui está a correção:

# GranularAC - Granular Access Control Library for Node.js

GranularAC is a TypeScript library designed to manage granular access control in Node.js applications. It offers a flexible and customizable solution for defining and enforcing access control rules based on resources, actions, and scopes. By leveraging the concepts of Role-Based Access Control (RBAC), GranularAC allows you to implement fine-grained access control in your application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Why Use GranularAC?](#why-use-granularac)
- [Key Concepts](#key-concepts)
  - [Permission String Format](#permission-string-format)

## Why Use GranularAC?

GranularAC provides several benefits for managing access control in your Node.js application:

1. **Granularity**: GranularAC allows you to define permissions at a granular level, specifying exactly which actions are permitted for each resource and scope combination. This granular approach gives you precise control over who can perform specific actions on specific resources.

2. **Flexibility**: With GranularAC, you can easily define and customize access control rules to suit the requirements of your application. Whether you need to restrict access to certain resources, actions, or scopes, GranularAC offers the flexibility to tailor access control rules to your specific use case.

3. **Scalability**: GranularAC is designed to scale with your application as it grows. Whether you're working on a small project or a large enterprise application, GranularAC can handle complex access control requirements and adapt to changes in your application over time.

4. **Security**: By implementing access control rules with GranularAC, you can enhance the security of your application by ensuring that only authorized users have access to sensitive resources and actions. This helps protect your application from unauthorized access and potential security breaches.

5. **Ease of Use**: GranularAC provides a simple and intuitive API for defining and verifying access control rules. With straightforward methods for creating permissions and checking permissions, GranularAC makes it easy to implement access control in your application.

## Key Concepts

GranularAC is based on the principles of Role-Based Access Control (RBAC), which involves the following key concepts:

- **Resource**: Any entity in your application that you want to control access to, such as a user, post, or document.

- **Action**: A specific operation that can be performed on a resource, such as creating, reading, updating, or deleting.

- **Scope**: The context or visibility of an action, which determines who can perform the action on the resource. Scopes can include "self" (referring to the current user), "others" (referring to other users), or custom scopes specific to your application's requirements.

- **Permission**: A combination of an action, resource, and scope that defines whether a user is allowed to perform a specific action on a specific resource within a certain scope.

By defining permissions based on these concepts, GranularAC enables you to control access to various features and functionalities within your application with precision and control.

### Permission String Format

The permission string format in GranularAC follows the pattern "action:resource:scope".

```
-> Action:Resource[:Scope?]

  > Action = "read";
  > Resource = "user";
  > Scope = ["others", "banned"];

Permission = "read:user"
Permission = "read:user:others"
Permission = "read:user:banned"
```

Together, these three components form a unique permission that defines whether a user is allowed to perform a particular action on a specific resource within a certain scope. The permission string format makes it easy to define and verify granular access permissions in a system.

## Installation

You can install GranularAC via npm using the following command:

```bash
npm install granular-ac
```

## Usage

GranularAC can be used to define and enforce access control rules in your application. Here's how you can use GranularAC in your Node.js application:

### Creating Permissions

To create permissions, first instantiate the `RAS` (Resource-Action-Scope) class with the desired resource and actions. Then use the `build` method to generate permission strings for specific actions and scopes.

```typescript
import { RAS } from "granular-ac";

// Define permissions for "post" resource
const postCredentials = new RAS("post", {
  create: ["public", "private", "others"],
  read: ["own", "others", "private"],
  update: ["own", "others", "private"],
  delete: ["own", "others", "private"],
} as const); // "as const" is used to enforce the type of the object

postCredentials.build("create"); // ['create:post']
postCredentials.build("read", "own"); // ['read:post:own']
postCredentials.build("update", "others"); // ['update:post:others']
postCredentials.build("delete", "private"); // ['delete:post:private']
postCredentials.build("delete", ["others", "public"]); // ['delete:post:others', 'delete:post:public']
```

### Verifying Permissions

You can use the `verify` method to check if a user has the required permissions to perform a specific action on a resource within a certain scope.

```typescript
const canRead = userCredentials.verify("read", "self", user.permissions);
```

### Integrating with Express Middleware

GranularAC can be

integrated with Express middleware to protect routes and endpoints in your application. By verifying permissions before allowing access to certain routes, you can ensure that only authorized users can perform certain actions.

```typescript
import express from "express";
import { RAS } from "granular-ac";

const app = express();

// Middleware to verify permissions
function verifyPermissions(req, res, next) {
  const post = await database.findPost(req.params.postId);

  const scope = post.owner.id === req.user.id ? "own" : "others";

  if (postCredentials.verify("read", scope, req.user.permissions)) {
    next();
  } else {
    res.status(403).send("Unauthorized");
  }
}

// Route to read a post
app.get("/posts/:postId", verifyPermissions, (req, res) => {
  // Handle request
});
```

## Contributing

Contributions to GranularAC are welcome! If you encounter any issues or have suggestions for improvements, feel free to submit issues and pull requests on the GitHub repository.

## License

GranularAC is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

By providing a comprehensive access control solution based on RBAC principles, GranularAC empowers developers to implement robust security measures in their Node.js applications, ensuring data privacy and protection against unauthorized access.
