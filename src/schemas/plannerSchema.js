import { z } from "zod";

const dynamicNode =
  z.record(z.any());

export const plannerSchema =
  z.object({

    domains:
      z.object({

      presentation:
        dynamicNode,

      application:
        dynamicNode,

      persistence:
        dynamicNode,

      architecture:
        dynamicNode,

      infrastructure:
        dynamicNode,

      integration:
        dynamicNode,

      concepts:
        dynamicNode
    }),

    requirements:
      z.array(z.string()),

    constraints:
      z.array(z.string()),

    metadata:
      z.object({

        complexity:
          z.string(),

        project_type:
          z.string()
          .nullable(),

        confidence:
          z.number()
      })
});